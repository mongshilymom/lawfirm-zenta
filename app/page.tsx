import HeroArch from "@/components/sections/HeroArch";
import LawyerDirectory from "@/components/layouts/LawyerDirectory";
import JsonLd from "@/components/seo/JsonLd";

// ✅ 홈 탭 제목을 명시적으로 지정
export const metadata = {
  title: "Home",
};

export default function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LegalService"],
    name: "Zenta Law",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net",
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || "https://youalta.net"}/logo.svg`,
    description: "Premium AI-first law firm website template for modern legal professionals",
    sameAs: ["https://youalta.net"],
    areaServed: "Worldwide",
    priceRange: "$$$",
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <main className="flex flex-1 flex-col gap-16 py-16">
        <HeroArch />
        <LawyerDirectory />
      </main>
    </>
  );
}
