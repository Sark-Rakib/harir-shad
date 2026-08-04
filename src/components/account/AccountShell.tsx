"use client";

import {
  ClipboardList,
  Loader2,
  LogOut,
  Menu,
  ShieldCheck,
  Store,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { getInitials } from "@/lib/utils";
import { HeroScene } from "@/components/illustrations/Decorations";

function NavLink({
  href,
  label,
  en,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  en: string;
  icon: typeof User;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
        active
          ? "bg-gradient-to-r from-terracotta-500 to-terracotta-700 text-white shadow-soft"
          : "text-brown-600 hover:bg-brown-100/70 dark:text-cream/70 dark:hover:bg-white/5",
      )}
    >
      <Icon size={18} className="shrink-0" />
      <span className="flex-1 truncate">
        <span className="block font-bengali">{label}</span>
        <span
          className={cn(
            "block text-[10px] uppercase tracking-wider",
            active ? "text-white/70" : "text-muted",
          )}
        >
          {en}
        </span>
      </span>
    </Link>
  );
}

export function AccountShell({ children }: { children: ReactNode }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-terracotta-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isActive = (href: string) => pathname.startsWith(href);

  const navItems = [
    { href: "/account/orders", label: "আমার অর্ডার", en: "My Orders", icon: ClipboardList },
    { href: "/account/profile", label: "প্রোফাইল", en: "Profile", icon: User },
  ];

  const renderSidebar = () => (
    <>
      <div className="mb-5 hidden items-center gap-2.5 px-2 lg:flex">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white">
          <HeroScene className="h-7 w-7" />
        </span>
        <div>
          <p className="font-bengali text-base font-bold text-brown-900 dark:text-cream">
            আমার ড্যাশবোর্ড
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted">My Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={isActive(item.href)}
            onClick={() => setMenuOpen(false)}
          />
        ))}

        {isAdmin && (
          <div className="mt-4 border-t border-brown-100 pt-3 dark:border-brown-800">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              অ্যাডমিন
            </p>
            <NavLink
              href="/admin"
              label="অ্যাডমিন প্যানেল"
              en="Admin Panel"
              icon={ShieldCheck}
              active={pathname.startsWith("/admin")}
              onClick={() => setMenuOpen(false)}
            />
          </div>
        )}
      </nav>

      <div className="mt-5 space-y-1.5 border-t border-brown-100 pt-4 dark:border-brown-800">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-brown-600 transition-all hover:bg-brown-100/70 dark:text-cream/70 dark:hover:bg-white/5"
        >
          <Store size={18} />
          <span className="font-bengali">স্টোরে যান</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/");
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <LogOut size={18} />
          <span className="font-bengali">লগআউট ({user?.name})</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-brown-950">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-brown-100 bg-white/90 px-4 py-3 backdrop-blur dark:border-brown-800 dark:bg-brown-900/90 lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
            <HeroScene className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bengali text-sm font-bold text-brown-900 dark:text-cream">
              আমার ড্যাশবোর্ড
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted">My Dashboard</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-brown-200 text-brown-700 dark:border-brown-700 dark:text-cream"
          aria-label="Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-brown-950/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-4 shadow-lift dark:bg-brown-900">
            {renderSidebar()}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed bottom-0 left-0 top-0 z-20 hidden w-64 flex-col border-r border-brown-100 bg-white p-4 dark:border-brown-800 dark:bg-brown-900 lg:flex">
        {renderSidebar()}
      </aside>

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 lg:py-8">
          {/* User banner */}
          <div className="mb-6 flex items-center gap-4 rounded-3xl border border-brown-100 bg-white p-5 shadow-soft dark:border-brown-800 dark:bg-brown-900">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 text-xl font-bold text-white">
              {getInitials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bengali text-lg font-bold text-brown-900 dark:text-cream">
                স্বাগতম, {user.name}!
              </p>
              <p className="truncate text-sm text-muted">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
