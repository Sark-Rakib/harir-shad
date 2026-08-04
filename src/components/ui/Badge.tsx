import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  tone?: "gold" | "green" | "terracotta" | "neutral" | "danger";
  className?: string;
}

const tones = {
  gold: "bg-gold-100 text-gold-800 dark:bg-gold-900/50 dark:text-gold-200",
  green:
    "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
  terracotta:
    "bg-terracotta-100 text-terracotta-800 dark:bg-terracotta-900/50 dark:text-terracotta-200",
  neutral:
    "bg-brown-100 text-brown-700 dark:bg-brown-800/60 dark:text-cream",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
