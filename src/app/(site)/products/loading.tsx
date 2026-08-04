import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="mb-10 space-y-3 text-center">
        <div className="mx-auto h-4 w-40 animate-pulse rounded-full bg-brown-100 dark:bg-brown-800" />
        <div className="mx-auto h-10 w-64 animate-pulse rounded-2xl bg-brown-100 dark:bg-brown-800" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
