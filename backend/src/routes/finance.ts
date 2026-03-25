import type { FastifyInstance } from "fastify";
import { api, backendArgs, client } from "../services/convexClient.js";
import { requireAccessToken } from "../middleware/auth.js";
import { borrowBody, depositBody } from "../lib/validation.js";
async function audit(
  userId: string,
  action: string,
  ip: string | undefined,
  detail?: string
) {
  await client.mutation(api.audit.log, backendArgs({ userId, action, ip, detail }));
}

export async function financeRoutes(app: FastifyInstance) {
  app.post("/deposit", async (request, reply) => {
    if (!(await requireAccessToken(request, reply))) return;
    const userId = request.userId!;
    const parsed = depositBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }
    const { asset, amount } = parsed.data;
    await client.mutation(
      api.finance.upsertBalance,
      backendArgs({ userId, asset, delta: amount })
    );
    await client.mutation(
      api.transactions.append,
      backendArgs({
        userId,
        type: "deposit",
        asset,
        amount,
        metadata: JSON.stringify({ source: "app" }),
      })
    );
    await audit(userId, "deposit", request.ip, `${amount} ${asset}`);
    return reply.send({ ok: true });
  });

  app.post("/borrow", async (request, reply) => {
    if (!(await requireAccessToken(request, reply))) return;
    const userId = request.userId!;
    const parsed = borrowBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }
    const { collateralAsset, collateralAmount, borrowAmount } = parsed.data;
    const balances = await client.query(
      api.finance.getBalances,
      backendArgs({ userId })
    );
    const row = balances.find(
      (b: { asset: string; amount: number }) => b.asset === collateralAsset
    );
    const have = row?.amount ?? 0;
    if (have < collateralAmount) {
      return reply.code(400).send({ error: "Insufficient collateral balance" });
    }
    await client.mutation(
      api.finance.upsertBalance,
      backendArgs({
        userId,
        asset: collateralAsset,
        delta: -collateralAmount,
      })
    );
    await client.mutation(
      api.finance.upsertBalance,
      backendArgs({
        userId,
        asset: "USDC",
        delta: borrowAmount,
      })
    );
    await client.mutation(
      api.finance.upsertBorrowPosition,
      backendArgs({
        userId,
        collateralAsset,
        collateralDelta: collateralAmount,
        borrowedAsset: "USDC",
        borrowedDelta: borrowAmount,
      })
    );
    await client.mutation(
      api.transactions.append,
      backendArgs({
        userId,
        type: "borrow",
        asset: "USDC",
        amount: borrowAmount,
        metadata: JSON.stringify({ collateralAsset, collateralAmount }),
      })
    );
    await audit(
      userId,
      "borrow",
      request.ip,
      `${borrowAmount} USDC vs ${collateralAmount} ${collateralAsset}`
    );
    return reply.send({ ok: true });
  });

  app.get("/positions", async (request, reply) => {
    if (!(await requireAccessToken(request, reply))) return;
    const userId = request.userId!;
    const positions = await client.query(
      api.finance.getPositions,
      backendArgs({ userId })
    );
    const balances = await client.query(
      api.finance.getBalances,
      backendArgs({ userId })
    );
    return reply.send({ positions, balances });
  });
}
