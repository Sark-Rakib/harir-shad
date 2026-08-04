"use client";

import { Loader2, Mail, Phone, Save, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, AdminCard } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/Inputs";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.warning("নাম অন্তত ২ অক্ষরের হতে হবে।");
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      toast.warning("সঠিক ফোন নম্বর দিন।");
      return;
    }

    setBusy(true);
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() });
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "প্রোফাইল আপডেট করা যায়নি।",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="প্রোফাইল"
        subtitle="আপনার ব্যক্তিগত তথ্য দেখুন ও আপডেট করুন।"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminCard className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="নাম"
              name="name"
              placeholder="আপনার নাম"
              icon={<UserIcon size={17} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="ফোন নম্বর"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              icon={<Phone size={17} />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Button type="submit" size="lg" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Save size={18} />
                  সংরক্ষণ করুন
                </>
              )}
            </Button>
          </form>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 font-bengali text-lg font-bold text-brown-900 dark:text-cream">
            অ্যাকাউন্ট তথ্য
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl bg-cream/60 px-4 py-3 dark:bg-brown-950/40">
              <Mail size={16} className="shrink-0 text-terracotta-600 dark:text-gold-300" />
              <div className="min-w-0">
                <dt className="text-xs text-muted">ইমেইল</dt>
                <dd className="truncate font-medium text-brown-900 dark:text-cream">
                  {user?.email}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-cream/60 px-4 py-3 dark:bg-brown-950/40">
              <Phone size={16} className="shrink-0 text-terracotta-600 dark:text-gold-300" />
              <div className="min-w-0">
                <dt className="text-xs text-muted">ফোন</dt>
                <dd className="truncate font-medium text-brown-900 dark:text-cream">
                  {user?.phone}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-cream/60 px-4 py-3 dark:bg-brown-950/40">
              <UserIcon size={16} className="shrink-0 text-terracotta-600 dark:text-gold-300" />
              <div className="min-w-0">
                <dt className="text-xs text-muted">রোল</dt>
                <dd className="font-medium text-brown-900 dark:text-cream">
                  {user?.role === "admin" ? "অ্যাডমিন" : "গ্রাহক"}
                </dd>
              </div>
            </div>
          </dl>
        </AdminCard>
      </div>
    </>
  );
}
