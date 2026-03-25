import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export type AccessJwt = { sub: string; typ: "access" };

export async function requireAccessToken(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<boolean> {
  const h = request.headers.authorization;
  if (!h?.startsWith("Bearer ")) {
    await reply.code(401).send({ error: "Missing bearer token" });
    return false;
  }
  const token = h.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AccessJwt;
    if (decoded.typ !== "access") {
      await reply.code(401).send({ error: "Invalid token type" });
      return false;
    }
    (request as FastifyRequest & { userId: string }).userId = decoded.sub;
    return true;
  } catch {
    await reply.code(401).send({ error: "Invalid or expired token" });
    return false;
  }
}

export function signAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId, typ: "access" },
    config.jwtSecret,
    { expiresIn: config.accessTokenTtlSec }
  );
}

export function signTwoFaToken(userId: string): string {
  return jwt.sign(
    { sub: userId, typ: "2fa" },
    config.jwt2faSecret,
    { expiresIn: config.twoFaTokenTtlSec }
  );
}

export function verifyTwoFaToken(token: string): { sub: string } {
  const decoded = jwt.verify(token, config.jwt2faSecret) as {
    sub: string;
    typ: string;
  };
  if (decoded.typ !== "2fa") throw new Error("Invalid 2FA token");
  return { sub: decoded.sub };
}
