import type { StoryVideo } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getStoryVideo(): Promise<StoryVideo | null> {
  try {
    const res = await fetch(`${API_URL}/api/story-video`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { video: StoryVideo | null };
    return data.video ?? null;
  } catch {
    return null;
  }
}