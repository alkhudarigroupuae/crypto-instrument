import type { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { z } from "zod";
import { config } from "../config.js";
import { api, backendArgs, client } from "../services/convexClient.js";
import { encryptTotpSecret, decryptTotpSecret } from "../services/cryptoVault.js";
import {
  loginBody,
  registerBody,
  verify2faBody,
  verifyRegistrationBody,
} from "../lib/validation.js";
import {
  signTwoFaToken,
  signAccessToken,
  verifyTwoFaToken,
} from "../middleware/auth.js";
import crypto from "node:crypto";

async function audit(
  userId: string,
  action: string,
  ip: string | undefined,
  detail?: string
) {
  await client.mutation(api.audit.log, backendArgs({ userId, action, ip, detail }));
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (request, reply) => {
    const parsed = registerBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;
    const hash = await bcrypt.hash(password, config.bcryptRounds);
    const secret = speakeasy.generateSecret({
      name: `SparkFi (${email})`,
      issuer: "SparkFi",
    });
    if (!secret.base32) {
      return reply.code(500).send({ error: "TOTP generation failed" });
    }
    const encrypted = encryptTotpSecret(secret.base32);
    const verifyTok = cryptoRandomUrlToken();
    let userId: string;
    try {
      userId = await client.mutation(
        api.users.createUser,
        backendArgs({
          email,
          passwordHash: hash,
          encryptedTotpSecret: encrypted,
          totpVerified: false,
          emailVerificationToken: verifyTok,
        })
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Register failed";
      if (msg.includes("already registered")) {
        return reply.code(409).send({ error: "Email already registered" });
      }
      request.log.error(e);
      return reply.code(500).send({ error: "Registration failed" });
    }
    const otpauth = secret.otpauth_url ?? "";
    const qrDataUrl = await QRCode.toDataURL(otpauth, { margin: 1, width: 240 });
    await client.mutation(
      api.finance.seedDemoBalances,
      backendArgs({ userId })
    );
    const base = process.env.PUBLIC_APP_URL ?? "http://localhost:3000";
    return reply.send({
      email,
      qrDataUrl,
      manualKey: secret.base32,
      verifyEmailUrl: `${base}/verify-email?token=${verifyTok}`,
    });
  });

  app.post("/auth/verify-registration", async (request, reply) => {
    const parsed = verifyRegistrationBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }
    const { email, token } = parsed.data;
    const user = await client.query(
      api.users.getUserByEmail,
      backendArgs({ email })
    );
    if (!user || !user.encryptedTotpSecret) {
      return reply.code(404).send({ error: "User not found" });
    }
    if (user.totpVerified) {
      return reply.code(400).send({ error: "2FA already enabled" });
    }
    const raw = decryptTotpSecret(user.encryptedTotpSecret);
    const ok = speakeasy.totp.verify({
      secret: raw,
      encoding: "base32",
      token,
      window: 1,
    });
    if (!ok) {
      return reply.code(401).send({ error: "Invalid OTP" });
    }
    await client.mutation(
      api.users.setTotpVerified,
      backendArgs({
        userId: user._id,
        encryptedTotpSecret: user.encryptedTotpSecret,
      })
    );
    await audit(user._id, "totp_enabled", request.ip, email);
    return reply.send({ ok: true });
  });

  app.post("/auth/login", async (request, reply) => {
    const parsed = loginBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;
    const user = await client.query(
      api.users.getUserByEmail,
      backendArgs({ email })
    );
    if (!user) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }
    if (!user.totpVerified) {
      return reply.code(403).send({
        error: "Complete 2FA setup first",
        code: "2FA_SETUP_REQUIRED",
      });
    }
    const tempToken = signTwoFaToken(user._id);
    await audit(user._id, "login_password_ok", request.ip);
    return reply.send({ requires2fa: true, tempToken });
  });

  app.post("/auth/verify-2fa", async (request, reply) => {
    const parsed = verify2faBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }
    const { tempToken, token } = parsed.data;
    let sub: string;
    try {
      sub = verifyTwoFaToken(tempToken).sub;
    } catch {
      return reply.code(401).send({ error: "Invalid or expired 2FA session" });
    }
    const user = await client.query(
      api.users.getUserById,
      backendArgs({ userId: sub })
    );
    if (!user?.encryptedTotpSecret) {
      return reply.code(401).send({ error: "Invalid session" });
    }
    const raw = decryptTotpSecret(user.encryptedTotpSecret);
    const ok = speakeasy.totp.verify({
      secret: raw,
      encoding: "base32",
      token,
      window: 1,
    });
    if (!ok) {
      return reply.code(401).send({ error: "Invalid OTP" });
    }
    const accessToken = signAccessToken(user._id);
    await audit(user._id, "login_complete", request.ip);
    return reply.send({
      accessToken,
      expiresIn: config.accessTokenTtlSec,
      tokenType: "Bearer",
    });
  });

  app.get("/auth/verify-email", async (request, reply) => {
    const q = z.object({ token: z.string().min(8) }).safeParse(request.query);
    if (!q.success) {
      return reply.code(400).send({ error: "Missing token" });
    }
    const res = await client.mutation(
      api.users.verifyEmailToken,
      backendArgs({ token: q.data.token })
    );
    if (!res.ok) {
      return reply.code(400).send({ error: "Invalid or expired link" });
    }
    return reply.send({ ok: true });
  });
}

function cryptoRandomUrlToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}
