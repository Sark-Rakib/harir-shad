"use client";

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/illustrations/ProductImage";
import { formatBDT } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";

export default function CartPage() {
  const {
    items,
    subtotal,
    discount,
    deliveryCharge,
    total,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  const handleCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = new FormData(e.currentTarget).get("code") as string;
    if (!code.trim()) return;
    applyCoupon(code.trim());
  };

  return (
    <div className="bg-hero-gradient">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-600 dark:text-terracotta-400">
            Cart
          </p>
          <h1 className="font-bengali text-3xl font-bold text-brown-900 dark:text-cream md:text-5xl">
            আপনার কার্ট
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brown-100 text-brown-400 dark:bg-brown-800">
              <ShoppingBag size={28} />
            </span>
            <p className="font-bengali text-xl font-bold text-brown-800 dark:text-cream">
              কার্ট খালি
            </p>
            <p className="text-sm text-muted">
              পণ্য যোগ করে অর্ডার শুরু করুন।
            </p>
            <Button href="/products" variant="outline">
              পণ্য দেখুন
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 rounded-3xl border border-brown-100 bg-white p-4 shadow-soft dark:border-brown-800 dark:bg-brown-900/30"
                >
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-cream dark:bg-brown-800">
                    <ProductImage image={item.image} size={72} />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-bengali text-sm font-bold leading-snug text-brown-900 transition-colors hover:text-terracotta-600 dark:text-cream"
                      >
                        {item.nameBn}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="rounded-lg p-1 text-brown-400 transition-colors hover:text-red-500"
                        aria-label={`Remove ${item.nameBn}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-muted">{item.weightLabel}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-full border border-brown-200 p-1 dark:border-brown-700">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full text-brown-600 hover:bg-brown-100 dark:text-cream dark:hover:bg-white/5"
                          aria-label="কমান"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-brown-900 dark:text-cream">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full text-brown-600 hover:bg-brown-100 dark:text-cream dark:hover:bg-white/5"
                          aria-label="বাড়ান"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-base font-bold text-terracotta-600 dark:text-gold-300">
                        {formatBDT(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-3xl border border-brown-100 bg-white p-6 shadow-soft dark:border-brown-800 dark:bg-brown-900/30">
              <h2 className="font-bengali text-lg font-bold text-brown-900 dark:text-cream">
                সারসংক্ষেপ
              </h2>

              {appliedCode ? (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
                  <span>কুপন: {appliedCode}</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label="Remove coupon"
                    className="hover:text-red-600"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleCoupon}
                  className="mt-4 flex gap-2"
                >
                  <input
                    name="code"
                    placeholder="কুপন কোড"
                    className="h-11 flex-1 rounded-2xl border border-brown-200 bg-white px-4 text-sm text-ink-900 outline-none focus:border-terracotta-500 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream"
                  />
                  <button
                    type="submit"
                    className="h-11 rounded-2xl bg-brown-900 px-4 text-sm font-bold text-cream hover:bg-terracotta-600 dark:bg-gold-500 dark:text-brown-950"
                  >
                    প্রযোজ্য
                  </button>
                </form>
              )}

              <dl className="mt-5 space-y-2 text-sm text-muted">
                <div className="flex justify-between">
                  <dt>সাবটোটাল</dt>
                  <dd className="font-semibold text-brown-900 dark:text-cream">
                    {formatBDT(subtotal)}
                  </dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-300">
                    <dt>ছাড়</dt>
                    <dd>-{formatBDT(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>ডেলিভারি</dt>
                  <dd>
                    {deliveryCharge === 0
                      ? "ফ্রি"
                      : formatBDT(deliveryCharge)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-brown-100 pt-2 text-base font-bold text-brown-900 dark:border-brown-800 dark:text-cream">
                  <dt>মোট</dt>
                  <dd className="text-terracotta-600 dark:text-gold-300">
                    {formatBDT(total)}
                  </dd>
                </div>
              </dl>

              <Button
                size="lg"
                fullWidth
                className="mt-6"
                onClick={handleCheckout}
              >
                Checkout করুন
                <ArrowRight size={18} />
              </Button>

              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full py-1 text-center text-xs font-medium text-muted transition-colors hover:text-red-500"
              >
                কার্ট খালি করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
