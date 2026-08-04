import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductReviews } from "@/components/product/ProductReviews";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { fetchProductBySlug } from "@/lib/product-api";
import { site } from "@/lib/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.nameBn,
    description: product.descriptionBn,
    openGraph: {
      type: "website",
      locale: "bn_BD",
      siteName: `${site.nameBn} — ${site.nameEn}`,
      title: `${product.nameBn} — ${site.nameBn}`,
      description: product.descriptionBn,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products/${product.slug}`,
    },
    twitter: {
      card: "summary",
      title: `${product.nameBn} — ${site.nameBn}`,
      description: product.descriptionBn,
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const productUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameBn,
    description: product.descriptionBn,
    brand: { "@type": "Brand", name: site.nameBn },
    url: productUrl,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "BDT",
      price: product.price,
      availability:
        product.stock && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: site.nameBn },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating ?? 0,
      reviewCount: product.reviewsCount ?? 0,
      bestRating: 5,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted"
        >
          <Link href="/" className="transition-colors hover:text-terracotta-600">
            হোম
          </Link>
          <ChevronRight size={13} />
          <Link
            href="/products"
            className="transition-colors hover:text-terracotta-600"
          >
            পণ্য সমূহ
          </Link>
          <ChevronRight size={13} />
          <span className="truncate font-semibold text-brown-800 dark:text-cream/80">
            {product.nameBn}
          </span>
        </nav>

        {/* Main */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery product={product} />
          </div>
          <ProductDetail key={product.id} product={product} />
        </div>

        <div className="mt-16">
          <ProductInfo product={product} />
        </div>

        <ProductReviews product={product} />
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <RelatedProducts product={product} />
      </div>
    </>
  );
}
