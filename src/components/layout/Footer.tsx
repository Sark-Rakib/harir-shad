"use client";

import {
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { site } from "@/lib/site";
import { BrandMark } from "@/components/illustrations/Decorations";

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function PaymentBadges() {
  const items = ["COD", "bKash", "Nagad", "Card"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((label) => (
        <span
          key={label}
          className="rounded-lg border border-brown-200 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-brown-600 dark:border-brown-700 dark:bg-brown-800/60 dark:text-cream"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }
    setStatus("loading");
    try {
      await api.post("/api/newsletter", { email });
      setStatus("success");
      setMessage("সাবস্ক্রিপশন সম্পন্ন হয়েছে! ধন্যবাদ 🙏");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "আবার চেষ্টা করুন।");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-brown-950 text-cream">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-terracotta-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandMark className="h-11 w-11" />
              <div>
                <p className="font-bengali text-xl font-bold text-cream">
                  {site.nameBn}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold-400">
                  {site.nameEn}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-cream/60">
              {site.storyShortBn}
            </p>
            <p className="font-bengali text-sm font-semibold text-gold-300">
              {site.taglineBn}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-gold-500 hover:text-brown-950"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-gold-500 hover:text-brown-950"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-gold-500 hover:text-brown-950"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gold-400">
              দ্রুত লিংক
            </h3>
            <ul className="space-y-3 text-sm text-cream/70">
              <li>
                <Link href="/" className="transition-colors hover:text-gold-300">
                  হোম
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition-colors hover:text-gold-300"
                >
                  পণ্য সমূহ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-gold-300"
                >
                  আমাদের গল্প
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-gold-300"
                >
                  যোগাযোগ
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="transition-colors hover:text-gold-300"
                >
                  পছন্দের তালিকা
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gold-400">
              যোগাযোগ
            </h3>
            <ul className="space-y-4 text-sm text-cream/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-terracotta-400" />
                <span>{site.addressBn}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-terracotta-400" />
                <a
                  href={`tel:${site.phoneRaw}`}
                  className="transition-colors hover:text-gold-300"
                >
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="shrink-0 text-terracotta-400" />
                <span>{site.businessHoursBn}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-terracotta-400" />
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-gold-300"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gold-400">
              নিউজলেটার
            </h3>
            <p className="mb-4 text-sm text-cream/60">
              নতুন অফার ও ডিসকাউন্ট পেতে সাবস্ক্রাইব করুন
            </p>
            <form onSubmit={subscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল"
                className="h-12 w-full rounded-2xl border border-brown-700 bg-brown-900/60 px-4 text-sm text-cream outline-none transition-all placeholder:text-cream/40 focus:border-gold-400"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
              >
                <Send size={16} />
                {status === "loading" ? "সাবস্ক্রাইব হচ্ছে…" : "সাবস্ক্রাইব করুন"}
              </button>
              {message && (
                <p
                  className={`text-xs ${
                    status === "error" ? "text-red-400" : "text-green-300"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cream/50">
                পেমেন্ট মাধ্যম
              </p>
              <PaymentBadges />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-cream/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.nameBn} — {site.nameEn}. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="flex items-center gap-1.5">
            তৈরিতে ব্যবহৃত হয়েছে <span className="text-gold-400">মাটির হাঁড়ি</span> 🏺
          </p>
        </div>
      </div>
    </footer>
  );
}
