"use client";

import { Clapperboard, Loader2 } from "lucide-react";
import { useState } from "react";
import type { StoryVideo } from "@/lib/types";

function VideoPlayer({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-lift">
      <video
        controls
        playsInline
        preload="metadata"
        onCanPlay={() => setLoaded(true)}
        onLoadedMetadata={() => setLoaded(true)}
        onPlaying={() => setLoaded(true)}
        onError={() => setError(true)}
        className="h-full w-full"
      >
        <source src={src} type="video/mp4" />
        আপনার ব্রাউজার ভিডিও প্লে করতে সক্ষম নয়।
      </video>

      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Loader2
            size={44}
            className="animate-spin text-white"
            aria-label="ভিডিও লোড হচ্ছে"
          />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-6 text-center">
          <p className="text-sm font-medium text-white">
            ভিডিওটি লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।
          </p>
        </div>
      )}
    </div>
  );
}

export function StoryVideoPlayer({ video }: { video: StoryVideo | null }) {
  if (!video || !video.videoUrl) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-brown-200 bg-brown-50/60 px-6 text-center dark:border-brown-700 dark:bg-brown-900/30">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brown-100 text-brown-500 dark:bg-brown-800 dark:text-cream/50">
          <Clapperboard size={30} />
        </span>
        <div>
          <p className="font-bengali text-lg font-semibold text-brown-800 dark:text-cream">
            শিগগিরই আমাদের ভিডিও
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            ঘরে তৈরি দই তৈরির পুরো প্রক্রিয়া ভিডিওতে দেখিয়ে চলছে আমাদের
            প্রস্তুতি। এখনই দেখুন আমাদের গল্প।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <VideoPlayer key={video.videoUrl} src={video.videoUrl} />
      {(video.title || video.description) && (
        <div className="mt-5 space-y-2">
          {video.title && (
            <h2 className="font-bengali text-xl font-bold text-brown-900 dark:text-cream md:text-2xl">
              {video.title}
            </h2>
          )}
          {video.description && (
            <p className="max-w-3xl text-sm leading-relaxed text-muted md:text-base">
              {video.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}