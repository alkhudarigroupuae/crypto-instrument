import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireBackendSecret } from "./lib/backendAuth";

export const listByUser = query({
  args: {
    backendSecret: v.string(),
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    const lim = Math.min(args.limit ?? 50, 200);
    return await ctx.db
      .query("transactions")
      .withIndex("by_user_ts", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(lim);
  },
});

export const append = mutation({
  args: {
    backendSecret: v.string(),
    userId: v.id("users"),
    type: v.string(),
    asset: v.string(),
    amount: v.number(),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    await ctx.db.insert("transactions", {
      userId: args.userId,
      type: args.type,
      asset: args.asset,
      amount: args.amount,
      metadata: args.metadata,
      ts: Date.now(),
    });
  },
});
