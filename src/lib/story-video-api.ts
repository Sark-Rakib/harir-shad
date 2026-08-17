import type { StoryVideo } from "./types";
import { getServerBaseUrl } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function getStoryVideo(): Promise<StoryVideo | null> {
  try {
    const base = getServerBaseUrl() || API_URL;
    const res = await fetch(`${base}/api/story-video`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { video: StoryVideo | null };
    return data.video ?? null;
  } catch {
    return null;
  }
}
