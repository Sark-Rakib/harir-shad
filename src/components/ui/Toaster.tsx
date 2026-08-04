"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/providers/theme-provider";

export function AppToaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      theme={theme}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          borderRadius: "1rem",
        },
      }}
    />
  );
}
