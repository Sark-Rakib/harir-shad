"use client";

import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminState";
import { StatusBadge, paymentMethodLabel } from "@/components/admin/StatusBadge";
import { useAdminFetch } from "@/components/admin/useAdminFetch";
import { api, ApiError } from "@/lib/api";
import { formatBDT, formatDateShort, getId } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const statusTabs: { key: string; label: string }[] = [
  { key: "all", label: "সব" },
  { key: "pending", label: "অপেক্ষমাণ" },
  { key: "processing", label: "প্রক্রিয়াধীন" },
  { key: "shipped", label: "শিপড" },
  { key: "delivered", label: "ডেলিভারড" },
  { key: "cancelled", label: "বাতিল" },
];

const orderStatusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatusOptions: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

export default function AdminOrdersPage() {
  const { token, user } = useAuth();
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAdminFetch<{
    orders: Order[];
    total: number;
  }>(
    `/api/orders?status=${status}&q=${encodeURIComponent(query)}`,
    status === "all" && query === "" ? 0 : undefined,
  );

  const updateStatus = async (
    order: Order,
    field: "orderStatus" | "paymentStatus",
    value: string,
  ) => {
    if (!user) return;
    setBusy(`${getId(order)}-${field}`);
    setActionError("");
    try {
      await api.putAuth<{ order: Order }>(
        `/api/orders/${getId(order)}`,
        { [field]: value },
        token,
      );
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "স্ট্যাটাস আপডেট করা যায়নি।",
      );
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <AdminLoading />;
  if (error || !data) {
    return (
      <AdminError message={error || "ডেটা পাওয়া যায়নি।"} onRetry={reload} />
    );
  }

  return (
    <>
      <PageHeader
        title="অর্ডার ব্যবস্থাপনা"
        subtitle={`মোট ${data.total}টি অর্ডার`}
      />

      {actionError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {actionError}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="অর্ডার আইডি, নাম বা ফোনে খুঁজুন…"
            className="h-11 w-full rounded-2xl border border-brown-200 bg-white pl-11 pr-4 text-sm text-ink-900 outline-none transition-all focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatus(tab.key)}
              className={cn(
                "rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
                status === tab.key
                  ? "bg-gradient-to-r from-terracotta-500 to-terracotta-700 text-white shadow-soft"
                  : "bg-white text-brown-600 hover:bg-brown-100/70 dark:bg-brown-900 dark:text-cream/70 dark:hover:bg-white/5",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {data.orders.length === 0 ? (
        <div className="rounded-3xl border border-brown-100 bg-white shadow-soft dark:border-brown-800 dark:bg-brown-900">
          <AdminEmpty
            title="কোনো অর্ডার পাওয়া যায়নি"
            subtitle="এই ফিল্টারে কোনো অর্ডার নেই।"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {data.orders.map((order) => (
            <div
              key={getId(order)}
              className="rounded-3xl border border-brown-100 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift dark:border-brown-800 dark:bg-brown-900"
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
                  <p className="mt-1.5 font-bengali text-sm font-semibold text-brown-800 dark:text-cream/85">
                    {order.customer.name}
                    <span className="ml-2 font-poppins text-xs font-normal text-muted">
                      {order.customer.phone}
                    </span>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {order.customer.district} • {order.customer.address}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {order.items.length}টি পণ্য •{" "}
                    {paymentMethodLabel(order.paymentMethod)} •{" "}
                    {order.createdAt ? formatDateShort(order.createdAt) : "—"}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-poppins text-lg font-bold text-terracotta-600 dark:text-gold-300">
                    {formatBDT(order.total)}
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateStatus(order, "orderStatus", e.target.value)
                      }
                      disabled={busy === `${getId(order)}-orderStatus`}
                      className="h-9 rounded-xl border border-brown-200 bg-cream/60 px-2.5 text-xs font-medium text-brown-700 outline-none transition-colors focus:border-terracotta-500 disabled:opacity-50 dark:border-brown-700 dark:bg-brown-950/40 dark:text-cream"
                      aria-label="Order status"
                    >
                      {orderStatusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        updateStatus(order, "paymentStatus", e.target.value)
                      }
                      disabled={busy === `${getId(order)}-paymentStatus`}
                      className="h-9 rounded-xl border border-brown-200 bg-cream/60 px-2.5 text-xs font-medium text-brown-700 outline-none transition-colors focus:border-terracotta-500 disabled:opacity-50 dark:border-brown-700 dark:bg-brown-950/40 dark:text-cream"
                      aria-label="Payment status"
                    >
                      {paymentStatusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {busy === `${getId(order)}-orderStatus` ||
                    busy === `${getId(order)}-paymentStatus` ? (
                      <Loader2 size={16} className="animate-spin text-terracotta-600" />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-brown-100 pt-3 dark:border-brown-800">
                <p className="text-xs font-semibold text-muted">পণ্যসমূহ:</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span
                      key={`${item.productId}-${i}`}
                      className="rounded-full bg-cream px-3 py-1 text-xs text-brown-700 dark:bg-brown-950/40 dark:text-cream/80"
                    >
                      {item.quantity} × {item.nameBn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
