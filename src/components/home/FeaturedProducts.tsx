import { ArrowRight } from "lucide-react";
import { fetchLatestProducts } from "@/lib/product-api";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";

export async function FeaturedProducts() {
  let products: Awaited<ReturnType<typeof fetchLatestProducts>> = [];
  let error = "";

  try {
    products = await fetchLatestProducts(8);
  } catch (err) {
    error = err instanceof Error ? err.message : "পণ্য লোড করা যায়নি।";
  }

  if (error) {
    return (
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <p className="font-bengali text-lg font-semibold text-brown-800 dark:text-cream">
            পণ্য লোড করা যায়নি।
          </p>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrowBn="জনপ্রিয় পণ্য"
          eyebrowEn="Bestsellers"
          titleBn="আমাদের সেরা পণ্যসমূহ"
          titleEn="Our Signature Selection"
          description="প্রজন্মের পর প্রজন্ম ধরে ব্যবহৃত একই রেসিপিতে তৈরি — প্রতিটি হাঁড়িতে বগুড়ার ঐতিহ্যের নিখুঁত প্রতিফলন।"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/products" variant="outline" size="lg">
            সব পণ্য দেখুন
            <ArrowRight size={17} />
          </Button>
        </div>
      </div>
    </section>
  );
}
