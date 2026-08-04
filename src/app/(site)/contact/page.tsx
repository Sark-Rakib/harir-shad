"use client";

import { CheckCircle2, Loader2, MapPin, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { api, ApiError } from "@/lib/api";

const info = [
  { icon: Phone, label: "ফোন", value: "+880 1745-762857" },
  { icon: Mail, label: "ইমেইল", value: "harirshadbogura@gmail.com" },
  { icon: MapPin, label: "ঠিকানা", value: "বগুড়া, বাংলাদেশ" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post<{ message: string }>("/api/contact", form);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "মেসেজ পাঠানো যায়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "h-12 w-full rounded-2xl border border-brown-200 bg-white px-4 text-sm text-ink-900 outline-none transition-all focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10 dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream";

  return (
    <div className="bg-hero-gradient">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta-600 dark:text-terracotta-400">
            Contact
          </p>
          <h1 className="font-bengali text-3xl font-bold text-brown-900 dark:text-cream md:text-5xl">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted md:text-base">
            প্রশ্ন, পরামর্শ বা অর্ডার নিয়ে যেকোনো প্রয়োজনে আমাদের মেসেজ দিন।
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            {info.map((i) => (
              <div
                key={i.label}
                className="flex items-center gap-4 rounded-3xl border border-brown-100 bg-white p-5 shadow-soft dark:border-brown-800 dark:bg-brown-900/30"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-terracotta-100 text-terracotta-600 dark:bg-terracotta-900/40 dark:text-gold-300">
                  <i.icon size={20} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-muted">{i.label}</p>
                  <p className="mt-0.5 text-sm font-bold text-brown-900 dark:text-cream">
                    {i.value}
                  </p>
                </div>
              </div>
            ))}
            <div className="rounded-3xl border border-terracotta-200 bg-terracotta-50 p-5 text-xs leading-relaxed text-terracotta-800 dark:border-terracotta-900/50 dark:bg-terracotta-950/30 dark:text-terracotta-200">
              সাধারণত আমরা ২৪ ঘণ্টার মধ্যে উত্তর দিয়ে থাকি। জরুরি প্রয়োজনে
              সরাসরি ফোন করুন।
            </div>
          </div>

          <div className="rounded-3xl border border-brown-100 bg-white p-6 shadow-soft dark:border-brown-800 dark:bg-brown-900/30 md:p-8">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-300">
                  <CheckCircle2 size={32} />
                </span>
                <p className="font-bengali text-xl font-bold text-brown-900 dark:text-cream">
                  মেসেজ পাঠানো হয়েছে!
                </p>
                <p className="max-w-sm text-sm text-muted">
                  ধন্যবাদ! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                    নাম *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                    ইমেইল *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                    ফোন
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                    বিষয়
                  </label>
                  <input
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-brown-600 dark:text-cream/70">
                    মেসেজ *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    required
                    rows={5}
                    className={`${inputCls} h-auto py-3`}
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 sm:col-span-2">
                    {error}
                  </div>
                )}

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> পাঠানো
                        হচ্ছে…
                      </>
                    ) : (
                      "মেসেজ পাঠান"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
