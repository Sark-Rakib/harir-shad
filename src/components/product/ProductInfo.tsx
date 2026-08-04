"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Apple, Check, Clock, FlaskConical, Truck } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cn, formatBDT } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
}

type TabKey = "description" | "nutrition" | "ingredients" | "delivery";

const tabs: { key: TabKey; labelBn: string; labelEn: string }[] = [
  { key: "description", labelBn: "বর্ণনা", labelEn: "Description" },
  { key: "nutrition", labelBn: "পুষ্টি তথ্য", labelEn: "Nutrition" },
  { key: "ingredients", labelBn: "উপকরণ", labelEn: "Ingredients" },
  { key: "delivery", labelBn: "ডেলিভারি", labelEn: "Delivery" },
];

const nutritionItems = (product: Product) => {
  const n = product.nutrition ?? {
    serving: "100g",
    energyKcal: 0,
    fat: 0,
    protein: 0,
    carbs: 0,
    sugar: 0,
    calciumMg: 0,
  };
  return [
    { labelBn: "শক্তি", labelEn: "Energy", value: `${n.energyKcal ?? 0} kcal` },
    { labelBn: "চর্বি", labelEn: "Fat", value: `${n.fat ?? 0}g` },
    { labelBn: "প্রোটিন", labelEn: "Protein", value: `${n.protein ?? 0}g` },
    { labelBn: "কার্বোহাইড্রেট", labelEn: "Carbs", value: `${n.carbs ?? 0}g` },
    { labelBn: "চিনি", labelEn: "Sugar", value: `${n.sugar ?? 0}g` },
    { labelBn: "ক্যালসিয়াম", labelEn: "Calcium", value: `${n.calciumMg ?? 0}mg` },
  ];
};

export function ProductInfo({ product }: ProductInfoProps) {
  const [active, setActive] = useState<TabKey>("description");
  const delivery = product.delivery ?? {
    insideDhaka: 80,
    outsideDhaka: 120,
    leadTimeBn: "",
    leadTimeEn: "",
    freeOver: 1000,
  };
  const serving = product.nutrition?.serving ?? "100g";

  return (
    <div className="rounded-3xl border border-brown-100 bg-white shadow-soft dark:border-brown-800 dark:bg-brown-900/30">
      {/* Tab bar */}
      <div className="scrollbar-none flex gap-1 overflow-x-auto border-b border-brown-100 p-2 dark:border-brown-800 md:gap-2 md:p-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            aria-selected={active === tab.key}
            role="tab"
            className={cn(
              "flex shrink-0 flex-col items-center gap-0.5 rounded-2xl px-4 py-3 transition-all duration-300 md:px-6",
              active === tab.key
                ? "bg-gradient-to-br from-terracotta-500 to-terracotta-700 text-white shadow-soft"
                : "text-brown-600 hover:bg-brown-100/70 dark:text-cream/70 dark:hover:bg-white/5",
            )}
          >
            <span className="font-bengali text-sm font-bold">{tab.labelBn}</span>
            <span
              className={cn(
                "hidden text-[10px] uppercase tracking-wider sm:block",
                active === tab.key
                  ? "text-white/80"
                  : "text-muted",
              )}
            >
              {tab.labelEn}
            </span>
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            role="tabpanel"
          >
            {active === "description" && (
              <div className="max-w-3xl">
                <p className="font-bengali text-base leading-relaxed text-brown-800 dark:text-cream/90">
                  {product.descriptionBn}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {product.descriptionEn}
                </p>
              </div>
            )}

            {active === "nutrition" && (
              <div>
                <p className="mb-4 text-xs text-muted">
                  প্রতি {serving} গ্রামে পুষ্টিগুণ
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {nutritionItems(product).map((item) => (
                    <div
                      key={item.labelEn}
                      className="rounded-2xl border border-brown-100 bg-cream/60 p-4 text-center dark:border-brown-800 dark:bg-brown-800/40"
                    >
                      <Apple size={18} className="mx-auto text-terracotta-500" />
                      <p className="mt-2 text-lg font-bold text-brown-900 dark:text-cream">
                        {item.value}
                      </p>
                      <p className="font-bengali text-xs font-semibold text-brown-600 dark:text-gold-300">
                        {item.labelBn}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-muted">
                        {item.labelEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "ingredients" && (
              <div className="max-w-2xl">
                <ul className="space-y-3">
                  {(product.ingredientsBn ?? []).map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-2xl border border-brown-100 bg-cream/60 px-4 py-3 dark:border-brown-800 dark:bg-brown-800/40"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <div>
                        <p className="font-bengali text-sm font-semibold text-brown-900 dark:text-cream">
                          {item}
                        </p>
                        <p className="text-xs text-muted">
                          {(product.ingredientsEn ?? [])[i]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted">
                  কোনো প্রিজারভেটিভ, রং বা কৃত্রিম স্বাদ নেই। ১০০% খাঁটি ও
                  প্রাকৃতিক।
                </p>
              </div>
            )}

            {active === "delivery" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-brown-100 bg-cream/60 p-5 dark:border-brown-800 dark:bg-brown-800/40">
                  <Truck size={22} className="text-terracotta-500" />
                  <p className="mt-3 text-2xl font-bold text-brown-900 dark:text-cream">
                    {formatBDT(delivery.insideDhaka)}
                  </p>
                  <p className="font-bengali text-sm font-semibold text-brown-600 dark:text-gold-300">
                    ঢাকার ভেতরে
                  </p>
                  <p className="text-xs text-muted">Inside Dhaka</p>
                </div>
                <div className="rounded-2xl border border-brown-100 bg-cream/60 p-5 dark:border-brown-800 dark:bg-brown-800/40">
                  <Truck size={22} className="text-terracotta-500" />
                  <p className="mt-3 text-2xl font-bold text-brown-900 dark:text-cream">
                    {formatBDT(delivery.outsideDhaka)}
                  </p>
                  <p className="font-bengali text-sm font-semibold text-brown-600 dark:text-gold-300">
                    ঢাকার বাইরে
                  </p>
                  <p className="text-xs text-muted">Outside Dhaka</p>
                </div>
                <div className="rounded-2xl border border-brown-100 bg-cream/60 p-5 dark:border-brown-800 dark:bg-brown-800/40">
                  <Clock size={22} className="text-gold-600" />
                  <p className="mt-3 font-bengali text-sm font-bold leading-snug text-brown-900 dark:text-cream">
                    {delivery.leadTimeBn}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {delivery.leadTimeEn}
                  </p>
                </div>
                <div className="rounded-2xl border border-brown-100 bg-cream/60 p-5 dark:border-brown-800 dark:bg-brown-800/40">
                  <FlaskConical size={22} className="text-green-600" />
                  <p className="mt-3 text-2xl font-bold text-green-700 dark:text-green-300">
                    {formatBDT(delivery.freeOver)}+
                  </p>
                  <p className="font-bengali text-sm font-semibold text-brown-600 dark:text-gold-300">
                    অর্ডারে ফ্রি ডেলিভারি
                  </p>
                  <p className="text-xs text-muted">Free Delivery</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
