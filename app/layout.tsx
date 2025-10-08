import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "Template Law Firm Architecture",
  description: "Dark Academia-inspired law firm digital experience"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={garamond.variable}>
      <body className="bg-ink text-parchment">
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6">
          {children}
        </div>
      </body>
    </html>
  );
}