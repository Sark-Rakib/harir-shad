import { BadgeCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const rating = product.rating ?? 0;
  const count = product.reviewsCount ?? 0;

  if (count <= 0) return null;

  return (
    <section className="mt-16">
      <SectionHeading
        eyebrowBn="গ্রাহক মতামত"
        eyebrowEn="Reviews"
        titleBn={`গ্রাহকদের রেটিং (${count})`}
        titleEn={`Customer rating (${count})`}
        align="left"
      />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Summary */}
        <div className="h-fit rounded-3xl border border-brown-100 bg-white p-6 shadow-soft dark:border-brown-800 dark:bg-brown-900/30">
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-brown-900 dark:text-cream">
              {rating.toFixed(1)}
            </span>
            <div className="pb-1.5">
              <RatingStars rating={rating} showValue={false} size={18} />
              <p className="mt-1 text-xs text-muted">
                {count.toLocaleString()}টি মোট রিভিউ
              </p>
            </div>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted">
            <BadgeCheck size={16} className="text-green-600" />
            রেটিং ডাটাবেজ থেকে নেওয়া হয়েছে
          </p>
        </div>

        <div className="flex items-center justify-center rounded-3xl border border-dashed border-brown-200 bg-white/60 p-10 text-center dark:border-brown-700 dark:bg-brown-900/20">
          <p className="max-w-md font-bengali text-sm leading-relaxed text-muted">
            আপনার অভিজ্ঞতা শেয়ার করতে এবং সম্পূর্ণ রিভিউ দেখতে শীঘ্রই রিভিউ
            সুবিধা চালু করা হবে।
          </p>
        </div>
      </div>
    </section>
  );
}
