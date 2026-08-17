import type { StoryVideo } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const SERVER_BASE =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
    : "";

export async function getStoryVideo(): Promise<StoryVideo | null> {
  try {
    const base = SERVER_BASE || API_URL;
    const res = await fetch(`${base}/api/story-video`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { video: StoryVideo | null };
    return data.video ?? null;
  } catch {
    return null;
  }
}
