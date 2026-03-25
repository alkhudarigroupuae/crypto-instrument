import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireBackendSecret } from "./lib/backendAuth";

const DEFAULT_ASSETS = ["ETH", "USDC", "WBTC"] as const;

export const getBalances = query({
  args: { backendSecret: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    const rows = await ctx.db
      .query("balances")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const map = new Map(rows.map((r) => [r.asset, r.amount]));
    return DEFAULT_ASSETS.map((asset) => ({
      asset,
      amount: map.get(asset) ?? 0,
    }));
  },
});

export const upsertBalance = mutation({
  args: {
    backendSecret: v.string(),
    userId: v.id("users"),
    asset: v.string(),
    delta: v.number(),
  },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    const existing = await ctx.db
      .query("balances")
      .withIndex("by_user_asset", (q) =>
        q.eq("userId", args.userId).eq("asset", args.asset)
      )
      .first();
    const next = Math.max(0, (existing?.amount ?? 0) + args.delta);
    if (existing) {
      await ctx.db.patch(existing._id, { amount: next });
    } else {
      await ctx.db.insert("balances", {
        userId: args.userId,
        asset: args.asset,
        amount: next,
      });
    }
  },
});

export const getPositions = query({
  args: { backendSecret: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    return await ctx.db
      .query("positions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const upsertBorrowPosition = mutation({
  args: {
    backendSecret: v.string(),
    userId: v.id("users"),
    collateralAsset: v.string(),
    collateralDelta: v.number(),
    borrowedAsset: v.string(),
    borrowedDelta: v.number(),
  },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    const existing = await ctx.db
      .query("positions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    const now = Date.now();
    const coll = Math.max(0, (existing?.collateralAmount ?? 0) + args.collateralDelta);
    const borr = Math.max(0, (existing?.borrowedAmount ?? 0) + args.borrowedDelta);
    const healthFactor = borr === 0 ? 99 : Math.min(99, (coll * 1.5) / borr);
    if (existing) {
      await ctx.db.patch(existing._id, {
        collateralAsset: args.collateralAsset,
        collateralAmount: coll,
        borrowedAsset: args.borrowedAsset,
        borrowedAmount: borr,
        healthFactor,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("positions", {
        userId: args.userId,
        collateralAsset: args.collateralAsset,
        collateralAmount: coll,
        borrowedAsset: args.borrowedAsset,
        borrowedAmount: borr,
        healthFactor,
        updatedAt: now,
      });
    }
  },
});

export const seedDemoBalances = mutation({
  args: { backendSecret: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    requireBackendSecret(args.backendSecret);
    for (const asset of DEFAULT_ASSETS) {
      const existing = await ctx.db
        .query("balances")
        .withIndex("by_user_asset", (q) =>
          q.eq("userId", args.userId).eq("asset", asset)
        )
        .first();
      if (!existing) {
        const demo =
          asset === "ETH" ? 2.5 : asset === "USDC" ? 10000 : 0.08;
        await ctx.db.insert("balances", {
          userId: args.userId,
          asset,
          amount: demo,
        });
      }
    }
  },
});
