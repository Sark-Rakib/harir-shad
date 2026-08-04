"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export default function AdminAddProductPage() {
  return (
    <>
      <PageHeader
        title="নতুন পণ্য যোগ করুন"
        subtitle="স্টোরের জন্য নতুন পণ্যের সম্পূর্ণ তথ্য দিন।"
      />
      <ProductForm mode="create" />
    </>
  );
}
