import fs from "fs";
import path from "path";

const g = global as unknown as {
  __dbReady?: boolean;
};

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

export async function ensureDbConnection(): Promise<void> {
  if (g.__dbReady) return;

  loadBackendEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  const { connectDbSafe } = await import("../../backend/src/config/db");
  await connectDbSafe(uri);
  g.__dbReady = true;
}
