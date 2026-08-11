"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/illustrations/ProductImage";
import { api, ApiError } from "@/lib/api";
import type {
  DeliveryMethod,
  OrderPayload,
  OrderResult,
} from "@/lib/types";
import { formatBDT } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";

const districts = [
  "ঢাকা",
  "বগুড়া",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "সিলেট",
  "বরিশাল",
  "রংপুর",
  "ময়মনসিংহ",
  "অন্যান্য",
];

const CHECKOUT_KEY = "hs-checkout-key";

function generateKey(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `hs-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateCheckoutKey(): string {
  if (typeof window === "undefined") return generateKey();
  const existing = window.localStorage.getItem(CHECKOUT_KEY);
  if (existing) return existing;
  const next = generateKey();
  window.localStorage.setItem(CHECKOUT_KEY, next);
  return next;
}

export default function CheckoutPage() {
  const { token, user } = useAuth();
  const { items, subtotal, discount, deliveryCharge, total, clearCart, setCartOpen } =
    useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    district: "ঢাকা",
    deliveryMethod: "standard" as DeliveryMethod,
    paymentMethod: "cod" as const,
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [checkoutKey] = useState<string>(() => getOrCreateCheckoutKey());
  const router = useRouter();

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.warning("কার্ট খালি। আগে পণ্য যোগ করুন।");
      return;
    }
    setSubmitting(true);

    const payload: OrderPayload = {
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        address: form.address,
        district: form.district,
        deliveryMethod: form.deliveryMethod,
      },
      items: items.map((i) => ({
        productId: i.productId,
        slug: i.slug,
        nameBn: i.nameBn,
        nameEn: i.nameEn,
        weightLabel: i.weightLabel,
        image: i.image ?? "",
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
      subtotal,
      discount,
      deliveryCharge,
      total,
      coupon: "",
      note: form.note,
      paymentMethod: form.paymentMethod,
      idempotencyKey: checkoutKey,
    };

    try {
      const res = user
        ? await api.postAuth<OrderResult>("/api/orders", payload, token)
        : await api.post<OrderResult>("/api/orders", payload);
      clearCart();
      setCartOpen(false);
      window.localStorage.removeItem(CHECKOUT_KEY);
      toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
      router.replace(
        `/checkout/success?order=${encodeURIComponent(res.orderId)}`,
      );
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "অর্ডার করা যায়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "h-12 w-full rounded-2xl border border-brown-200 bg-white px-4 text-sm text-ink-900 outline-none transition-all focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream";

  return (
    <div className="bg-hero-gradient">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-600 dark:text-terracotta-400">
            Checkout
          </p>
          <h1 className="font-bengali text-3xl font-bold text-brown-900 dark:text-cream md:text-5xl">
            অর্ডার নিশ্চিত করুন
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-bengali text-xl font-bold text-brown-800 dark:text-cream">
              কার্ট খালি
            </p>
            <Button href="/products" variant="outline" className="mt-4">
              পণ্য দেখুন
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-brown-100 bg-white p-6 shadow-soft dark:border-brown-800 dark:bg-brown-900/30">
                <h2 className="mb-5 font-bengali text-lg font-bold text-brown-900 dark:text-cream">
                  ডেলিভারি তথ্য
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                      নাম *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                      ফোন নম্বর *
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      required
                      placeholder="01XXXXXXXXX"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                      ইমেইল
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                      জেলা *
                    </label>
                    <select
                      value={form.district}
                      onChange={(e) => set("district", e.target.value)}
                      className={inputCls}
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                      সম্পূর্ণ ঠিকানা *
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      required
                      rows={3}
                      className={`${inputCls} h-auto py-3`}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                      ডেলিভারি পদ্ধতি
                    </label>
                    <select
                      value={form.deliveryMethod}
                      onChange={(e) =>
                        set("deliveryMethod", e.target.value)
                      }
                      className={inputCls}
                    >
                      <option value="standard">স্ট্যান্ডার্ড</option>
                      <option value="express">এক্সপ্রেস</option>
                      <option value="pickup">পিকআপ</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                      নোট (ঐচ্ছিক)
                    </label>
                    <textarea
                      value={form.note}
                      onChange={(e) => set("note", e.target.value)}
                      rows={2}
                      className={`${inputCls} h-auto py-3`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-fit rounded-3xl border border-brown-100 bg-white p-6 shadow-soft dark:border-brown-800 dark:bg-brown-900/30">
              <h2 className="font-bengali text-lg font-bold text-brown-900 dark:text-cream">
                অর্ডার সারসংক্ষেপ
              </h2>
              <div className="mt-4 space-y-3">
                {items.map((i) => (
                  <div
                    key={i.productId}
                    className="flex items-center gap-3 rounded-2xl border border-brown-100 bg-cream/60 p-3 dark:border-brown-800 dark:bg-brown-900/20"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-brown-800">
                      <ProductImage image={i.image} size={48} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bengali text-xs font-bold text-brown-900 dark:text-cream">
                        {i.nameBn}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-muted">
                        {[i.weightLabel, `${formatBDT(i.unitPrice)} × ${i.quantity}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-terracotta-600 dark:text-gold-300">
                      {formatBDT(i.unitPrice * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <dl className="mt-4 space-y-2 border-t border-brown-100 pt-4 text-sm text-muted dark:border-brown-800">
                <div className="flex justify-between">
                  <dt>সাবটোটাল</dt>
                  <dd>{formatBDT(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-300">
                    <dt>ছাড়</dt>
                    <dd>-{formatBDT(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>ডেলিভারি</dt>
                  <dd>{deliveryCharge === 0 ? "ফ্রি" : formatBDT(deliveryCharge)}</dd>
                </div>
                <div className="flex justify-between border-t border-brown-100 pt-2 text-base font-bold text-brown-900 dark:border-brown-800 dark:text-cream">
                  <dt>মোট</dt>
                  <dd className="text-terracotta-600 dark:text-gold-300">
                    {formatBDT(total)}
                  </dd>
                </div>
              </dl>

              <Button
                type="submit"
                size="lg"
                fullWidth
                className="mt-6"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> প্রসেস হচ্ছে…
                  </>
                ) : (
                  "অর্ডার নিশ্চিত করুন"
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-muted">
                অর্ডার করে আপনি আমাদের{" "}
                <Link href="/" className="font-semibold text-terracotta-600">
                  শর্তাবলী
                </Link>{" "}
                মেনে নিচ্ছেন।
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
