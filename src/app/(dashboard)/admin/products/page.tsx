"use client";

import { Loader2, Pencil, PlusCircle, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader, AdminCard } from "@/components/admin/PageHeader";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminState";
import { useAdminFetch } from "@/components/admin/useAdminFetch";
import { Button } from "@/components/ui/Button";
import { api, ApiError } from "@/lib/api";
import { formatBDT, formatDateShort, getId } from "@/lib/utils";
import type { AdminProduct } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAdminFetch<{
    products: AdminProduct[];
  }>("/api/products?includeInactive=true");

  const products = useMemo(() => {
    const list = data?.products ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.nameBn.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q),
    );
  }, [data, query]);

  const handleDelete = async (p: AdminProduct) => {
    if (!token) return;
    if (!window.confirm(`"${p.nameBn}" পণ্যটি মুছে ফেলবেন? এটি আর ফেরানো যাবে না।`)) {
      return;
    }
    setDeleting(getId(p));
    setActionError("");
    try {
      await api.deleteAuth<{ message: string }>(
        `/api/products/${getId(p)}`,
        token,
      );
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "মুছে ফেলা যায়নি।",
      );
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <AdminLoading />;
  if (error || !data) return <AdminError message={error || "ডেটা পাওয়া যায়নি।"} onRetry={reload} />;

  return (
    <>
      <PageHeader
        title="পণ্যের তালিকা"
        subtitle={`মোট ${data.products.length}টি পণ্য`}
        actions={
          <Button href="/admin/products/add" size="sm">
            <PlusCircle size={16} />
            নতুন পণ্য
          </Button>
        }
      />

      {actionError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {actionError}
        </div>
      )}

      <div className="relative mb-4 max-w-sm">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="পণ্য খুঁজুন…"
          className="h-11 w-full rounded-2xl border border-brown-200 bg-white pl-11 pr-4 text-sm text-ink-900 outline-none transition-all focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream"
        />
      </div>

      {products.length === 0 ? (
        <AdminCard>
          <AdminEmpty
            title="কোনো পণ্য পাওয়া যায়নি"
            subtitle="নতুন পণ্য যোগ করে শুরু করুন।"
          />
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-brown-100 bg-white shadow-soft dark:border-brown-800 dark:bg-brown-900">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-brown-100 text-xs uppercase tracking-wider text-muted dark:border-brown-800">
                <th className="px-5 py-4">পণ্য</th>
                <th className="px-5 py-4">দাম</th>
                <th className="px-5 py-4">স্টক</th>
                <th className="px-5 py-4">রেটিং</th>
                <th className="px-5 py-4">স্ট্যাটাস</th>
                <th className="px-5 py-4">তৈরি</th>
                <th className="px-5 py-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown-100 dark:divide-brown-800">
              {products.map((p) => (
                <tr key={getId(p)} className="transition-colors hover:bg-cream/60 dark:hover:bg-brown-950/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream dark:bg-brown-800">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt={p.nameBn}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="font-bengali text-xs text-muted">ছবি নেই</span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bengali font-semibold text-brown-900 dark:text-cream">
                          {p.nameBn}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {p.nameEn} • {p.weightLabel || `${p.weight}g`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-poppins font-semibold text-terracotta-600 dark:text-gold-300">
                    {formatBDT(p.price)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        p.stock < 20
                          ? "font-semibold text-red-600 dark:text-red-400"
                          : "font-semibold text-green-700 dark:text-green-300"
                      }
                    >
                      {p.stock}
                    </span>
                    {p.stock < 20 && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/40 dark:text-red-300">
                        কম
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    ★ {Number(p.rating ?? 0).toFixed(1)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        p.active === false
                          ? "rounded-full bg-brown-100 px-3 py-1 text-xs font-semibold text-brown-600 dark:bg-brown-800 dark:text-cream/70"
                          : "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300"
                      }
                    >
                      {p.active === false ? "নিষ্ক্রিয়" : "সক্রিয়"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-muted">
                    {p.createdAt ? formatDateShort(p.createdAt) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${getId(p)}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-brown-200 text-brown-600 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 dark:border-brown-700 dark:text-cream"
                        aria-label={`Edit ${p.nameBn}`}
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        disabled={deleting === getId(p)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-brown-200 text-red-500 transition-colors hover:border-red-400 hover:bg-red-50 disabled:opacity-50 dark:border-brown-700 dark:hover:bg-red-950/40"
                        aria-label={`Delete ${p.nameBn}`}
                      >
                        {deleting === getId(p) ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
