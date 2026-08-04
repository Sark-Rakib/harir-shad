"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { forwardRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonClick = (e: MouseEvent<HTMLElement>) => void;

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: ButtonClick;
  ariaLabel?: string;
  title?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-terracotta-500 to-terracotta-700 text-white shadow-soft hover:shadow-lift hover:brightness-105",
  secondary:
    "bg-gradient-to-br from-green-600 to-green-800 text-white shadow-soft hover:shadow-lift hover:brightness-105",
  gold: "bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-glow hover:brightness-105",
  outline:
    "border border-brown-200 bg-transparent text-brown-700 hover:border-terracotta-500 hover:text-terracotta-600 dark:border-brown-700 dark:text-cream",
  ghost:
    "bg-transparent text-brown-700 hover:bg-brown-100/70 dark:text-cream dark:hover:bg-white/5",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-sm md:text-base",
  xl: "h-14 px-9 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      fullWidth,
      className,
      children,
      type = "button",
      disabled,
      onClick,
      ariaLabel,
      title,
    },
    ref,
  ) => {
    const classes = cn(
      "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-wide transition-all duration-300",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-600",
      "disabled:cursor-not-allowed disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className,
    );

    if (href) {
      return (
        <Link
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          title={title}
          className={classes}
        >
          {children}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        type={type}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
        title={title}
        className={classes}
      >
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
