"use client";

import { MailOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader, AdminCard } from "@/components/admin/PageHeader";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminState";
import { useAdminFetch } from "@/components/admin/useAdminFetch";
import { api, ApiError } from "@/lib/api";
import { formatDateShort, getId } from "@/lib/utils";
import type { ContactMessage } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function AdminContactsPage() {
  const { token, user } = useAuth();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAdminFetch<{
    messages: ContactMessage[];
  }>("/api/contacts");

  const messages = useMemo(() => {
    const list = data?.messages ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q),
    );
  }, [data, query]);

  const markRead = async (m: ContactMessage) => {
    if (!user || m.read) return;
    setBusy(getId(m));
    setActionError("");
    try {
      await api.patchAuth<{ message: ContactMessage }>(
        `/api/contacts/${getId(m)}/read`,
        {},
        token,
      );
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "আপডেট করা যায়নি।",
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

  const unread = data.messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader
        title="গ্রাহকের মেসেজ"
        subtitle={`${unread}টি অপঠিত • মোট ${data.messages.length}টি মেসেজ`}
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
          placeholder="নাম, ইমেইল বা মেসেজে খুঁজুন…"
          className="h-11 w-full rounded-2xl border border-brown-200 bg-white pl-11 pr-4 text-sm text-ink-900 outline-none transition-all focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream"
        />
      </div>

      {messages.length === 0 ? (
        <AdminCard>
          <AdminEmpty
            title="কোনো মেসেজ পাওয়া যায়নি"
            subtitle="সব মেসেজ পড়া শেষ!"
          />
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={getId(m)}
              className={cn(
                "flex flex-wrap items-start justify-between gap-4 rounded-3xl border bg-white p-5 shadow-soft dark:bg-brown-900",
                m.read
                  ? "border-brown-100 dark:border-brown-800"
                  : "border-terracotta-300 bg-cream/70 dark:border-terracotta-900/50",
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {!m.read && (
                    <span className="rounded-full bg-terracotta-100 px-2.5 py-0.5 text-[10px] font-bold text-terracotta-700 dark:bg-terracotta-950/40 dark:text-terracotta-300">
                      নতুন
                    </span>
                  )}
                  <p className="font-bengali text-sm font-bold text-brown-900 dark:text-cream">
                    {m.name}
                  </p>
                  <span className="text-xs text-muted">
                    {m.email}
                    {m.phone && ` • ${m.phone}`}
                  </span>
                  {m.subject && (
                    <span className="rounded-full bg-brown-100 px-2.5 py-0.5 text-xs font-medium text-brown-600 dark:bg-brown-800 dark:text-cream/70">
                      {m.subject}
                    </span>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-brown-700 dark:text-cream/80">
                  {m.message}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {m.createdAt ? formatDateShort(m.createdAt) : ""}
                </p>
              </div>
              {!m.read && (
                <button
                  type="button"
                  onClick={() => markRead(m)}
                  disabled={busy === getId(m)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brown-200 px-4 py-2 text-xs font-semibold text-brown-700 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 disabled:opacity-50 dark:border-brown-700 dark:text-cream"
                >
                  <MailOpen size={15} />
                  পড়া হয়েছে
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
