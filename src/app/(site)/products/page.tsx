import type { Metadata } from "next";
import { ProductExplorer } from "@/components/product/ProductExplorer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "পণ্য সমূহ",
  description: `${site.nameBn} — মাটির হাঁড়ির দই, মিষ্টি দই, টক দই, গিফট বক্স ও ফ্যামিলি প্যাক। সারাদেশে ডেলিভারি।`,
};

export default function ProductsPage() {
  return <ProductExplorer />;
}
