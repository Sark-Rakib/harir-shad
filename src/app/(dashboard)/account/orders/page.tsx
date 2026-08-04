"use client";

import { Loader2, PackageSearch, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminError } from "@/components/admin/AdminState";
import { StatusBadge, paymentMethodLabel } from "@/components/admin/StatusBadge";
import { useAdminFetch } from "@/components/admin/useAdminFetch";
import { Button } from "@/components/ui/Button";
import { formatBDT, formatDateBn, getId } from "@/lib/utils";
import type { Order } from "@/lib/types";

export default function MyOrdersPage() {
  const { data, loading, error, reload } = useAdminFetch<{ orders: Order[] }>(
    "/api/orders/mine",
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-terracotta-600" />
      </div>
    );
  }

  if (error) {
    return <AdminError message={error} onRetry={reload} />;
  }

  const orders = data?.orders ?? [];

  return (
    <>
      <PageHeader
        title="আমার অর্ডার"
        subtitle={orders.length > 0 ? `মোট ${orders.length}টি অর্ডার` : "আপনার অর্ডারের ইতিহাস"}
      />

      {orders.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-3xl border border-brown-100 bg-white text-center shadow-soft dark:border-brown-800 dark:bg-brown-900">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream text-brown-400 dark:bg-brown-950/40">
            <PackageSearch size={30} />
          </span>
          <div>
            <p className="font-bengali text-lg font-bold text-brown-900 dark:text-cream">
              এখনো কোনো অর্ডার নেই
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted">
              আপনি এখনও কোনো অর্ডার করেননি। আমাদের পণ্যগুলো দেখে প্রথম অর্ডার করুন!
            </p>
          </div>
          <Button href="/products">
            <ShoppingBag size={18} />
            পণ্য দেখুন
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={getId(order)}
              className="rounded-3xl border border-brown-100 bg-white p-5 shadow-soft dark:border-brown-800 dark:bg-brown-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-poppins text-sm font-bold text-brown-900 dark:text-cream">
                      {order.orderId}
                    </span>
                    <StatusBadge type="order" value={order.orderStatus} />
                    <StatusBadge type="payment" value={order.paymentStatus} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted">
                    {order.createdAt ? formatDateBn(order.createdAt) : ""} •{" "}
                    {paymentMethodLabel(order.paymentMethod)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted">
                    মোট
                  </p>
                  <p className="font-poppins text-lg font-bold text-terracotta-600 dark:text-gold-300">
                    {formatBDT(order.total)}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-brown-100 pt-3 dark:border-brown-800">
                <p className="text-xs font-semibold text-muted">পণ্যসমূহ:</p>
                <div className="mt-1.5 space-y-1.5">
                  {order.items.map((item, i) => (
                    <div
                      key={`${item.productId}-${i}`}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="font-bengali text-brown-800 dark:text-cream/85">
                        <span className="mr-2 rounded-md bg-cream px-1.5 py-0.5 text-xs font-bold text-terracotta-600 dark:bg-brown-950/40 dark:text-gold-300">
                          ×{item.quantity}
                        </span>
                        {item.nameBn}
                      </span>
                      <span className="whitespace-nowrap font-poppins text-xs text-muted">
                        {formatBDT(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-brown-100 pt-3 text-xs text-muted dark:border-brown-800">
                <span>
                  ডেলিভারি: {order.customer.district} — {formatBDT(order.deliveryCharge)}
                </span>
                {order.tranId && <span>ট্রানজেকশন: {order.tranId}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted">
        কোনো সাহায্য দরকার?{" "}
        <Link href="/contact" className="font-semibold text-terracotta-600 hover:underline dark:text-gold-300">
          আমাদের সাথে যোগাযোগ করুন
        </Link>
      </p>
    </>
  );
}
