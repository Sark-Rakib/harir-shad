"use client";

import {
  Droplets,
  Leaf,
  ShieldCheck,
  Sparkles,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const features = [
  {
    icon: UtensilsCrossed,
    titleBn: "খাঁটি রেসিপি",
    titleEn: "Authentic recipe",
    descBn: "প্রজন্ম ধরে সংরক্ষিত বগুড়ার সেই একই হাতে-তৈরি রেসিপি।",
  },
  {
    icon: Droplets,
    titleBn: "খামারের তাজা দুধ",
    titleEn: "Fresh farm milk",
    descBn: "স্থানীয় খামার থেকে প্রতিদিন সকালে সংগৃহীত খাঁটি গরুর দুধ।",
  },
  {
    icon: Leaf,
    titleBn: "প্রিজারভেটিভ মুক্ত",
    titleEn: "No preservatives",
    descBn: "কোনো কেমিক্যাল নয় — শুধু দুধ, চিনি ও সময়ের প্রাকৃতিক জাদু।",
  },
  {
    icon: Sparkles,
    titleBn: "মাটির হাঁড়ি",
    titleEn: "Traditional clay pot",
    descBn: "মাটির হাঁড়িতেই জমানো — যা দেয় অনন্য টেক্সচার ও গন্ধ।",
  },
  {
    icon: ShieldCheck,
    titleBn: "হাইজিনিক প্রস্তুতি",
    titleEn: "Hygienic process",
    descBn: "আধুনিক মানদণ্ডে, ১০০% হাইজিনিক পরিবেশে তৈরি ও প্যাকেজিং।",
  },
  {
    icon: Truck,
    titleBn: "সারাদেশে ডেলিভারি",
    titleEn: "Nationwide delivery",
    descBn: "৬৪ জেলায় নিরাপদ ও ফ্রেশ কোল্ড-চেইন ডেলিভারি।",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white/40 to-cream py-20 dark:from-brown-900/20 dark:to-brown-900/40 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrowBn="কেন আমরা"
          eyebrowEn="Why choose us"
          titleBn="কেন হাঁড়ির স্বাদ?"
          titleEn="The Taste of Bogura Difference"
          description="শুধু দই নয় — আমরা বিক্রি করি ঐতিহ্য, বিশ্বাস আর প্রতিটি হাঁড়িতে বোনা ভালোবাসা।"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.titleBn} delay={(i % 3) * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group h-full rounded-3xl border border-brown-100 bg-card p-7 shadow-soft transition-colors hover:border-gold-300 dark:border-brown-800 dark:bg-brown-900/50 dark:hover:border-gold-600"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta-100 to-gold-100 text-terracotta-600 transition-all duration-300 group-hover:from-terracotta-500 group-hover:to-gold-500 group-hover:text-white dark:from-brown-800 dark:to-brown-800 dark:text-gold-300">
                  <feature.icon size={26} strokeWidth={1.8} />
                </div>
                <h3 className="font-bengali text-lg font-bold text-brown-900 dark:text-cream">
                  {feature.titleBn}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-terracotta-500 dark:text-gold-400">
                  {feature.titleEn}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {feature.descBn}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
