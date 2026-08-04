"use client";

import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

export function AdminLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2 size={28} className="animate-spin text-terracotta-600" />
    </div>
  );
}

export function AdminError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300">
        <AlertTriangle size={26} />
      </span>
      <p className="max-w-sm text-sm font-medium text-brown-700 dark:text-cream/80">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full border border-brown-200 px-5 py-2 text-sm font-medium text-brown-700 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 dark:border-brown-700 dark:text-cream"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}

export function AdminEmpty({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brown-100 text-brown-500 dark:bg-brown-800 dark:text-cream/50">
        <Inbox size={26} />
      </span>
      <p className="font-bengali text-base font-semibold text-brown-700 dark:text-cream/80">
        {title}
      </p>
      {subtitle && <p className="max-w-sm text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
