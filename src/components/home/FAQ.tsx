"use client";

import { MessageCircle, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AccordionItem } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

const faqs = [
  {
    titleBn: "ডেলিভারি চার্জ কত এবং কখন পণ্য পাব?",
    titleEn: "Delivery charges & timeline",
    descBn:
      "ঢাকার ভেতরে ডেলিভারি চার্জ ৮০৳ এবং ঢাকার বাইরে ১২০৳। ১,০০০৳ বা তার বেশি অর্ডারে ডেলিভারি ফ্রি। অর্ডারের পর ঢাকায় ২৪–৪৮ ঘণ্টা এবং ঢাকার বাইরে ২–৪ দিনের মধ্যে পণ্য পৌঁছে যায়।",
  },
  {
    titleBn: "পণ্য কি সত্যিই মাটির হাঁড়িতে আসে?",
    titleEn: "Are products really in clay pots?",
    descBn:
      "জি, অবশ্যই! ঐতিহ্যবাহী সব দই আসল মাটির হাঁড়িতে জমানো ও পরিবেশন করা হয়। প্রিমিয়াম জার ও গিফট বক্সেও ভেতরে মাটির হাঁড়িতে দই থাকে।",
  },
  {
    titleBn: "দই কত দিন পর্যন্ত ফ্রেশ থাকে?",
    titleEn: "Shelf life",
    descBn:
      "ফ্রিজে রাখলে সাধারণত ৫–৭ দিন পর্যন্ত খাওয়া যায়। মাটির হাঁড়িতে দই সংরক্ষণ করলে স্বাদ আরও বেশি দিন অটুট থাকে। পরিবেশনের আগে ভালোভাবে ঠান্ডা রাখুন।",
  },
  {
    titleBn: "কোন কোন পেমেন্ট মাধ্যম সমর্থিত?",
    titleEn: "Payment methods",
    descBn:
      "ক্যাশ অন ডেলিভারি, bKash, Nagad, এবং সব ধরনের কার্ড (SSLCommerz-এর মাধ্যমে নিরাপদ পেমেন্ট) — সব মাধ্যম সমর্থিত। অনলাইন পেমেন্ট সম্পূর্ণ নিরাপদ।",
  },
  {
    titleBn: "পণ্য ফেরত বা বদলানোর সুযোগ আছে কি?",
    titleEn: "Returns & refunds",
    descBn:
      "পণ্যের কোনো সমস্যা হলে (ভুল পণ্য, ক্ষতিগ্রস্ত প্যাকেজিং) ডেলিভারির ২৪ ঘণ্টার মধ্যে জানালে আমরা বদলে দেব বা রিফান্ড করব। বিস্তারিত জানতে যোগাযোগ করুন।",
  },
  {
    titleBn: "বাল্ক অর্ডার বা কর্পোরেট অর্ডার করবো কীভাবে?",
    titleEn: "Bulk & corporate orders",
    descBn:
      "অনুষ্ঠান, রেস্টুরেন্ট বা কর্পোরেট গিফটিংয়ের জন্য বাল্ক অর্ডারে বিশেষ মূল্যছাড় রয়েছে। হোয়াটসঅ্যাপ বা ফোনে যোগাযোগ করে জেনে নিন।",
  },
];

export function FAQ() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionHeading
          eyebrowBn="সাধারণ প্রশ্ন"
          eyebrowEn="FAQ"
          titleBn="প্রায়শই জিজ্ঞাসিত প্রশ্ন"
          titleEn="Frequently Asked Questions"
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.titleBn} delay={(i % 3) * 0.06}>
              <AccordionItem titleBn={faq.titleBn} titleEn={faq.titleEn} defaultOpen={i === 0}>
                {faq.descBn}
              </AccordionItem>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <div className="rounded-3xl border border-brown-100 bg-card p-6 shadow-soft dark:border-brown-800 dark:bg-brown-900/50 md:p-8">
            <p className="font-bengali text-lg font-bold text-brown-900 dark:text-cream">
              আরও প্রশ্ন আছে?
            </p>
            <p className="mt-1 text-sm text-muted">
              আমাদের দল আপনাকে সাহায্য করতে সবসময় প্রস্তুত।
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Button href="/contact" variant="outline">
                <MessageCircle size={16} />
                যোগাযোগ করুন
              </Button>
              <Button href={`tel:${site.phoneRaw}`} variant="gold">
                <Phone size={16} />
                {site.phoneDisplay}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
