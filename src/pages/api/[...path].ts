import type { NextApiRequest, NextApiResponse } from "next";

// Express and the Mongo connection are cached across warm invocations.
let appCache: ((req: NextApiRequest, res: NextApiResponse) => void) | undefined;
const globalForMongo = global as unknown as { dbReady?: boolean };

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
  maxDuration: 30,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!appCache) {
      const { createApp } = await import("../../../backend/src/app");
      const { env } = await import("../../../backend/src/config/env");
      const { connectDbSafe } = await import("../../../backend/src/config/db");

      if (!globalForMongo.dbReady) {
        await connectDbSafe(env.MONGODB_URI); // throws on failure
        globalForMongo.dbReady = true;
      }

      appCache = createApp() as (req: NextApiRequest, res: NextApiResponse) => void;
    }

    // Keep the /api prefix Express expects.
    if (!req.url || !req.url.startsWith("/api")) {
      req.url = `/api${req.url ?? ""}`;
    }

    return appCache(req, res);
  } catch (err) {
    res.status(500).json({
      message: "সার্ভার সমস্যা হয়েছে।",
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }
}
