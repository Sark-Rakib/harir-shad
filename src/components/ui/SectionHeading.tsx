import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrowBn?: string;
  eyebrowEn?: string;
  titleBn: string;
  titleEn?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrowBn,
  eyebrowEn,
  titleBn,
  titleEn,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-10 max-w-2xl md:mb-14",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {(eyebrowBn || eyebrowEn) && (
        <div
          className={cn(
            "mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-600 dark:text-terracotta-400",
            align === "center" && "justify-center",
          )}
        >
          {eyebrowBn && (
            <span className="font-bengali text-sm normal-case tracking-normal">
              {eyebrowBn}
            </span>
          )}
          {eyebrowEn && <span className="hidden sm:inline">{eyebrowEn}</span>}
        </div>
      )}
      <h2 className="font-bengali text-3xl font-bold leading-tight text-brown-900 dark:text-cream md:text-4xl lg:text-[2.75rem]">
        {titleBn}
        {titleEn && (
          <span className="mt-1 block font-sans text-base font-medium text-muted dark:text-cream/60 md:text-lg">
            {titleEn}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          {description}
        </p>
      )}
    </Reveal>
  );
}
