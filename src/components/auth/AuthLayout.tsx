import { BadgeCheck, Leaf, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { HeroScene } from "@/components/illustrations/Decorations";

interface AuthLayoutProps {
  titleBn: string;
  titleEn: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthLayout({
  titleBn,
  titleEn,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden">
      {/* backdrop */}
      <div className="pattern-leaf pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-terracotta-300/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-full max-w-6xl items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden rounded-[2.5rem] bg-brand-gradient p-10 text-white shadow-lift lg:block">
          <div className="pattern-leaf absolute inset-0 opacity-15" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <HeroScene className="h-9 w-9" />
              </span>
              <span className="font-bengali text-xl font-bold">{site.nameBn}</span>
            </Link>

            <h2 className="mt-10 font-bengali text-3xl font-bold leading-snug xl:text-4xl">
              মাটির হাঁড়িতে জমানো
              <span className="text-gradient-gold block">বগুড়ার আসল দই</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
              {site.storyShortBn}
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">
                  <Leaf size={19} />
                </span>
                <div>
                  <p className="text-sm font-semibold">১০০% প্রাকৃতিক</p>
                  <p className="text-xs text-white/70">কোনো প্রিজারভেটিভ নেই</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">
                  <Truck size={19} />
                </span>
                <div>
                  <p className="text-sm font-semibold">সারাদেশে ফ্রেশ ডেলিভারি</p>
                  <p className="text-xs text-white/70">১,০০০৳+ অর্ডারে ডেলিভারি ফ্রি</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">
                  <ShieldCheck size={19} />
                </span>
                <div>
                  <p className="text-sm font-semibold">প্রিমিয়াম প্যাকেজিং</p>
                  <p className="text-xs text-white/70">নিরাপদ ও স্বাস্থ্যকর</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-2 text-xs text-white/60">
              <BadgeCheck size={15} className="text-gold-300" />
              {site.customers.toLocaleString()}+ সন্তুষ্ট গ্রাহক
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-brown-100 bg-white/80 p-7 shadow-lift backdrop-blur-xl dark:border-brown-800 dark:bg-brown-900/60 md:p-10">
            <div className="mb-8 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 shadow-soft">
                <HeroScene className="h-11 w-11" />
              </span>
              <h1 className="font-bengali text-2xl font-bold text-brown-900 dark:text-cream">
                {titleBn}
              </h1>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                {titleEn}
              </p>
              {subtitle && (
                <p className="mt-3 text-sm text-muted">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
