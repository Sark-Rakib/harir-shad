import type { SVGProps } from "react";
import { TraditionalPot } from "./ClayPotIllustrations";

interface HeroSceneProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function HeroScene({ className }: HeroSceneProps) {
  return (
    <div
      className={`relative isolate aspect-[162/172] overflow-hidden select-none ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* decorative halo */}
      <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-3/5 w-3/5 rounded-full bg-gold-300/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-10 mx-auto mt-auto h-2/5 w-2/5 translate-y-6 rounded-full bg-terracotta-300/30 blur-3xl" />

      {/* floating leaves */}
      <svg
        viewBox="0 0 120 90"
        className="pointer-events-none absolute -left-2 top-4 w-16 animate-float text-green-600/60 md:w-24"
        fill="currentColor"
      >
        <path d="M 60 6 C 46 18 40 34 42 50 C 58 56 76 52 84 40 C 88 28 76 12 60 6 Z" opacity="0.7" />
        <path d="M 62 12 C 52 20 48 30 50 40" fill="none" stroke="#355e3b" strokeWidth="2" />
      </svg>
      <svg
        viewBox="0 0 120 90"
        className="pointer-events-none absolute -right-4 bottom-6 w-14 rotate-12 animate-float-slow text-terracotta-500/60 md:w-24"
        fill="currentColor"
      >
        <path d="M 60 6 C 46 18 40 34 42 50 C 58 56 76 52 84 40 C 88 28 76 12 60 6 Z" opacity="0.7" />
      </svg>
      <svg
        viewBox="0 0 60 40"
        className="pointer-events-none absolute left-8 top-0 w-8 animate-float-slow text-gold-400/60"
        fill="currentColor"
      >
        <circle cx="30" cy="20" r="4" />
        <circle cx="14" cy="12" r="3" />
        <circle cx="46" cy="14" r="2.5" />
        <circle cx="20" cy="30" r="2.5" />
        <circle cx="42" cy="28" r="2" />
      </svg>

      {/* main pot with glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center animate-float">
        <TraditionalPot className="h-full w-auto drop-shadow-2xl" />
      </div>

      {/* steam wisps */}
      <svg
        viewBox="0 0 80 60"
        className="pointer-events-none absolute left-1/2 top-0 w-16 -translate-x-1/2 text-brown-400/50 md:w-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M 34 52 C 30 42 34 34 40 30 C 46 26 46 18 42 8" />
        <path d="M 46 52 C 50 44 46 38 50 32 C 54 26 52 18 54 10" opacity="0.7" />
      </svg>

      {/* ground */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-3 w-4/5 rounded-full bg-brown-900/10 blur-sm dark:bg-cream/10" />
    </div>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bm-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9642f" />
          <stop offset="100%" stopColor="#8f4a28" />
        </linearGradient>
        <linearGradient id="bm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6c65a" />
          <stop offset="100%" stopColor="#a98321" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#bm-body)" />
      <ellipse cx="24" cy="20" rx="12" ry="4.5" fill="#fff8f0" />
      <path
        d="M 15 20 C 18 26 30 26 33 20"
        fill="none"
        stroke="#b5653a"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 13 28 C 17 36 31 36 35 28"
        fill="none"
        stroke="#f7ecdf"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="14" r="2" fill="url(#bm-gold)" />
      <circle cx="10" cy="16" r="1.6" fill="url(#bm-gold)" />
      <circle cx="38" cy="16" r="1.6" fill="url(#bm-gold)" />
    </svg>
  );
}

export function WaveDivider({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 120"
      className={`${flip ? "rotate-180" : ""} ${className ?? ""}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,64 C240,110 480,10 720,48 C960,86 1200,20 1440,64 L1440,120 L0,120 Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M0,84 C260,120 520,50 760,82 C1000,114 1240,60 1440,96 L1440,120 L0,120 Z"
        fill="currentColor"
        opacity="0.18"
      />
    </svg>
  );
}

export function LeafPattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 120"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <g opacity="0.5">
        {[0, 80, 160].map((x) => (
          <g key={x} transform={`translate(${x},0)`}>
            <path
              d="M 120 10 C 96 30 84 60 88 90 C 118 104 150 98 162 74 C 172 52 146 20 120 10 Z"
              fill="currentColor"
              opacity="0.25"
            />
            <path
              d="M 120 22 C 106 34 100 50 102 66"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
