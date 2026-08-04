import { ArrowRight, Phone } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WaveDivider } from "@/components/illustrations/Decorations";
import { site } from "@/lib/site";

function CTABanner() {
  return (
    <section className="relative px-5 pb-20 md:px-8 md:pb-28">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-gradient px-6 py-16 text-center text-white shadow-lift md:px-12 md:py-20">
          <div className="pattern-leaf absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gold-400/20 blur-2xl" />

          <div className="relative">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-200">
              {site.taglineEn}
            </p>
            <h2 className="mx-auto max-w-2xl font-bengali text-3xl font-bold leading-tight md:text-5xl">
              আজই অর্ডার করুন
              <span className="mt-2 block font-sans text-lg font-medium text-white/80 md:text-2xl">
                বগুড়ার আসল স্বাদ আপনার doorstep-এ
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-bengali text-sm leading-relaxed text-white/85 md:text-base">
              মাটির হাঁড়িতে জমানো খাঁটি দই — এখন সারাদেশে ফ্রেশ ডেলিভারি। ১,০০০৳+ অর্ডারে ডেলিভারি ফ্রি।
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                href="/products"
                size="xl"
                className="bg-white !text-brown-900 hover:bg-cream"
              >
                পণ্য দেখুন
                <ArrowRight size={18} />
              </Button>
              <Button
                href={`tel:${site.phoneRaw}`}
                variant="outline"
                size="xl"
                className="!border-white/50 !text-white hover:!bg-white/10"
              >
                <Phone size={18} />
                {site.phoneDisplay}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <WaveDivider className="-mt-1 text-cream dark:text-brown-950" />
      <FeaturedProducts />
      <WhyChooseUs />
      <ProcessTimeline />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  );
}
