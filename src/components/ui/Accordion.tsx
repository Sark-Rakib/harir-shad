"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  titleBn: string;
  titleEn?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  titleBn,
  titleEn,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-colors duration-300",
        open
          ? "border-terracotta-300 bg-white shadow-soft dark:border-terracotta-700 dark:bg-brown-800/40"
          : "border-brown-100 bg-white/60 hover:border-brown-200 dark:border-brown-800 dark:bg-brown-900/30",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
      >
        <span>
          <span className="font-bengali text-base font-semibold text-brown-900 dark:text-cream md:text-lg">
            {titleBn}
          </span>
          {titleEn && (
            <span className="block text-xs text-muted">{titleEn}</span>
          )}
        </span>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
            open
              ? "rotate-45 bg-terracotta-500 text-white"
              : "bg-brown-100 text-brown-600 dark:bg-brown-800 dark:text-cream",
          )}
        >
          <Plus size={16} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-sm leading-relaxed text-muted md:px-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
