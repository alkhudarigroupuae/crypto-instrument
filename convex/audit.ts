import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireBackendSecret } from "./lib/backendAuth";

export const log = mutation({
  args: {
    backendSecret: v.string(),
    userId: v.id("users"),
    action: v.string(),
    ip: v.optional(v.string()),
    detail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    await ctx.db.insert("auditLogs", {
      userId: args.userId,
      action: args.action,
      ip: args.ip,
      detail: args.detail,
      ts: Date.now(),
    });
  },
});

export const recent = query({
  args: {
    backendSecret: v.string(),
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    const lim = Math.min(args.limit ?? 30, 100);
    return await ctx.db
      .query("auditLogs")
      .withIndex("by_user_ts", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(lim);
  },
});
