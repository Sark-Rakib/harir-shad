"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Quote } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RatingStars } from "@/components/ui/RatingStars";

const testimonials = [
  {
    id: "t1",
    nameBn: "আফসানা করিম",
    nameEn: "Afsona Karim",
    role: "গৃহিণী, ঢাকা",
    rating: 5,
    location: "ঢাকা",
    textBn:
      "বগুড়ায় নানির বাসায় যে দই খেয়েছি, সেই স্বাদই পেয়েছি ঢাকায়। মাটির হাঁড়ির এই দই আমাদের পুরো পরিবারের সকালের আনন্দ।",
  },
  {
    id: "t2",
    nameBn: "জসিম উদ্দিন",
    nameEn: "Jasim Uddin",
    role: "ব্যবসায়ী, চট্টগ্রাম",
    rating: 5,
    location: "চট্টগ্রাম",
    textBn:
      "কর্পোরেট উপহার হিসেবে গিফট বক্স নিয়েছি। ক্লায়েন্টরা স্বাদ আর প্যাকেজিং দুটোই খুব প্রশংসা করেছে।",
  },
  {
    id: "t3",
    nameBn: "রুবিনা আক্তার",
    nameEn: "Rubina Akter",
    role: "শিক্ষক, রাজশাহী",
    rating: 4,
    location: "রাজশাহী",
    textBn:
      "টক দইয়ের স্বাদ নিখুঁত। মিষ্টি দইও ট্রাই করেছি — দুটোই খাঁটি। প্যাকেজিং এত সুন্দর যে উপহার দিতেও লজ্জা লাগে না।",
  },
  {
    id: "t4",
    nameBn: "সাকিব খান",
    nameEn: "Sakib Khan",
    role: "ফ্রিল্যান্সার, সিলেট",
    rating: 5,
    location: "সিলেট",
    textBn:
      "অনলাইন অর্ডার করেছিলাম প্রথমবার। ফ্রেশ ডেলিভারি, সুন্দর প্যাকেজিং আর সত্যিকারের বগুড়ার দই — পাঁচ তারকা।",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream to-white/40 py-20 dark:from-brown-900/40 dark:to-brown-900/10 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrowBn="গ্রাহকদের মতামত"
          eyebrowEn="Testimonials"
          titleBn="গ্রাহকদের ভালোবাসার গল্প"
          titleEn="Stories from Our Customers"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.1 }}
              className="flex flex-col rounded-3xl border border-brown-100 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift dark:border-brown-800 dark:bg-brown-900/50"
            >
              <Quote size={28} className="mb-3 text-gold-400/70" aria-hidden="true" />

              <RatingStars rating={t.rating} showValue={false} />

              <blockquote className="mt-3 flex-1 font-bengali text-sm leading-relaxed text-brown-700 dark:text-cream/85">
                “{t.textBn}”
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-3 border-t border-brown-100 pt-4 dark:border-brown-800">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-terracotta-500 to-brown-700 text-sm font-bold text-white">
                  {getInitials(t.nameEn)}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-brown-900 dark:text-cream">
                    {t.nameBn}
                    <BadgeCheck size={14} className="text-green-600" />
                  </p>
                  <p className="text-xs text-muted">
                    {t.role} • {t.location}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
