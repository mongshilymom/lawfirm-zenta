import HeroArch from "@/components/sections/HeroArch";
import DirectorySearch from "@/components/sections/DirectorySearch";
import LawyerPreviewRow from "@/components/sections/LawyerPreviewRow";
import JsonLd from "@/components/seo/JsonLd";
import lawyers from "@/data/lawyers.json";

// ✅ 홈 탭 제목을 명시적으로 지정
export const metadata = {
  title: "LetYou - ZENTA 법률서비스 웹솔루션",
};

export default function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LegalService"],
    name: "Zenta Law",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net",
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net"}/logo.svg`,
    description: "Premium AI-first law firm website for modern legal professionals",
    sameAs: ["https://youalta.net"],
    areaServed: "Worldwide",
    priceRange: "$$$",
  };

  // published 상태인 변호사만 필터링
  const publishedLawyers = lawyers.filter((l) => l.status === "published");

  return (
    <>
      <JsonLd data={organizationSchema} />
      <main className="flex flex-1 flex-col gap-0 py-16">
        <HeroArch />
        <DirectorySearch lawyers={publishedLawyers as any} />
        <LawyerPreviewRow />
      </main>
    </>
  );
}
