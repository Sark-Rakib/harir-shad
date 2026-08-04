"use client";

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  UserPlus,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Inputs";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !email || !password) {
      toast.warning("সব ঘর পূরণ করুন।");
      return;
    }
    if (password.length < 6) {
      toast.warning("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (password !== confirm) {
      toast.warning("পাসওয়ার্ড দুইবার একই রকম নয়।");
      return;
    }

    setLoading(true);
    try {
      const res = await register({ name, email, phone, password });
      toast.success("রেজিস্ট্রেশন সফল হয়েছে! স্বাগতম।");
      router.replace(res.user.role === "admin" ? "/admin" : "/account");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "রেজিস্ট্রেশন ব্যর্থ হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      titleBn="অ্যাকাউন্ট খুলুন"
      titleEn="Create Account"
      subtitle="রেজিস্ট্রেশন করে অর্ডার করুন এবং বিশেষ অফার পেয়ে যান।"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="আপনার নাম"
          name="name"
          placeholder="পুরো নাম লিখুন"
          icon={<User size={17} />}
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

        <Input
          label="ইমেইল"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="আপনার ইমেইল"
          icon={<Mail size={17} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="পাসওয়ার্ড"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="নতুন পাসওয়ার্ড"
              icon={<Lock size={17} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-12"
            />
          </div>
          <div>
            <Input
              label="পাসওয়ার্ড নিশ্চিত"
              name="confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="আবার লিখুন"
              icon={<Lock size={17} />}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="pr-12"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-brown-500 transition-colors hover:text-terracotta-600 dark:text-cream/60"
        >
          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
        </button>

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={loading}
          className="mt-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              অ্যাকাউন্ট তৈরি হচ্ছে...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              অ্যাকাউন্ট তৈরি করুন
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-terracotta-600 hover:underline dark:text-gold-300"
        >
          লগইন করুন
        </Link>
      </p>
    </AuthLayout>
  );
}
