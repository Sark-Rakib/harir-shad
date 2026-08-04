"use client";

import {
  AlertTriangle,
  Clock,
  Package,
  PackageOpen,
  PlusCircle,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { PageHeader, AdminCard } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { AdminError, AdminLoading } from "@/components/admin/AdminState";
import { useAdminFetch } from "@/components/admin/useAdminFetch";
import { formatBDT } from "@/lib/utils";
import type { DashboardStats } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useAdminFetch<{
    stats: DashboardStats;
  }>("/api/stats");

  if (loading) return <AdminLoading />;
  if (error || !data) return <AdminError message={error || "ডেটা পাওয়া যায়নি।"} onRetry={reload} />;

  const s = data.stats;

  return (
    <>
      <PageHeader
        title="স্বাগতম!"
        subtitle={`${user?.name} — আজকের ব্যবসার অবস্থা এক নজরে দেখুন।`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="মোট আয়"
          en="Revenue"
          value={formatBDT(s.revenue)}
          icon={Wallet}
          accent="green"
        />
        <StatCard
          label="মোট অর্ডার"
          en="Total Orders"
          value={s.totalOrders}
          icon={ShoppingBag}
          accent="terracotta"
        />
        <StatCard
          label="অপেক্ষমাণ অর্ডার"
          en="Pending"
          value={s.pendingOrders}
          icon={Clock}
          accent="gold"
        />
        <StatCard
          label="মোট পণ্য"
          en="Products"
          value={s.totalProducts}
          icon={Package}
          accent="blue"
        />
        <StatCard
          label="সক্রিয় পণ্য"
          en="Active"
          value={s.activeProducts}
          icon={PackageOpen}
          accent="violet"
        />
        <StatCard
          label="কম স্টক"
          en="Low Stock"
          value={s.lowStock}
          icon={AlertTriangle}
          accent="red"
        />
        <StatCard
          label="মোট গ্রাহক"
          en="Users"
          value={s.totalUsers}
          icon={Users}
          accent="brown"
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <h2 className="mb-4 font-bengali text-lg font-bold text-brown-900 dark:text-cream">
            দ্রুত কাজ
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/products/add"
              className="group flex items-center gap-4 rounded-2xl border border-brown-100 bg-cream/60 p-4 transition-all hover:border-terracotta-500 hover:shadow-soft dark:border-brown-800 dark:bg-brown-950/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 text-white">
                <PlusCircle size={22} />
              </span>
              <span>
                <span className="block font-bengali font-semibold text-brown-900 dark:text-cream">
                  নতুন পণ্য যোগ করুন
                </span>
                <span className="block text-xs text-muted">
                  ছবি আপলোডসহ সম্পূর্ণ তথ্য
                </span>
              </span>
            </Link>
            <Link
              href="/admin/orders"
              className="group flex items-center gap-4 rounded-2xl border border-brown-100 bg-cream/60 p-4 transition-all hover:border-terracotta-500 hover:shadow-soft dark:border-brown-800 dark:bg-brown-950/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-white">
                <ShoppingBag size={22} />
              </span>
              <span>
                <span className="block font-bengali font-semibold text-brown-900 dark:text-cream">
                  অর্ডার দেখুন
                </span>
                <span className="block text-xs text-muted">
                  স্ট্যাটাস আপডেট করুন
                </span>
              </span>
            </Link>
            <Link
              href="/admin/products"
              className="group flex items-center gap-4 rounded-2xl border border-brown-100 bg-cream/60 p-4 transition-all hover:border-terracotta-500 hover:shadow-soft dark:border-brown-800 dark:bg-brown-950/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-green-800 text-white">
                <Package size={22} />
              </span>
              <span>
                <span className="block font-bengali font-semibold text-brown-900 dark:text-cream">
                  পণ্যের তালিকা
                </span>
                <span className="block text-xs text-muted">
                  এডিট / ডিলিট করুন
                </span>
              </span>
            </Link>
            <Link
              href="/admin/users"
              className="group flex items-center gap-4 rounded-2xl border border-brown-100 bg-cream/60 p-4 transition-all hover:border-terracotta-500 hover:shadow-soft dark:border-brown-800 dark:bg-brown-950/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <Users size={22} />
              </span>
              <span>
                <span className="block font-bengali font-semibold text-brown-900 dark:text-cream">
                  ব্যবহারকারী
                </span>
                <span className="block text-xs text-muted">
                  রোল ও স্ট্যাটাস
                </span>
              </span>
            </Link>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 font-bengali text-lg font-bold text-brown-900 dark:text-cream">
            সংক্ষিপ্ত তথ্য
          </h2>
          <dl className="space-y-3 text-sm">
            {[
              ["মোট আয়", formatBDT(s.revenue)],
              ["সক্রিয় পণ্য", `${s.activeProducts} / ${s.totalProducts}`],
              ["কম স্টক", s.lowStock],
              ["অপেক্ষমাণ অর্ডার", s.pendingOrders],
              ["গ্রাহক সংখ্যা", s.totalUsers],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl bg-cream/60 px-4 py-3 dark:bg-brown-950/40"
              >
                <dt className="font-bengali text-brown-600 dark:text-cream/70">
                  {label}
                </dt>
                <dd className="font-poppins font-bold text-brown-900 dark:text-cream">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </AdminCard>
      </div>
    </>
  );
}
