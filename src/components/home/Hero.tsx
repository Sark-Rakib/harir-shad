"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { HeroScene } from "@/components/illustrations/Decorations";

const stats = [
  { value: `${new Date().getFullYear() - site.establishmentYear}+`, labelBn: "বছরের ঐতিহ্য", labelEn: "Years of heritage" },
  { value: "১২ হাজার+", labelBn: "সন্তুষ্ট গ্রাহক", labelEn: "Happy customers" },
  { value: `${site.districtsServed}+`, labelBn: "জেলায় ডেলিভারি", labelEn: "Districts covered" },
  { value: "৪.৯★", labelBn: "গ্রাহক রেটিং", labelEn: "Average rating" },
];

const trustItems = [
  { icon: Leaf, labelBn: "১০০% প্রাকৃতিক", labelEn: "100% Natural" },
  { icon: ShieldCheck, labelBn: "প্রিজারভেটিভ মুক্ত", labelEn: "No preservatives" },
  { icon: Truck, labelBn: "ফ্রেশ ডেলিভারি", labelEn: "Fresh delivery" },
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    animate: reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      {/* decorative pattern */}
      <div className="pattern-leaf absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20 lg:grid-cols-2 lg:gap-8">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div {...fadeUp(0)} className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-300/60 bg-white/60 px-4 py-1.5 text-xs font-semibold text-gold-700 shadow-soft backdrop-blur dark:border-gold-500/40 dark:bg-brown-900/50 dark:text-gold-300">
            <Sparkles size={14} />
            {site.nameEn}
            <span className="mx-1 h-3 w-px bg-current opacity-40" />
            <span className="font-bengali">{site.nameBn}</span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="font-bengali text-4xl font-bold leading-[1.15] text-brown-900 dark:text-cream sm:text-5xl lg:text-[3.5rem]">
            বগুড়ার আসল দই,
            <span className="text-gradient-gold block">মাটির হাঁড়িতে</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted md:text-base lg:mx-0">
            {site.storyShortBn}
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button href="/products" size="xl">
              অর্ডার করুন
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button href="/about" variant="outline" size="xl">
              আমাদের গল্প
            </Button>
          </motion.div>

          <motion.div {...fadeUp(0.4)} className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            {trustItems.map((item) => (
              <span key={item.labelBn} className="flex items-center gap-1.5 text-xs font-medium text-brown-600 dark:text-cream/70">
                <item.icon size={15} className="text-green-600 dark:text-green-400" />
                <span className="font-bengali">{item.labelBn}</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Illustration */}
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-md lg:max-w-none"
        >
          <HeroScene className="mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg" />
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="relative border-t border-brown-900/5 bg-white/50 backdrop-blur dark:border-white/5 dark:bg-brown-950/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 md:grid-cols-4 md:px-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.labelBn}
              {...fadeUp(0.1 * i)}
              className="text-center"
            >
              <p className="text-2xl font-bold text-terracotta-600 dark:text-gold-300 md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 font-bengali text-xs font-medium text-brown-700 dark:text-cream/80 md:text-sm">
                {stat.labelBn}
              </p>
              <p className="text-[10px] text-muted">{stat.labelEn}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
