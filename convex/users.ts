import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireBackendSecret } from "./lib/backendAuth";

export const createUser = mutation({
  args: {
    backendSecret: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    encryptedTotpSecret: v.optional(v.string()),
    totpVerified: v.boolean(),
    emailVerificationToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
    if (existing) {
      throw new Error("Email already registered");
    }
    const now = Date.now();
    return await ctx.db.insert("users", {
      email: args.email.toLowerCase(),
      passwordHash: args.passwordHash,
      encryptedTotpSecret: args.encryptedTotpSecret,
      totpVerified: args.totpVerified,
      emailVerified: false,
      emailVerificationToken: args.emailVerificationToken,
      createdAt: now,
    });
  },
});

export const getUserByEmail = query({
  args: { backendSecret: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
  },
});

export const getUserById = query({
  args: { backendSecret: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    return await ctx.db.get(args.userId);
  },
});

export const setTotpVerified = mutation({
  args: {
    backendSecret: v.string(),
    userId: v.id("users"),
    encryptedTotpSecret: v.string(),
  },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    await ctx.db.patch(args.userId, {
      totpVerified: true,
      encryptedTotpSecret: args.encryptedTotpSecret,
    });
  },
});

export const verifyEmailToken = mutation({
  args: { backendSecret: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("emailVerificationToken"), args.token))
      .first();
    if (!user) return { ok: false as const };
    await ctx.db.patch(user._id, {
      emailVerified: true,
      emailVerificationToken: undefined,
    });
    return { ok: true as const, userId: user._id };
  },
});
