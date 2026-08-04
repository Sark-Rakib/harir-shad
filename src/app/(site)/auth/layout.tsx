import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "লগইন / রেজিস্ট্রেশন",
  description: "হাঁড়ির স্বাদ — লগইন করুন বা নতুন অ্যাকাউন্ট খুলুন।",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
