import { z } from "zod";

export const emailSchema = z.string().trim().email().max(320);
export const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128);

export const registerBody = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const verifyRegistrationBody = z.object({
  email: emailSchema,
  token: z.string().length(6),
});

export const loginBody = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const verify2faBody = z.object({
  tempToken: z.string().min(10),
  token: z.string().length(6),
});

export const depositBody = z.object({
  asset: z.enum(["ETH", "USDC", "WBTC"]),
  amount: z.number().positive().max(1e12),
});

export const borrowBody = z.object({
  collateralAsset: z.enum(["ETH", "USDC", "WBTC"]),
  collateralAmount: z.number().positive().max(1e9),
  borrowAmount: z.number().positive().max(1e9),
});
