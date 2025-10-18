import lawyers from "@/data/lawyers.json";
import LawyersListClient from "@/components/lawyers/LawyersListClient";

export const metadata = {
  title: "변호사 소개 | Zenta Law",
  description: "ZENTA Law의 전문 변호사진을 만나보세요. 각 분야 최고의 법률 전문가들이 귀하의 법률 문제를 해결해 드립니다.",
};

export default function LawyersPage() {
  const publishedLawyers = lawyers.filter((l) => l.status === "published");

  return (
    <main className="bg-ink min-h-screen">
      {/* 헤더 섹션 */}
      <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-ink">
        <div className="px-6 py-16 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold text-parchment md:text-5xl">
            변호사 소개
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-parchment/70">
            각 분야 최고의 법률 전문가들이 귀하의 법률 문제를 해결해 드립니다
          </p>
        </div>
      </section>

      {/* 변호사 목록 (필터링 포함) */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <LawyersListClient lawyers={publishedLawyers as any} />
        </div>
      </section>
    </main>
  );
}
