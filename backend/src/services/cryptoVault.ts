import crypto from "node:crypto";
import { config } from "../config.js";

const ALGO = "aes-256-gcm";

function key(): Buffer {
  return Buffer.from(config.totpEncryptionKeyHex, "hex");
}

export function encryptTotpSecret(plainBase32: string): string {
  const k = key();
  if (k.length !== 32) {
    throw new Error("TOTP_ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, k, iv);
  const enc = Buffer.concat([
    cipher.update(plainBase32, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function decryptTotpSecret(blob: string): string {
  const k = key();
  const buf = Buffer.from(blob, "base64url");
  const iv = buf.subarray(0, 16);
  const tag = buf.subarray(16, 32);
  const data = buf.subarray(32);
  const decipher = crypto.createDecipheriv(ALGO, k, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    "utf8"
  );
}
