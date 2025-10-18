import Image from "next/image";
import Link from "next/link";
import lawyers from "@/data/lawyers.json";

export default function LawyerPreviewRow() {
  const items = lawyers
    .filter((l) => l.status === "published")
    .slice(0, 4); // 한 줄 4명만

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto mb-6 flex items-center justify-between">
        <h2 className="text-lg font-serif text-parchment/90">대표 변호사 미리보기</h2>
        <Link 
          href="/lawyers" 
          className="text-sm text-brass hover:text-brass/80 transition-colors"
        >
          전체 보기 →
        </Link>
      </div>

      {/* 데스크톱 4열, 모바일 1~2열 */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((l) => (
          <Link
            key={l.slug}
            href={`/lawyers/${l.slug}`}
            className="group rounded-2xl border border-zinc-800 bg-obsidian/60 p-4 transition-all duration-200 hover:border-brass/50 hover:-translate-y-1"
          >
            <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-xl">
              <Image
                src={l.photo}
                alt={l.photoAlt || l.nameKo}
                fill
                sizes="(min-width:1024px) 240px, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <div className="space-y-1">
              <div className="font-serif text-lg text-parchment">{l.nameKo}</div>
              <div className="text-xs text-brass/80">{l.role}</div>
              <div className="text-xs text-parchment/60 line-clamp-1">
                {l.practice && l.practice.length > 0 ? l.practice[0] : ""}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
