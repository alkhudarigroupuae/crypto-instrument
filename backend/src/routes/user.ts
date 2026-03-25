import type { FastifyInstance } from "fastify";
import { api, backendArgs, client } from "../services/convexClient.js";
import { requireAccessToken } from "../middleware/auth.js";
const LENDING_APY = [
  { asset: "ETH", apy: 4.2, label: "Lend ETH" },
  { asset: "WBTC", apy: 3.1, label: "Lend WBTC" },
  { asset: "USDC", apy: 8.7, label: "Lend USDC" },
];

export async function userRoutes(app: FastifyInstance) {
  app.get("/user/profile", async (request, reply) => {
    if (!(await requireAccessToken(request, reply))) return;
    const userId = request.userId!;
    const user = await client.query(
      api.users.getUserById,
      backendArgs({ userId })
    );
    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }
    const [balances, positions, transactions, auditTail] = await Promise.all([
      client.query(api.finance.getBalances, backendArgs({ userId })),
      client.query(api.finance.getPositions, backendArgs({ userId })),
      client.query(
        api.transactions.listByUser,
        backendArgs({ userId, limit: 25 })
      ),
      client.query(api.audit.recent, backendArgs({ userId, limit: 15 })),
    ]);
    return reply.send({
      user: {
        email: user.email,
        emailVerified: user.emailVerified ?? false,
        totpVerified: user.totpVerified,
        createdAt: user.createdAt,
      },
      balances,
      positions,
      transactions,
      audit: auditTail,
      lending: LENDING_APY,
    });
  });
}
