import Link from "next/link";

const placeholders = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: "홍길동 변호사",
  role: index % 2 === 0 ? "Partner" : "Associate",
  practices: ["기업법", "규제 대응"],
  years: 12,
  summary: "국내외 대규모 분쟁 및 규제 리스크 컨설팅 경험을 보유하고 있습니다."
}));

export default function LawyerDirectory() {
  return (
    <section id="directory" className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-2 pb-20">
      <header className="sticky top-6 z-10 -mx-2 rounded-3xl border border-zinc-800 bg-obsidian/90 px-6 py-5 shadow-brass backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brass/80">Lawyer Directory</p>
            <h2 className="mt-2 font-serif text-3xl text-parchment">500명 전문팀을 위한 매거진형 탐색</h2>
          </div>
          <Link
            href="/lawyers"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-brass/60 px-5 py-2 text-sm text-brass transition-colors duration-200 hover:border-brass hover:text-parchment"
          >
            전체 보기
          </Link>
        </div>
        <form className="mt-6 grid gap-3 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
          <label className="flex flex-col gap-2">            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">이름/전문분야</span>
            <input
              type="search"
              name="query"
              placeholder="예: 기업 인수, 공정거래"
              className="rounded-2xl border border-zinc-700 bg-obsidian px-4 py-3 text-sm text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">직급</span>
            <select className="rounded-2xl border border-zinc-700 bg-obsidian px-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none">
              <option value="all">전체</option>
              <option value="partner">Partner</option>
              <option value="associate">Associate</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">전문 분야</span>
            <select className="rounded-2xl border border-zinc-700 bg-obsidian px-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none">
              <option value="all">모든 분야</option>
              <option value="dispute">분쟁 해결</option>
              <option value="mna">M&A</option>
              <option value="ai">AI 규제</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">경력</span>
            <select className="rounded-2xl border border-zinc-700 bg-obsidian px-4 py-3 text-sm text-parchment focus:border-brass focus:outline-none">
              <option value="all">전체</option>              <option value="10+">10년 이상</option>
              <option value="15+">15년 이상</option>
            </select>
          </label>
        </form>
      </header>

      <ul className="grid gap-10 md:grid-cols-2">
        {placeholders.map((lawyer) => (
          <li
            key={lawyer.id}
            className="group relative grid gap-4 rounded-3xl border border-zinc-800 bg-obsidian/80 p-6 transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-serif text-2xl text-parchment">{lawyer.name}</p>
              <span className="rounded-full border border-brass/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-brass/80">
                {lawyer.role}
              </span>
            </div>
            <p className="text-sm text-zinc-400">{lawyer.summary}</p>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
              <span>{lawyer.years} Years</span>
              {lawyer.practices.map((practice) => (
                <span key={practice} className="rounded-full border border-zinc-700 px-3 py-1 text-[11px] text-zinc-400">
                  {practice}
                </span>
              ))}
            </div>
            <Link
              href={`/lawyers/${lawyer.id}`}              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center self-start rounded-full border border-transparent bg-zinc-900/60 px-4 py-2 text-sm text-parchment transition-colors duration-200 hover:border-brass hover:text-brass"
            >
              프로필 보기
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}