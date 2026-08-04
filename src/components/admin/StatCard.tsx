import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  en: string;
  value: string | number;
  icon: LucideIcon;
  accent: "terracotta" | "green" | "gold" | "blue" | "violet" | "brown" | "red";
}

const accents: Record<StatCardProps["accent"], string> = {
  terracotta: "bg-terracotta-100 text-terracotta-600 dark:bg-terracotta-950/40 dark:text-terracotta-300",
  green: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  gold: "bg-gold-100 text-gold-700 dark:bg-gold-950/40 dark:text-gold-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  brown: "bg-brown-100 text-brown-700 dark:bg-brown-800 dark:text-cream/80",
  red: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

export function StatCard({ label, en, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-brown-100 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift dark:border-brown-800 dark:bg-brown-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bengali text-sm font-medium text-brown-600 dark:text-cream/70">
            {label}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted">{en}</p>
          <p className="mt-3 font-poppins text-2xl font-bold text-brown-900 dark:text-cream md:text-3xl">
            {value}
          </p>
        </div>
        <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", accents[accent])}>
          <Icon size={22} />
        </span>
      </div>
    </div>
  );
}
