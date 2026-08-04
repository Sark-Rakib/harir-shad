"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminError, AdminLoading } from "@/components/admin/AdminState";
import { useAdminFetch } from "@/components/admin/useAdminFetch";
import type { AdminProduct } from "@/lib/types";

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, reload } = useAdminFetch<{
    product: AdminProduct;
  }>(`/api/products/id/${id}`);

  if (loading) return <AdminLoading />;
  if (error || !data?.product) {
    return (
      <AdminError
        message={error || "পণ্যটি পাওয়া যায়নি।"}
        onRetry={reload}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="পণ্য সম্পাদনা করুন"
        subtitle={data.product.nameBn}
      />
      <ProductForm mode="edit" productId={id} initial={data.product} />
    </>
  );
}
