"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, ZoomIn } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/illustrations/ProductImage";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : product.image
        ? [product.image]
        : [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main image with zoom */}
      <div
        className="relative aspect-square overflow-hidden rounded-3xl border border-brown-100 bg-gradient-to-br from-cream to-cream-dark dark:border-brown-800 dark:from-brown-800 dark:to-brown-900"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex h-full w-full items-center justify-center p-6 transition-transform duration-200 sm:p-10",
              zoomed && "scale-150",
            )}
            style={
              zoomed
                ? { transformOrigin: `${pos.x}% ${pos.y}%` }
                : undefined
            }
          >
            <ProductImage image={images[active]} size={380} className="h-full w-full" />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brown-600 shadow-soft backdrop-blur dark:bg-brown-800/80 dark:text-cream">
          <ZoomIn size={18} />
        </div>
        <span className="pointer-events-none absolute left-4 top-4 hidden items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-brown-600 shadow-soft backdrop-blur dark:bg-brown-800/80 dark:text-cream sm:flex">
          <Maximize2 size={12} />
          হোভার করে জুম করুন
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 bg-cream transition-all duration-300 dark:bg-brown-800",
              active === i
                ? "border-terracotta-500 shadow-soft"
                : "border-transparent opacity-70 hover:opacity-100",
            )}
            aria-label={`View image ${i + 1}`}
            aria-current={active === i}
          >
            <ProductImage image={img} size={64} />
          </button>
        ))}
      </div>
    </div>
  );
}
