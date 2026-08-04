"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Flame,
  Heart,
  Leaf,
  Package,
  Truck,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: Droplets,
    titleBn: "তাজা দুধ সংগ্রহ",
    titleEn: "Fresh milk sourcing",
    descBn: "ভোরে স্থানীয় খামার থেকে খাঁটি গরুর দুধ সংগ্রহ করা হয়।",
  },
  {
    icon: Flame,
    titleBn: "মাটির হাঁড়িতে ফুটানো",
    titleEn: "Slow-boiling in clay",
    descBn: "মাটির হাঁড়িতে ধীরে ধীরে ফুটিয়ে কমানো হয়, যা দেয় অনন্য স্বাদ।",
  },
  {
    icon: Heart,
    titleBn: "প্রাকৃতিক জমাটবাঁধা",
    titleEn: "Natural fermentation",
    descBn: "কোনো কেমিক্যাল ছাড়াই ৬–৮ ঘণ্টায় প্রাকৃতিকভাবে জমাট বাঁধে।",
  },
  {
    icon: Leaf,
    titleBn: "ঠান্ডা ও সংরক্ষণ",
    titleEn: "Cooling & setting",
    descBn: "নির্দিষ্ট তাপমাত্রায় ঠান্ডা করে ঘন ও ক্রিমি টেক্সচার আনা হয়।",
  },
  {
    icon: Package,
    titleBn: "নিরাপদ প্যাকেজিং",
    titleEn: "Safe packaging",
    descBn: "হাইজিনিক পরিবেশে সিল করা হয় যাতে স্বাদ অটুট থাকে।",
  },
  {
    icon: Truck,
    titleBn: "ফ্রেশ ডেলিভারি",
    titleEn: "Fresh delivery",
    descBn: "কোল্ড-চেইনে সারাদেশে পৌঁছে যায় আপনার হাতে।",
  },
];

export function ProcessTimeline() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pattern-leaf absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrowBn="ঐতিহ্যবাহী প্রক্রিয়া"
          eyebrowEn="Our process"
          titleBn="হাঁড়ি থেকে আপনার হাতে"
          titleEn="From the Clay Pot to Your Door"
          description="প্রতিটি হাঁড়ির পেছনে জড়িয়ে আছে ছয়টি সতর্ক ধাপ — যেখানে সময়ই আসল রেসিপি।"
        />

        <div className="relative">
          {/* center line */}
          <div
            className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-terracotta-300 via-gold-300 to-green-300 dark:from-terracotta-700 dark:via-gold-700 dark:to-green-700 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />

          <ol className="space-y-10">
            {steps.map((step, i) => {
              const left = i % 2 === 0;
              return (
                <li key={step.titleBn} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex items-start gap-6 pl-16 md:pl-0 ${
                      left
                        ? "md:flex-row-reverse"
                        : ""
                    }`}
                  >
                    {/* node */}
                    <div
                      className="absolute left-6 top-2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-terracotta-500 to-terracotta-700 text-white shadow-lift md:left-1/2"
                      aria-hidden="true"
                    >
                      <step.icon size={20} />
                    </div>

                    <div
                      className={`w-full md:w-[calc(50%-3rem)] ${
                        left ? "md:mr-auto md:pl-0 md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
                      }`}
                    >
                      <div className="rounded-3xl border border-brown-100 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:border-brown-800 dark:bg-brown-900/50">
                        <div className="flex items-center gap-3">
                          <span className="font-bengali text-2xl font-bold text-gold-400 dark:text-gold-600">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h3 className="font-bengali text-lg font-bold text-brown-900 dark:text-cream">
                              {step.titleBn}
                            </h3>
                            <p className="text-xs font-medium uppercase tracking-wider text-terracotta-500 dark:text-gold-400">
                              {step.titleEn}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                          {step.descBn}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
