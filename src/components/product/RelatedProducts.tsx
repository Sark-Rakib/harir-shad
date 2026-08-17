import type { Product } from "@/lib/types";
import { fetchAllProducts } from "@/lib/server-product-api";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  product: Product;
}

function computeRelated(product: Product, all: Product[], count: number) {
  return all
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aShared = (a.tags ?? []).filter((t) =>
        (product.tags ?? []).includes(t),
      ).length;
      const bShared = (b.tags ?? []).filter((t) =>
        (product.tags ?? []).includes(t),
      ).length;
      return bShared - aShared;
    })
    .slice(0, count);
}

export async function RelatedProducts({ product }: RelatedProductsProps) {
  let related: Product[] = [];
  try {
    const all = await fetchAllProducts();
    related = computeRelated(product, all, 4);
  } catch {
    related = [];
  }

  if (related.length === 0) return null;

  return (
    <section className="mt-20">
      <SectionHeading
        eyebrowBn="আরও পণ্য"
        eyebrowEn="You may also like"
        titleBn="সম্পর্কিত পণ্য"
        titleEn="Related Products"
        description="একই ঐতিহ্যের স্বাদ — হয়তো আপনার পছন্দের পরবর্তী পণ্যটি এখানেই।"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
