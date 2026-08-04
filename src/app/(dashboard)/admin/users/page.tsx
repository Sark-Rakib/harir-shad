"use client";

import { Loader2, Search, Shield, ShieldOff, Trash2, UserCheck, UserX } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader, AdminCard } from "@/components/admin/PageHeader";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminState";
import { useAdminFetch } from "@/components/admin/useAdminFetch";
import { api, ApiError } from "@/lib/api";
import { formatDateShort, getInitials, getId } from "@/lib/utils";
import type { AdminUser } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAdminFetch<{ users: AdminUser[] }>(
    "/api/users",
  );

  const users = useMemo(() => {
    const list = data?.users ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q),
    );
  }, [data, query]);

  const run = async (action: () => Promise<unknown>, key: string) => {
    if (!token) return;
    setBusy(key);
    setActionError("");
    try {
      await action();
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "অপারেশনটি সফল হয়নি।",
      );
    } finally {
      setBusy(null);
    }
  };

  const toggleActive = (u: AdminUser) =>
    run(
      () =>
        api.putAuth<{ user: AdminUser }>(
          `/api/users/${getId(u)}`,
          { active: !u.active },
          token!,
        ),
      `active-${getId(u)}`,
    );

  const toggleRole = (u: AdminUser) =>
    run(
      () =>
        api.putAuth<{ user: AdminUser }>(
          `/api/users/${getId(u)}`,
          { role: u.role === "admin" ? "user" : "admin" },
          token!,
        ),
      `role-${getId(u)}`,
    );

  const handleDelete = (u: AdminUser) => {
    if (!window.confirm(`"${u.name}" কে মুছে ফেলবেন? এটি আর ফেরানো যাবে না।`)) {
      return;
    }
    run(
      () => api.deleteAuth<{ message: string }>(`/api/users/${getId(u)}`, token!),
      `delete-${getId(u)}`,
    );
  };

  if (loading) return <AdminLoading />;
  if (error || !data) {
    return (
      <AdminError message={error || "ডেটা পাওয়া যায়নি।"} onRetry={reload} />
    );
  }

  const isSelf = (u: AdminUser) => getId(u) === currentUser?.id;

  return (
    <>
      <PageHeader
        title="ব্যবহারকারী ব্যবস্থাপনা"
        subtitle={`মোট ${data.users.length}জন ব্যবহারকারী`}
      />

      {actionError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {actionError}
        </div>
      )}

      <div className="relative mb-4 max-w-sm">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="নাম, ইমেইল বা ফোনে খুঁজুন…"
          className="h-11 w-full rounded-2xl border border-brown-200 bg-white pl-11 pr-4 text-sm text-ink-900 outline-none transition-all focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream"
        />
      </div>

      {users.length === 0 ? (
        <AdminCard>
          <AdminEmpty
            title="কোনো ব্যবহারকারী পাওয়া যায়নি"
            subtitle="অন্য একটি টার্ম দিয়ে খুঁজে দেখুন।"
          />
        </AdminCard>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-brown-100 bg-white shadow-soft dark:border-brown-800 dark:bg-brown-900">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-brown-100 text-xs uppercase tracking-wider text-muted dark:border-brown-800">
                <th className="px-5 py-4">ব্যবহারকারী</th>
                <th className="px-5 py-4">রোল</th>
                <th className="px-5 py-4">স্ট্যাটাস</th>
                <th className="px-5 py-4">যোগদান</th>
                <th className="px-5 py-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown-100 dark:divide-brown-800">
              {users.map((u) => (
                <tr
                  key={getId(u)}
                  className="transition-colors hover:bg-cream/60 dark:hover:bg-brown-950/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                          u.role === "admin"
                            ? "bg-gradient-to-br from-terracotta-500 to-terracotta-700"
                            : "bg-gradient-to-br from-green-600 to-green-800"
                        }`}
                      >
                        {getInitials(u.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bengali font-semibold text-brown-900 dark:text-cream">
                          {u.name}
                          {isSelf(u) && (
                            <span className="ml-2 rounded-full bg-brown-100 px-2 py-0.5 text-[10px] font-bold text-brown-600 dark:bg-brown-800 dark:text-cream/70">
                              আপনি
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-muted">{u.email}</p>
                        <p className="truncate text-xs text-muted">{u.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        u.role === "admin"
                          ? "rounded-full bg-terracotta-100 px-3 py-1 text-xs font-semibold text-terracotta-700 dark:bg-terracotta-950/40 dark:text-terracotta-300"
                          : "rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                      }
                    >
                      {u.role === "admin" ? "অ্যাডমিন" : "গ্রাহক"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        u.active
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300"
                          : "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-300"
                      }
                    >
                      {u.active ? "সক্রিয়" : "ব্লকড"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-muted">
                    {u.createdAt ? formatDateShort(u.createdAt) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleRole(u)}
                        disabled={isSelf(u) || busy !== null}
                        title={
                          isSelf(u)
                            ? "নিজের রোল পরিবর্তন করা যাবে না"
                            : u.role === "admin"
                              ? "গ্রাহক করুন"
                              : "অ্যাডমিন করুন"
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-brown-200 text-brown-600 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brown-700 dark:text-cream"
                        aria-label="Toggle role"
                      >
                        {busy === `role-${getId(u)}` ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : u.role === "admin" ? (
                          <ShieldOff size={16} />
                        ) : (
                          <Shield size={16} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(u)}
                        disabled={isSelf(u) || busy !== null}
                        title={
                          isSelf(u)
                            ? "নিজের স্ট্যাটাস পরিবর্তন করা যাবে না"
                            : u.active
                              ? "ব্লক করুন"
                              : "সক্রিয় করুন"
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-brown-200 text-brown-600 transition-colors hover:border-green-500 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brown-700 dark:text-cream"
                        aria-label="Toggle active"
                      >
                        {busy === `active-${getId(u)}` ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : u.active ? (
                          <UserX size={16} />
                        ) : (
                          <UserCheck size={16} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        disabled={isSelf(u) || busy !== null}
                        title={isSelf(u) ? "নিজেকে মুছে ফেলা যাবে না" : "মুছে ফেলুন"}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-brown-200 text-red-500 transition-colors hover:border-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brown-700 dark:hover:bg-red-950/40"
                        aria-label="Delete user"
                      >
                        {busy === `delete-${getId(u)}` ? (
                          <Loader2 size={15} className="animate-spin" />
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

      <p className="mt-4 text-xs text-muted">
        * নিজের অ্যাকাউন্টের রোল, স্ট্যাটাস বা ডিলিট পরিবর্তন করা যাবে না।
      </p>
    </>
  );
}
