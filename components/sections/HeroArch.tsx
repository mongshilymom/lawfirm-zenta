"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

const INITIAL_INTENSITY = 40;
const GRAIN_SRC =
  "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBwAAAAwAQCdASoIAAgAAkA4JZwCdAEAAAEAAgA0JaQAA3AA/v8AAAA=";

export default function HeroArch() {
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateX = useTransform(pointerY, [-INITIAL_INTENSITY, INITIAL_INTENSITY], [8, -8]);
  const rotateY = useTransform(pointerX, [-INITIAL_INTENSITY, INITIAL_INTENSITY], [-8, 8]);

  const smoothRotateX = useSpring(rotateX, { stiffness: 120, damping: 18, mass: 0.5 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 120, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (prefersReducedMotion) {
      pointerX.set(0);
      pointerY.set(0);
    }
  }, [pointerX, pointerY, prefersReducedMotion]);
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - (bounds.left + bounds.width / 2);
    const relativeY = event.clientY - (bounds.top + bounds.height / 2);
    pointerX.set(Math.max(Math.min(relativeX, INITIAL_INTENSITY), -INITIAL_INTENSITY));
    pointerY.set(Math.max(Math.min(relativeY, INITIAL_INTENSITY), -INITIAL_INTENSITY));
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      aria-label="Hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate flex min-h-[80vh] flex-col items-center justify-center overflow-hidden rounded-[3rem] border border-zinc-800 bg-obsidian/80 px-6 py-20 text-center shadow-brass backdrop-blur"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-hero-linear" />
        <div className="absolute inset-0 bg-hero-radial" />
        <Image
          src={GRAIN_SRC}
          alt="Dark grain texture"
          fill          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
      </div>

      <header className="absolute inset-x-6 top-6 flex items-center justify-between text-sm text-zinc-400">
        <span className="font-sans uppercase tracking-[0.3em]">Design for Trust</span>
        <nav className="flex items-center gap-6">
          <Link href="#directory" className="hidden text-xs uppercase tracking-[0.2em] md:inline">
            변호사 찾기
          </Link>
          <Link href="/chat" className="text-xs uppercase tracking-[0.2em]">
            상담 신청
          </Link>
        </nav>
      </header>

      <motion.div
        style={{ rotateX: smoothRotateX, rotateY: smoothRotateY }}
        className="relative z-10 flex max-w-3xl flex-col items-center gap-6"
      >
        <h1 className="text-balance font-serif text-4xl leading-tight text-parchment md:text-6xl">
          신뢰를 설계하는 <span className="text-brass">AI 퍼스트</span> 로펌 아키텍처
        </h1>
        <p className="max-w-2xl text-pretty text-lg text-zinc-300 md:text-xl">
          500명 규모의 변호사 네트워크와 실시간 법률 인사이트를 단 3클릭 안에 연결하는 프리미엄 디지털 경험을 제공합니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link            href="/chat"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl bg-brass px-6 py-3 font-medium text-obsidian transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60"
          >
            AI챗 상담 신청
          </Link>
          <Link
            href="#directory"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-brass/40 px-6 py-3 font-medium text-brass transition-colors duration-200 hover:border-brass hover:text-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60"
          >
            변호사 찾기
          </Link>
        </div>
      </motion.div>
    </section>
  );
}