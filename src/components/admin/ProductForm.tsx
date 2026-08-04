"use client";

import { CheckCircle2, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminCard } from "@/components/admin/PageHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Inputs";
import { api, ApiError } from "@/lib/api";
import type { AdminProduct, ProductPayload } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

interface FormState {
  nameBn: string;
  nameEn: string;
  slug: string;
  taglineBn: string;
  taglineEn: string;
  descriptionBn: string;
  descriptionEn: string;
  price: string;
  oldPrice: string;
  weight: string;
  weightLabel: string;
  stock: string;
  rating: string;
  reviewsCount: string;
  tags: string;
  image: string;
  active: boolean;
  serving: string;
  energyKcal: string;
  fat: string;
  protein: string;
  carbs: string;
  sugar: string;
  calciumMg: string;
  insideDhaka: string;
  outsideDhaka: string;
  freeOver: string;
  leadTimeBn: string;
  leadTimeEn: string;
}

function toForm(p?: AdminProduct | null): FormState {
  return {
    nameBn: p?.nameBn ?? "",
    nameEn: p?.nameEn ?? "",
    slug: p?.slug ?? "",
    taglineBn: p?.taglineBn ?? "",
    taglineEn: p?.taglineEn ?? "",
    descriptionBn: p?.descriptionBn ?? "",
    descriptionEn: p?.descriptionEn ?? "",
    price: p?.price != null ? String(p.price) : "",
    oldPrice: p?.oldPrice ? String(p.oldPrice) : "",
    weight: p?.weight != null ? String(p.weight) : "",
    weightLabel: p?.weightLabel ?? "",
    stock: p?.stock != null ? String(p.stock) : "0",
    rating: p?.rating != null ? String(p.rating) : "4.8",
    reviewsCount: p?.reviewsCount != null ? String(p.reviewsCount) : "0",
    tags: (p?.tags ?? []).join(", "),
    image: p?.image ?? "",
    active: p?.active ?? true,
    serving: p?.nutrition?.serving ?? "100g",
    energyKcal: p?.nutrition?.energyKcal != null ? String(p.nutrition.energyKcal) : "0",
    fat: p?.nutrition?.fat != null ? String(p.nutrition.fat) : "0",
    protein: p?.nutrition?.protein != null ? String(p.nutrition.protein) : "0",
    carbs: p?.nutrition?.carbs != null ? String(p.nutrition.carbs) : "0",
    sugar: p?.nutrition?.sugar != null ? String(p.nutrition.sugar) : "0",
    calciumMg: p?.nutrition?.calciumMg != null ? String(p.nutrition.calciumMg) : "0",
    insideDhaka: p?.delivery?.insideDhaka != null ? String(p.delivery.insideDhaka) : "80",
    outsideDhaka: p?.delivery?.outsideDhaka != null ? String(p.delivery.outsideDhaka) : "120",
    freeOver: p?.delivery?.freeOver != null ? String(p.delivery.freeOver) : "1000",
    leadTimeBn: p?.delivery?.leadTimeBn ?? "",
    leadTimeEn: p?.delivery?.leadTimeEn ?? "",
  };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 border-b border-brown-100 pb-2 font-bengali text-base font-bold text-brown-900 dark:border-brown-800 dark:text-cream">
      {children}
    </h3>
  );
}

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  initial?: AdminProduct | null;
}

export function ProductForm({ mode, productId, initial }: ProductFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toForm(initial));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.nameBn.trim() || !form.nameEn.trim()) {
      setError("বাংলা ও ইংরেজি নাম দিন।");
      return;
    }
    const price = Number(form.price);
    const weight = Number(form.weight);
    if (!price || price <= 0) {
      setError("সঠিক দাম (৳) দিন।");
      return;
    }
    if (!weight || weight <= 0) {
      setError("পণ্যের ওজন (গ্রাম) দিন।");
      return;
    }
    if (!token) return;

    const payload: ProductPayload = {
      slug: form.slug.trim() || undefined,
      nameBn: form.nameBn.trim(),
      nameEn: form.nameEn.trim(),
      taglineBn: form.taglineBn.trim(),
      taglineEn: form.taglineEn.trim(),
      descriptionBn: form.descriptionBn.trim(),
      descriptionEn: form.descriptionEn.trim(),
      price,
      oldPrice: Number(form.oldPrice) || 0,
      weight,
      weightLabel: form.weightLabel.trim(),
      stock: Number(form.stock) || 0,
      rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
      reviewsCount: Number(form.reviewsCount) || 0,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      image: form.image,
      active: form.active,
      nutrition: {
        serving: form.serving.trim() || "100g",
        energyKcal: Number(form.energyKcal) || 0,
        fat: Number(form.fat) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        sugar: Number(form.sugar) || 0,
        calciumMg: Number(form.calciumMg) || 0,
      },
      delivery: {
        insideDhaka: Number(form.insideDhaka) || 0,
        outsideDhaka: Number(form.outsideDhaka) || 0,
        freeOver: Number(form.freeOver) || 0,
        leadTimeBn: form.leadTimeBn.trim(),
        leadTimeEn: form.leadTimeEn.trim(),
      },
    };

    setBusy(true);
    try {
      if (mode === "create") {
        await api.postAuth<{ product: AdminProduct }>(
          "/api/products",
          payload,
          token,
        );
      } else {
        await api.putAuth<{ product: AdminProduct }>(
          `/api/products/${productId}`,
          payload,
          token,
        );
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/products"), 800);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "পণ্য সংরক্ষণ করা যায়নি।",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
          <CheckCircle2 size={18} />
          পণ্য সফলভাবে সংরক্ষণ হয়েছে! পণ্যের তালিকায় যাচ্ছে...
        </div>
      )}

      <AdminCard>
        <SectionTitle>মৌলিক তথ্য</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="বাংলা নাম *"
            name="nameBn"
            placeholder="যেমন: মিষ্টি দই ৫০০ গ্রাম"
            value={form.nameBn}
            onChange={(e) => set("nameBn", e.target.value)}
            required
          />
          <Input
            label="English Name *"
            name="nameEn"
            placeholder="e.g. Sweet Doi 500g"
            value={form.nameEn}
            onChange={(e) => set("nameEn", e.target.value)}
            required
          />
          <Input
            label="Slug (ঐচ্ছিক)"
            name="slug"
            placeholder="ইংরেজি নাম থেকে অটো তৈরি হবে"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
          <Input
            label="ওজন লেবেল"
            name="weightLabel"
            placeholder="যেমন: ৫০০ গ্রাম / 500g"
            value={form.weightLabel}
            onChange={(e) => set("weightLabel", e.target.value)}
          />
          <Input
            label="ট্যাগলাইন (বাংলা)"
            name="taglineBn"
            placeholder="সংক্ষিপ্ত স্লোগান"
            value={form.taglineBn}
            onChange={(e) => set("taglineBn", e.target.value)}
          />
          <Input
            label="Tagline (English)"
            name="taglineEn"
            placeholder="Short tagline"
            value={form.taglineEn}
            onChange={(e) => set("taglineEn", e.target.value)}
          />
        </div>
      </AdminCard>

      <AdminCard>
        <SectionTitle>মূল্য, ওজন ও স্টক</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="দাম (৳) *"
            name="price"
            type="number"
            min="1"
            placeholder="350"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            required
          />
          <Input
            label="আগের দাম (৳)"
            name="oldPrice"
            type="number"
            min="0"
            placeholder="আগের দাম থাকলে"
            value={form.oldPrice}
            onChange={(e) => set("oldPrice", e.target.value)}
          />
          <Input
            label="ওজন (গ্রাম) *"
            name="weight"
            type="number"
            min="1"
            placeholder="500"
            value={form.weight}
            onChange={(e) => set("weight", e.target.value)}
            required
          />
          <Input
            label="স্টক"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
          />
          <Input
            label="রেটিং (০–৫)"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={(e) => set("rating", e.target.value)}
          />
          <Input
            label="রিভিউ সংখ্যা"
            name="reviewsCount"
            type="number"
            min="0"
            value={form.reviewsCount}
            onChange={(e) => set("reviewsCount", e.target.value)}
          />
          <Input
            label="ট্যাগ (কমা দিয়ে আলাদা করুন)"
            name="tags"
            placeholder="popular, new"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            className="md:col-span-2"
          />
          <label className="flex items-center gap-3 self-end pb-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-5 w-5 rounded border-brown-300 accent-terracotta-600"
            />
            <span className="text-sm font-medium text-brown-700 dark:text-cream/80">
              স্টোরে সক্রিয়
            </span>
          </label>
        </div>
      </AdminCard>

      <AdminCard>
        <SectionTitle>ছবি</SectionTitle>
        <ImageUpload value={form.image} onChange={(url) => set("image", url)} />
      </AdminCard>

      <AdminCard>
        <SectionTitle>বিবরণ</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea
            label="বিবরণ (বাংলা)"
            name="descriptionBn"
            placeholder="পণ্যের বিস্তারিত বর্ণনা লিখুন..."
            value={form.descriptionBn}
            onChange={(e) => set("descriptionBn", e.target.value)}
          />
          <Textarea
            label="Description (English)"
            name="descriptionEn"
            placeholder="Write a detailed description..."
            value={form.descriptionEn}
            onChange={(e) => set("descriptionEn", e.target.value)}
          />
        </div>
      </AdminCard>

      <AdminCard>
        <SectionTitle>পুষ্টি তথ্য</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="পরিমাণ"
            name="serving"
            placeholder="100g"
            value={form.serving}
            onChange={(e) => set("serving", e.target.value)}
          />
          <Input
            label="শক্তি (kcal)"
            name="energyKcal"
            type="number"
            value={form.energyKcal}
            onChange={(e) => set("energyKcal", e.target.value)}
          />
          <Input
            label="চর্বি (g)"
            name="fat"
            type="number"
            value={form.fat}
            onChange={(e) => set("fat", e.target.value)}
          />
          <Input
            label="প্রোটিন (g)"
            name="protein"
            type="number"
            value={form.protein}
            onChange={(e) => set("protein", e.target.value)}
          />
          <Input
            label="কার্বোহাইড্রেট (g)"
            name="carbs"
            type="number"
            value={form.carbs}
            onChange={(e) => set("carbs", e.target.value)}
          />
          <Input
            label="চিনি (g)"
            name="sugar"
            type="number"
            value={form.sugar}
            onChange={(e) => set("sugar", e.target.value)}
          />
          <Input
            label="ক্যালসিয়াম (mg)"
            name="calciumMg"
            type="number"
            value={form.calciumMg}
            onChange={(e) => set("calciumMg", e.target.value)}
          />
        </div>
      </AdminCard>

      <AdminCard>
        <SectionTitle>ডেলিভারি</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="ঢাকার ভেতরে (৳)"
            name="insideDhaka"
            type="number"
            min="0"
            value={form.insideDhaka}
            onChange={(e) => set("insideDhaka", e.target.value)}
          />
          <Input
            label="ঢাকার বাইরে (৳)"
            name="outsideDhaka"
            type="number"
            min="0"
            value={form.outsideDhaka}
            onChange={(e) => set("outsideDhaka", e.target.value)}
          />
          <Input
            label="ফ্রি ডেলিভারি (৳+)"
            name="freeOver"
            type="number"
            min="0"
            value={form.freeOver}
            onChange={(e) => set("freeOver", e.target.value)}
          />
          <Input
            label="ডেলিভারি সময় (বাংলা)"
            name="leadTimeBn"
            placeholder="যেমন: ১–২ দিন"
            value={form.leadTimeBn}
            onChange={(e) => set("leadTimeBn", e.target.value)}
          />
          <Input
            label="Delivery Time (English)"
            name="leadTimeEn"
            placeholder="e.g. 1–2 days"
            value={form.leadTimeEn}
            onChange={(e) => set("leadTimeEn", e.target.value)}
          />
        </div>
      </AdminCard>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              সংরক্ষণ হচ্ছে...
            </>
          ) : (
            <>
              <Save size={18} />
              {mode === "create" ? "পণ্য যোগ করুন" : "পরিবর্তন সংরক্ষণ করুন"}
            </>
          )}
        </Button>
        <Link
          href="/admin/products"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-brown-200 px-7 text-sm font-medium text-brown-700 transition-colors hover:border-terracotta-500 hover:text-terracotta-600 dark:border-brown-700 dark:text-cream"
        >
          বাতিল
        </Link>
      </div>
    </form>
  );
}
