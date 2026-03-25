import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    encryptedTotpSecret: v.optional(v.string()),
    totpVerified: v.boolean(),
    emailVerified: v.optional(v.boolean()),
    emailVerificationToken: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  balances: defineTable({
    userId: v.id("users"),
    asset: v.string(),
    amount: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_asset", ["userId", "asset"]),

  transactions: defineTable({
    userId: v.id("users"),
    type: v.string(),
    asset: v.string(),
    amount: v.number(),
    metadata: v.optional(v.string()),
    ts: v.number(),
  }).index("by_user_ts", ["userId", "ts"]),

  positions: defineTable({
    userId: v.id("users"),
    collateralAsset: v.string(),
    collateralAmount: v.number(),
    borrowedAsset: v.string(),
    borrowedAmount: v.number(),
    healthFactor: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  auditLogs: defineTable({
    userId: v.id("users"),
    action: v.string(),
    ip: v.optional(v.string()),
    ts: v.number(),
    detail: v.optional(v.string()),
  }).index("by_user_ts", ["userId", "ts"]),
});
