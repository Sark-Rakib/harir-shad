"use client";

import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Inputs";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন।");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success("লগইন সফল হয়েছে! স্বাগতম।");
      router.replace(res.user.role === "admin" ? "/admin" : "/account");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      titleBn="লগইন করুন"
      titleEn="Welcome Back"
      subtitle="আপনার অ্যাকাউন্টে ফিরে আসুন এবং বগুড়ার আসল স্বাদ উপভোগ করুন।"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

        <div>
          <div className="relative">
            <Input
              label="পাসওয়ার্ড"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="আপনার পাসওয়ার্ড"
              icon={<Lock size={17} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute bottom-3.5 right-4 flex h-6 w-6 items-center justify-center text-brown-400 transition-colors hover:text-terracotta-600"
              aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

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
              লগইন হচ্ছে...
            </>
          ) : (
            <>
              <LogIn size={18} />
              লগইন করুন
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-terracotta-600 hover:underline dark:text-gold-300"
        >
          রেজিস্ট্রেশন করুন
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-muted">
        অ্যাডমিন? আপনার কন্ট্রোল প্যানেলে যেতে{" "}
        <Link
          href="/admin"
          className="font-semibold text-terracotta-600 hover:underline dark:text-gold-300"
        >
          /admin
        </Link>{" "}
        ভিজিট করুন।
      </p>
    </AuthLayout>
  );
}
