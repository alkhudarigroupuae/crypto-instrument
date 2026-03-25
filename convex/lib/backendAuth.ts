import { ConvexError } from "convex/values";

export function requireBackendSecret(secret: string | undefined): void {
  const expected = process.env.BACKEND_SECRET;
  if (!expected || !secret || secret !== expected) {
    throw new ConvexError("Unauthorized");
  }
}
