import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    /** Set by `requireAccessToken` after successful JWT verification. */
    userId?: string;
  }
}
