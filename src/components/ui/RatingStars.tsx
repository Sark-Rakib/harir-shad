import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

export function RatingStars({
  rating,
  reviewsCount,
  size = 16,
  className,
  showValue = true,
}: RatingStarsProps) {
  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      aria-label={`${rating} out of 5 stars`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              className={
                filled
                  ? "fill-gold-500 text-gold-500"
                  : "fill-brown-200 text-brown-200 dark:fill-brown-700 dark:text-brown-700"
              }
              aria-hidden="true"
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-brown-600 dark:text-gold-300">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount != null && (
        <span className="text-xs text-muted">
          ({reviewsCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
