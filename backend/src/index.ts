import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config.js";
import { authRoutes } from "./routes/auth.js";
import { userRoutes } from "./routes/user.js";
import { financeRoutes } from "./routes/finance.js";

async function main() {
  const app = Fastify({
    logger: config.nodeEnv === "production",
    trustProxy: true,
  });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: config.corsOrigin.split(",").map((s) => s.trim()),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(rateLimit, {
    max: 300,
    timeWindow: "1 minute",
  });

  await app.register(authRoutes);
  await app.register(userRoutes);
  await app.register(financeRoutes);

  app.get("/health", async () => ({ ok: true }));

  await app.listen({ port: config.port, host: "0.0.0.0" });
  console.log(`API listening on ${config.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
