import React from 'react';

type Member = {
  id: number;
  name: string;
  title: string;
  practice: string;
  photo: string; // public 경로 사용
};

const members: Member[] = [
  {
    id: 1,
    name: '배영민',
    title: '파트너변호사',
    practice: '기업지배구조, M&A',
    photo: '/images/attorneys/attorney-01.png',
  },
  {
    id: 2,
    name: '김현성',
    title: '대표변호사',
    practice: '지배구조, 소송',
    photo: '/images/attorneys/attorney-02.png',
  },
  {
    id: 3,
    name: '이정윤',
    title: '변호사',
    practice: '지적재산권, 규제자문',
    photo: '/images/attorneys/attorney-03.png',
  },
  {
    id: 4,
    name: '박지현',
    title: '파트너변호사',
    practice: '노동, 분쟁',
    photo: '/images/attorneys/attorney-04.png',
  },
  {
    id: 5,
    name: '최민호',
    title: '파트너변호사',
    practice: '건식, 국제분쟁',
    photo: '/images/attorneys/attorney-05.png',
  },
  {
    id: 6,
    name: '정수연',
    title: '파트너변호사',
    practice: '디지털자산, 핀테크',
    photo: '/images/attorneys/attorney-06.png',
  },
  {
    id: 7,
    name: '강민준',
    title: '파트너변호사',
    practice: '세무, 투자',
    photo: '/images/attorneys/attorney-07.png',
  },
  {
    id: 8,
    name: '윤서현',
    title: '파트너변호사',
    practice: '금융, ESG',
    // 08번 파일도 public 폴더에 추가해 주세요.
    photo: '/images/attorneys/attorney-08.png',
  },
];

function Card({ m }: { m: Member }) {
  return (
    <article className="group">
      <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 bg-white">
        <img
          src={m.photo}
          alt={`${m.name} 변호사`}
          loading="lazy"
          className="w-full h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="px-4 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{m.name}</h3>
          <p className="text-sm text-gray-600">{m.title}</p>
          <p className="mt-1 text-xs text-gray-500">{m.practice}</p>
        </div>
      </div>
    </article>
  );
}

export default function AttorneysGrid() {
  return (
    <section aria-labelledby="attorneys-heading" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 id="attorneys-heading" className="sr-only">
        주요 구성원
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map((m) => (
          <Card key={m.id} m={m} />
        ))}
      </div>
    </section>
  );
}
