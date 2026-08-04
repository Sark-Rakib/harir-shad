"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FieldProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brown-700 dark:text-cream/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400 dark:text-cream/40">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "h-12 w-full rounded-2xl border border-brown-200/80 bg-white/70 px-4 text-sm text-ink-900 shadow-sm outline-none transition-all placeholder:text-brown-300",
              "focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10",
              "dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream dark:placeholder:text-brown-500",
              icon && "pl-11",
              error && "border-red-400 focus:border-red-400 focus:ring-red-400/10",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs font-medium text-red-500" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brown-700 dark:text-cream/80"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "min-h-28 w-full rounded-2xl border border-brown-200/80 bg-white/70 px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition-all placeholder:text-brown-300",
            "focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10",
            "dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream dark:placeholder:text-brown-500",
            error && "border-red-400 focus:border-red-400 focus:ring-red-400/10",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-red-500" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    FieldProps {
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, icon, className, id, children, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brown-700 dark:text-cream/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400 dark:text-cream/40">
              {icon}
            </span>
          )}
          <select
            id={inputId}
            ref={ref}
            className={cn(
              "h-12 w-full appearance-none rounded-2xl border border-brown-200/80 bg-white/70 px-4 text-sm text-ink-900 shadow-sm outline-none transition-all",
              "focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/10",
              "dark:border-brown-700 dark:bg-brown-900/40 dark:text-cream",
              icon && "pl-11",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <svg
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 dark:text-cream/40"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        {error ? (
          <p className="text-xs font-medium text-red-500" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
