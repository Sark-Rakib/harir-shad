"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ClipboardList,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  Truck,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/illustrations/Decorations";
import { SearchOverlay } from "./SearchOverlay";

const navLinks = [
  { href: "/", labelBn: "হোম", labelEn: "Home" },
  { href: "/products", labelBn: "পণ্য", labelEn: "Products" },
  { href: "/about", labelBn: "আমাদের গল্প", labelEn: "About" },
  { href: "/contact", labelBn: "যোগাযোগ", labelEn: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { itemCount, setCartOpen, wishlist } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-800 text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-medium tracking-wide md:text-xs">
          <Truck size={14} className="hidden sm:block" aria-hidden="true" />
          <span className="font-bengali">
            সারাদেশে ডেলিভারি • {site.nameBn} — {site.taglineBn}
          </span>
          <span className="hidden text-green-200 sm:inline">
            | ৳{site.districtsServed > 1000 ? "1,000" : "1,000"}+ অর্ডারে ফ্রি
            ডেলিভারি
          </span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "glass dark:glass-dark shadow-soft" : "bg-transparent",
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 md:h-20 md:gap-4 md:px-8"
          aria-label="Main navigation"
        >
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-brown-700 transition-colors hover:bg-brown-100/70 md:hidden dark:text-cream dark:hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <BrandMark className="h-8 w-8 shrink-0 md:h-11 md:w-11" />
            <span className="flex flex-col leading-tight">
              <span className="truncate font-bengali text-base font-bold text-brown-900 md:text-xl dark:text-cream">
                {site.nameBn}
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-terracotta-600 sm:block dark:text-gold-300">
                {site.nameEn}
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative rounded-full px-4 py-2 text-sm font-medium text-brown-700 transition-colors hover:text-terracotta-600 dark:text-cream/85 dark:hover:text-gold-300"
                >
                  <span className="font-bengali">{link.labelBn}</span>
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-terracotta-500 to-gold-500 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-1 md:gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-brown-700 transition-colors hover:bg-brown-100/70 md:h-10 md:w-10 dark:text-cream dark:hover:bg-white/5"
              aria-label="Search products"
            >
              <Search size={20} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="hidden h-9 w-9 items-center justify-center rounded-xl text-brown-700 transition-colors hover:bg-brown-100/70 sm:flex md:h-10 md:w-10 dark:text-cream dark:hover:bg-white/5"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div ref={accountRef} className="relative">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex h-9 items-center gap-2 rounded-full border border-brown-200 bg-white/60 py-1 pl-1 pr-2 text-brown-800 transition-colors hover:border-terracotta-500 md:h-10 md:pr-3 dark:border-brown-700 dark:bg-brown-900/60 dark:text-cream"
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-terracotta-500 to-terracotta-700 text-sm font-bold text-white md:h-8 md:w-8">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden max-w-24 truncate text-sm font-medium md:block">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={15}
                      className={cn(
                        "text-muted transition-transform duration-200",
                        accountOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        role="menu"
                        className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-brown-100 bg-cream p-2 shadow-lift dark:border-brown-800 dark:bg-brown-900"
                      >
                        <div className="border-b border-brown-100 px-3 py-2.5 dark:border-brown-800">
                          <p className="truncate text-sm font-semibold text-brown-900 dark:text-cream">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-brown-700 transition-colors hover:bg-brown-100/70 dark:text-cream dark:hover:bg-white/5"
                          role="menuitem"
                        >
                          <ClipboardList size={16} />
                          আমার ড্যাশবোর্ড
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountOpen(false)}
                            className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-brown-700 transition-colors hover:bg-brown-100/70 dark:text-cream dark:hover:bg-white/5"
                            role="menuitem"
                          >
                            <LayoutDashboard size={16} />
                            অ্যাডমিন প্যানেল
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setAccountOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                          role="menuitem"
                        >
                          <LogOut size={16} />
                          লগআউট
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex h-9 w-9 items-center justify-center rounded-full  bg-white/60 text-sm font-medium text-brown-800 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 md:h-10 md:w-10 dark:border-brown-700 dark:bg-brown-900/60 dark:text-cream dark:hover:text-gold-300"
                  aria-label="Login"
                >
                  <User size={18} />
                </Link>
              )}
            </div>

            <Link
              href="/wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-brown-700 transition-colors hover:bg-brown-100/70 md:h-10 md:w-10 dark:text-cream dark:hover:bg-white/5"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl shadow-soft transition-transform hover:scale-105 md:h-10 md:w-10"
              aria-label={`Open cart, ${itemCount} items`}
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-white shadow"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-brown-950/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="flex h-full w-[300px] flex-col bg-cream p-6 dark:bg-brown-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-bengali text-xl font-bold text-brown-900 dark:text-cream">
                  {site.nameBn}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-brown-700 hover:bg-brown-100/70 dark:text-cream dark:hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-bengali text-lg font-semibold text-brown-800 transition-colors hover:bg-terracotta-100/70 dark:text-cream dark:hover:bg-white/5"
                    >
                      {link.labelBn}
                      <span className="text-xs font-normal text-muted">
                        {link.labelEn}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {user ? (
                <div className="mt-5 space-y-1 border-t border-brown-100 pt-4 dark:border-brown-800">
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 font-bengali text-sm font-semibold text-brown-800 transition-colors hover:bg-terracotta-100/70 dark:text-cream dark:hover:bg-white/5"
                  >
                    <Heart size={17} />
                    পছন্দের তালিকা
                    {wishlist.length > 0 && (
                      <span className="ml-auto rounded-full bg-terracotta-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 font-bengali text-sm font-semibold text-brown-800 transition-colors hover:bg-terracotta-100/70 dark:text-cream dark:hover:bg-white/5"
                  >
                    <ClipboardList size={17} />
                    আমার ড্যাশবোর্ড
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 font-bengali text-sm font-semibold text-brown-800 transition-colors hover:bg-terracotta-100/70 dark:text-cream dark:hover:bg-white/5"
                    >
                      <LayoutDashboard size={17} />
                      অ্যাডমিন প্যানেল
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-bengali text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <LogOut size={17} />
                    লগআউট
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-2 border-t border-brown-100 pt-4 dark:border-brown-800">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 px-4 py-3 font-bengali text-sm font-bold text-white shadow-soft"
                  >
                    <User size={17} />
                    লগইন করুন
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brown-200 px-4 py-3 font-bengali text-sm font-bold text-brown-700 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 dark:border-brown-700 dark:text-cream"
                  >
                    অ্যাকাউন্ট খুলুন
                  </Link>
                </div>
              )}
              <div className="mt-auto rounded-2xl bg-gradient-to-br from-terracotta-500 to-brown-700 p-5 text-cream">
                <p className="font-bengali text-base font-bold">
                  {site.taglineBn}
                </p>
                <p className="mt-1 text-xs opacity-80">{site.phoneDisplay}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
