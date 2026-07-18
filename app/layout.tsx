import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pengui.org"),
  title: {
    default: "Pengui — Linux terminalini birlikte öğrenelim",
    template: "%s | Pengui",
  },
  description:
    "Linux terminaline yeni mi başlıyorsun? Pengui ile komutları basit açıklamalar ve gerçek kullanım örnekleriyle keşfet.",
  keywords: [
    "linux komutları",
    "türkçe linux",
    "terminal komutları",
    "bash komutları",
    "linux öğren",
    "linux başlangıç",
  ],
  openGraph: {
    title: "Pengui — Linux terminalini birlikte öğrenelim",
    description:
      "Linux terminaline yeni mi başlıyorsun? Pengui ile komutları basit açıklamalar ve gerçek kullanım örnekleriyle keşfet.",
    url: "https://pengui.org",
    siteName: "Pengui",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Pengui — Türkçe Linux komut kütüphanesi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pengui — Linux terminalini birlikte öğrenelim",
    description: "Linux terminaline yeni mi başlıyorsun? Pengui ile komutları basit açıklamalar ve gerçek kullanım örnekleriyle keşfet.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://pengui.org",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Analytics Script Config Here (e.g. Plausible) */}
        {process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}
            src="https://plausible.io/js/script.js"
          ></script>
        )}
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
