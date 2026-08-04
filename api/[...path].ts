import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../backend/src/app";
import { env } from "../backend/src/config/env";
import { connectDbSafe } from "../backend/src/config/db";

// On serverless each warm instance keeps a cached Mongo connection.
const globalForMongo = global as unknown as { dbReady?: boolean };

async function connectDbOnce(uri: string): Promise<void> {
  if (globalForMongo.dbReady) return;
  await connectDbSafe(uri); // throws on failure — handled by caller
  globalForMongo.dbReady = true;
}

const app = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await connectDbOnce(env.MONGODB_URI);
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "সার্ভার সমস্যা হয়েছে।" }));
    return;
  }

  // The catch-all receives /api/* requests; make sure Express sees the
  // full path in case the platform strips the /api prefix.
  if (!req.url || !req.url.startsWith("/api")) {
    req.url = `/api${req.url ?? ""}`;
  }

  return app(req, res);
}
