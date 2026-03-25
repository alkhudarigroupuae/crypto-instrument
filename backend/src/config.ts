import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: required("JWT_SECRET"),
  jwt2faSecret: process.env.JWT_2FA_SECRET ?? required("JWT_SECRET"),
  convexUrl: required("CONVEX_URL"),
  backendSecret: required("BACKEND_SECRET"),
  totpEncryptionKeyHex: required("TOTP_ENCRYPTION_KEY"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 12),
  accessTokenTtlSec: Number(process.env.ACCESS_TOKEN_TTL_SEC ?? 60 * 60 * 24 * 7),
  twoFaTokenTtlSec: Number(process.env.TWO_FA_TOKEN_TTL_SEC ?? 300),
};
