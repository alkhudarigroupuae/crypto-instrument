import { ConvexHttpClient } from "convex/browser";
import { api } from "../convexRefs.js";
import { config } from "../config.js";

const client = new ConvexHttpClient(config.convexUrl);

export function backendArgs<T extends Record<string, unknown>>(args: T) {
  return { ...args, backendSecret: config.backendSecret };
}

export { client, api };
