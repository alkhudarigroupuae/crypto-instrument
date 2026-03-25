import { makeFunctionReference } from "convex/server";

/** Stable references for Convex HTTP client (no import from repo `convex/_generated`). */
export const api = {
  users: {
    createUser: makeFunctionReference<"mutation">("users:createUser"),
    getUserByEmail: makeFunctionReference<"query">("users:getUserByEmail"),
    getUserById: makeFunctionReference<"query">("users:getUserById"),
    setTotpVerified: makeFunctionReference<"mutation">("users:setTotpVerified"),
    verifyEmailToken: makeFunctionReference<"mutation">("users:verifyEmailToken"),
  },
  transactions: {
    listByUser: makeFunctionReference<"query">("transactions:listByUser"),
    append: makeFunctionReference<"mutation">("transactions:append"),
  },
  finance: {
    getBalances: makeFunctionReference<"query">("finance:getBalances"),
    upsertBalance: makeFunctionReference<"mutation">("finance:upsertBalance"),
    getPositions: makeFunctionReference<"query">("finance:getPositions"),
    upsertBorrowPosition: makeFunctionReference<"mutation">(
      "finance:upsertBorrowPosition"
    ),
    seedDemoBalances: makeFunctionReference<"mutation">(
      "finance:seedDemoBalances"
    ),
  },
  audit: {
    log: makeFunctionReference<"mutation">("audit:log"),
    recent: makeFunctionReference<"query">("audit:recent"),
  },
};
