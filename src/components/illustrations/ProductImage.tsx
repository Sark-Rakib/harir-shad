"use client";

import { ImageOff } from "lucide-react";
import { useState } from "react";
import type { IllustrationKey } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  FamilyPot,
  GiftBox,
  MiniPot,
  PremiumJar,
  SourDoi,
  SweetDoi,
  TraditionalPot,
  YogurtBowl,
} from "./ClayPotIllustrations";

interface ProductImageProps {
  image?: string;
  size?: number;
  className?: string;
}

export function ProductImage({
  image,
  size = 220,
  className,
}: ProductImageProps) {
  const common = { size, className };

  const [prevImage, setPrevImage] = useState(image);
  const [error, setError] = useState(false);
  if (prevImage !== image) {
    setPrevImage(image);
    setError(false);
  }

  if (image && /^https?:\/\//i.test(image)) {
    if (error) {
      return (
        <div
          className={cn("flex items-center justify-center", className)}
          style={className ? undefined : { width: size, height: size }}
          role="img"
          aria-label="ছবিটি লোড করা যায়নি"
        >
          <ImageOff
            size={Math.max(16, Math.round(size * 0.4))}
            className="text-brown-400 dark:text-brown-600"
          />
        </div>
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        width={size}
        height={size}
        className={className}
        style={{ objectFit: "contain" }}
        onError={() => setError(true)}
      />
    );
  }

  switch (image as IllustrationKey) {
    case "traditional-pot":
      return <TraditionalPot {...common} />;
    case "mini-pot":
      return <MiniPot {...common} />;
    case "family-pot":
      return <FamilyPot {...common} />;
    case "sweet-doi":
      return <SweetDoi {...common} />;
    case "sour-doi":
      return <SourDoi {...common} />;
    case "gift-box":
      return <GiftBox {...common} />;
    case "premium-jar":
      return <PremiumJar {...common} />;
    case "yogurt-bowl":
      return <YogurtBowl {...common} />;
    default:
      return <TraditionalPot {...common} />;
  }
}
