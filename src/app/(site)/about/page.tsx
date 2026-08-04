import { Sparkles, Truck, Leaf, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StoryVideoPlayer } from "@/components/story/StoryVideoPlayer";
import { getStoryVideo } from "@/lib/story-video-api";

const values = [
  {
    icon: Leaf,
    title: "খাঁটি ও প্রাকৃতিক",
    text: "শতভাগ গরুর দুধ, কোনো প্রিজারভেটিভ বা কৃত্রিম উপাদান ছাড়াই।",
  },
  {
    icon: Truck,
    title: "কোল্ড চেইন ডেলিভারি",
    text: "তাজা ও নিরাপদ পৌঁছানোর জন্য সম্পূর্ণ কোল্ড চেইনে ডেলিভারি।",
  },
  {
    icon: Sparkles,
    title: "ঐতিহ্যবাহী রেসিপি",
    text: "বগুড়ার ঐতিহ্যবাহী হাঁড়ির ছাঁচে তৈরি খাঁটি দইয়ের স্বাদ।",
  },
  {
    icon: HeartHandshake,
    title: "গ্রাহক সন্তুষ্টি",
    text: "আমাদের লক্ষ্য প্রতিটি গ্রাহকের আস্থা ও সন্তুষ্টি অর্জন।",
  },
];

export default async function AboutPage() {
  const video = await getStoryVideo();

  return (
    <div className="bg-hero-gradient">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-600 dark:text-terracotta-400">
            About Us
          </p>
          <h1 className="font-bengali text-3xl font-bold text-brown-900 dark:text-cream md:text-5xl">
            হাঁড়ির স্বাদের গল্প
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted md:text-base">
            মাটির হাঁড়ির ঐতিহ্য, বগুড়ার খাঁটি স্বাদ — আমরা নিয়ে আসি সরাসরি আপনার
            ঘরে।
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-5 text-sm leading-relaxed text-muted md:text-base">
            <p>
              <span className="font-bold text-brown-900 dark:text-cream">
                হাঁড়ির স্বাদ
              </span>{" "}
              গ্রামবাংলার শত বছরের পুরনো ঐতিহ্যকে বাঁচিয়ে রাখতে কাজ করছে। মাটির
              হাঁড়িতে প্রাকৃতিকভাবে জমা হওয়া দইয়ের সেই মিষ্টি স্বাদ, যা নানা
              প্রজন্মের পছন্দ, আমরা তা পৌঁছে দিচ্ছি সারা দেশে।
            </p>
            <p>
              আমরা বিশ্বাস করি দই শুধু খাবার নয় — এটি আমাদের সংস্কৃতি, উৎসব আর
              আতিথেয়তার প্রতীক। তাই প্রতিটি হাঁড়িতে আমরা বজায় রাখি
              নিরবিচ্ছিন্ন মান, খাঁটি উপকরণ আর ভালোবাসা।
            </p>
            <p>
              গ্রামের খামার থেকে সরাসরি দুধ সংগ্রহ করে, কঠোর মান নিয়ন্ত্রণের পর
              তৈরি হয় আমাদের প্রতিটি পণ্য। কোনো কৃত্রিম রং, স্বাদ বা
              প্রিজারভেটিভ ছাড়াই।
            </p>
          </div>

          <div className="rounded-3xl border border-brown-100 bg-white/70 p-8 shadow-soft dark:border-brown-800 dark:bg-brown-900/30">
            <h2 className="mb-6 font-bengali text-xl font-bold text-brown-900 dark:text-cream">
              আমাদের মূল্যবোধ
            </h2>
            <div className="space-y-5">
              {values.map((v) => (
                <div key={v.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-terracotta-100 text-terracotta-600 dark:bg-terracotta-900/40 dark:text-gold-300">
                    <v.icon size={20} />
                  </span>
                  <div>
                    <p className="font-bengali font-bold text-brown-900 dark:text-cream">
                      {v.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted md:text-sm">
                      {v.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="mb-6 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-600 dark:text-terracotta-400">
              Our Video
            </p>
            <h2 className="font-bengali text-2xl font-bold text-brown-900 dark:text-cream md:text-3xl">
              দই তৈরির প্রক্রিয়া দেখুন
            </h2>
          </div>
          <StoryVideoPlayer video={video} />
        </section>

        <div className="mt-14 rounded-3xl bg-terracotta-600 px-8 py-12 text-center text-white shadow-lift dark:bg-terracotta-700">
          <h2 className="font-bengali text-2xl font-bold md:text-3xl">
            স্বাদ নিন, ভালোবাসুন, ভাগাভাগি করুন
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 md:text-base">
            আজই অর্ডার করুন হাঁড়ির স্বাদের খাঁটি দই — কোল্ড চেইন ডেলিভারিতে
            আপনার ঠিকানায়।
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button href="/products" variant="secondary" size="lg">
              পণ্য দেখুন
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              যোগাযোগ করুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
