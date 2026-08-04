import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

const orderStatusStyles: Record<OrderStatus, string> = {
  pending: "bg-gold-100 text-gold-700 dark:bg-gold-950/40 dark:text-gold-300",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  shipped: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  delivered: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  pending: "bg-gold-100 text-gold-700 dark:bg-gold-950/40 dark:text-gold-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  refunded: "bg-brown-100 text-brown-700 dark:bg-brown-800 dark:text-cream/80",
};

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "অপেক্ষমাণ",
  processing: "প্রক্রিয়াধীন",
  shipped: "শিপড",
  delivered: "ডেলিভারড",
  cancelled: "বাতিল",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "পেন্ডিং",
  paid: "পরিশোধিত",
  failed: "ব্যর্থ",
  refunded: "রিফান্ডেড",
};

export function StatusBadge({
  type,
  value,
}: {
  type: "order" | "payment";
  value: string;
}) {
  const styles =
    type === "order"
      ? orderStatusStyles[value as OrderStatus] ?? orderStatusStyles.pending
      : paymentStatusStyles[value as PaymentStatus] ?? paymentStatusStyles.pending;
  const label =
    type === "order"
      ? orderStatusLabels[value as OrderStatus] ?? value
      : paymentStatusLabels[value as PaymentStatus] ?? value;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles,
      )}
    >
      {label}
    </span>
  );
}

export function paymentMethodLabel(method: string): string {
  switch (method) {
    case "cod":
      return "ক্যাশ অন ডেলিভারি";
    case "bkash":
      return "বিকাশ";
    case "nagad":
      return "নগদ";
    case "card":
      return "কার্ড";
    default:
      return method;
  }
}
