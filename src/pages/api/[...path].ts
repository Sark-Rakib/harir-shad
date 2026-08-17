import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Use global to survive Next.js dev hot-module re-evaluation.
const g = global as unknown as {
  __appCache?: (req: NextApiRequest, res: NextApiResponse) => void;
  __dbReady?: boolean;
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
  maxDuration: 30,
};

/** Load backend/.env into process.env so the backend's Zod env validation passes. */
function loadBackendEnv() {
  const envPath = path.resolve(process.cwd(), "backend", ".env");
  try {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!(key in process.env)) {
        process.env[key] = val;
      }
    }
  } catch {
    // .env file missing — rely on system env vars (e.g. Vercel).
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!g.__appCache) {
      loadBackendEnv();

      const { createApp } = await import("../../../backend/src/app");
      const { env } = await import("../../../backend/src/config/env");
      const { connectDbSafe } = await import("../../../backend/src/config/db");

      if (!g.__dbReady) {
        await connectDbSafe(env.MONGODB_URI);
        g.__dbReady = true;
      }

      g.__appCache = createApp() as (req: NextApiRequest, res: NextApiResponse) => void;
    }

    // Keep the /api prefix Express expects.
    if (!req.url || !req.url.startsWith("/api")) {
      req.url = `/api${req.url ?? ""}`;
    }

    return g.__appCache(req, res);
  } catch (err) {
    res.status(500).json({
      message: "সার্ভার সমস্যা হয়েছে।",
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }
}
