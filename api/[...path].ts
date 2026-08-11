import type { IncomingMessage, ServerResponse } from "node:http";

type ExpressHandler = (req: IncomingMessage, res: ServerResponse) => void;

// Warm instances cache the Express app and the Mongo connection.
let appCache: ExpressHandler | undefined;
const globalForMongo = global as unknown as { dbReady?: boolean };

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (!appCache) {
      const { createApp } = await import("../backend/src/app");
      const { env } = await import("../backend/src/config/env");
      const { connectDbSafe } = await import("../backend/src/config/db");

      if (!globalForMongo.dbReady) {
        await connectDbSafe(env.MONGODB_URI); // throws on failure
        globalForMongo.dbReady = true;
      }

      appCache = createApp() as ExpressHandler;
    }

    // This catch-all serves /api/*; keep the full path that Express expects,
    // in case the platform strips the /api prefix.
    if (!req.url || !req.url.startsWith("/api")) {
      req.url = `/api${req.url ?? ""}`;
    }

    return appCache(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: "সার্ভার সমস্যা হয়েছে।",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return;
  }
}
