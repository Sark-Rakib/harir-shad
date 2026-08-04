"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") ?? "";

  return (
    <div className="bg-hero-gradient">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-5 py-24 text-center md:px-8">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-300">
          <CheckCircle2 size={40} />
        </span>
        <h1 className="font-bengali text-3xl font-bold text-brown-900 dark:text-cream">
          অর্ডার সফল হয়েছে!
        </h1>
        {orderId ? (
          <p className="text-sm text-muted">
            আপনার অর্ডার নম্বর:{" "}
            <span className="font-bold text-terracotta-600 dark:text-gold-300">
              {orderId}
            </span>
            । শীঘ্রই আমাদের প্রতিনিধি ফোনে যোগাযোগ করবেন।
          </p>
        ) : (
          <p className="text-sm text-muted">
            শীঘ্রই আমাদের প্রতিনিধি ফোনে যোগাযোগ করবেন।
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button href="/account/orders">আমার অর্ডার দেখুন</Button>
          <Button href="/products" variant="outline">
            আরও পণ্য দেখুন
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
