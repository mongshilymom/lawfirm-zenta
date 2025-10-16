import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/sections/Header";
import OrganizationSchema from "@/components/seo/OrganizationSchema";

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net"),
  title: {
    // ✅ 브라우저 탭/북마크 기본 제목
    default: "Zenta – AI-first Law Firm Website Template",
    // ✅ 각 페이지에서 title 지정 시 "%s | Zenta" 형식
    template: "%s | Zenta",
  },
  description:
    "A premium, responsive AI-first template for modern law firms. Built with Next.js 14, Tailwind CSS, and Supabase. Commercial-ready with dark academia design.",
  keywords: [
    "law firm template",
    "legal website",
    "Next.js template",
    "AI law firm",
    "attorney website",
    "dark academia",
    "Supabase",
  ],
  authors: [{ name: "Zenta Team" }],
  creator: "Zenta",
  publisher: "Zenta",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    // ✅ 공유 시 사이트 이름
    siteName: "Zenta",
    title: "Zenta – AI-first Law Firm Website Template",
    description: "A premium, responsive AI-first template for modern law firms.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Zenta Law Firm Template",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenta – AI-first Law Firm Website Template",
    description: "A premium, responsive AI-first template for modern law firms.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={garamond.variable}>
      <head>
        {/* ✅ 구조화데이터 (Organization/LegalService 등) */}
        <OrganizationSchema />
      </head>
      <body className="bg-ink text-parchment">
        <Header />
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6">
          {children}
        </div>
      </body>
    </html>
  );
}
