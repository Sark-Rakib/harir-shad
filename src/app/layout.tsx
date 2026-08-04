import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Poppins } from "next/font/google";
import { CartProvider } from "@/providers/cart-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { AppToaster } from "@/components/ui/Toaster";
import { site } from "@/lib/site";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: `${site.nameBn} — ${site.nameEn} | ${site.taglineBn}`,
    template: `%s | ${site.nameBn} — ${site.nameEn}`,
  },
  description: `${site.storyShortBn} মাটির হাঁড়িতে তৈরি খাঁটি বগুড়ার দই — সারাদেশে ডেলিভারি।`,
  keywords: [
    "বগুড়ার দই",
    "মাটির হাঁড়ির দই",
    "Bogura Doi",
    "Taste of Bogura",
    "হাঁড়ির স্বাদ",
    "authentic yogurt",
  ],
  authors: [{ name: site.nameBn }],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: `${site.nameBn} — ${site.nameEn}`,
    title: `${site.nameBn} — ${site.taglineBn}`,
    description: site.storyShortBn,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nameBn} — ${site.taglineBn}`,
    description: site.storyShortEn,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1613" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${hindSiliguri.variable} ${poppins.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hs-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
            <AppToaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
