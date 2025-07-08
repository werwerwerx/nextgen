import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import FacebookPixel from "@/components/FacebookPixel";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "NextGen Appletown | Образовательная платформа",
    template: "%s | NextGen Appletown"
  },
  description: "Партнёрский лидогенератор для Neural University. Начните свой путь в IT с лучшими курсами от профессионалов.",
  keywords: ["образование", "курсы", "IT", "обучение", "программирование", "Neural University"],
  authors: [{ name: "NextGen Appletown" }],
  creator: "NextGen Appletown",
  publisher: "NextGen Appletown",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: defaultUrl,
    siteName: "NextGen Appletown",
    title: "NextGen Appletown | Образовательная платформа",
    description: "Партнёрский лидогенератор для Neural University. Начните свой путь в IT с лучшими курсами от профессионалов.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NextGen Appletown Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGen Appletown | Образовательная платформа",
    description: "Партнёрский лидогенератор для Neural University. Начните свой путь в IT с лучшими курсами от профессионалов.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "google-site-verification-code", // Добавьте ваш код верификации
  },
};

const figtree = Figtree({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${figtree.className} antialiased w-screen min-h-screen bg-background`}>
        <Providers>
          <Header />
          <div className="mt-20">
            {children}
          </div>
        </Providers>
        <Toaster />
        <FacebookPixel />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
