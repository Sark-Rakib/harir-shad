"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/providers/cart-provider";
import { site } from "@/lib/site";

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  const { itemCount, setCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
          `আসসালামু আলাইকুম, ${site.nameBn} থেকে অর্ডার করতে চাই।`,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-24 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lift transition-transform hover:scale-110 md:bottom-6 md:right-6"
        aria-label="WhatsApp এ মেসেজ করুন"
      >
        <WhatsAppIcon size={26} />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-brown-900 px-3 py-1.5 text-xs font-medium text-cream opacity-0 transition-opacity group-hover:opacity-100">
          WhatsApp এ অর্ডার করুন
        </span>
      </a>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-10 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-brown-200 bg-white/80 text-brown-700 shadow-soft backdrop-blur transition-colors hover:border-terracotta-400 hover:text-terracotta-600 md:bottom-6 md:left-6 md:right-auto"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sticky cart button (mobile) */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.button
            type="button"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gradient-to-br from-terracotta-500 to-terracotta-700 px-5 py-3 text-sm font-semibold text-white shadow-lift md:hidden"
            aria-label="View cart"
          >
            <ShoppingBag size={18} />
            <span>{itemCount} টি পণ্য</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
