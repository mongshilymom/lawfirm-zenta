'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

export default function LetYouBadge() {
  const [hidden, setHidden] = useState(false);
  const [source, setSource] = useState<string>('demo');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('letyouBadgeClosed') === '1') setHidden(true);
        setSource(window.location.hostname || 'demo');
      }
    } catch {}
  }, []);

  const backHref = useMemo(
    () =>
      `https://letyou.kr/?utm_source=${encodeURIComponent(source)}&utm_medium=demo_bar&utm_campaign=portfolio`,
    [source]
  );

  if (hidden) return null;

  return (
    <>
      {/* 하단 고정 배지 */}
      <div
        id="letyou-badge"
        style={{ position:'fixed', left:0, right:0, bottom:0, zIndex:2147483647, pointerEvents:'none' }}
      >
        <div
          style={{
            maxWidth:1200, margin:'0 auto',
            padding:'10px 16px calc(10px + env(safe-area-inset-bottom))',
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
            background:'transparent', color:'inherit', fontSize:14,
            borderRadius:10,
            // backdropFilter:'saturate(180%) blur(6px)',       // 제거
            // borderTop:'1px solid rgba(255,255,255,.12)',     // 제거
          }}
        >
          {/* 좌측: 로고 + 안내문 */}
          <div style={{ display:'flex', alignItems:'center', gap:10, pointerEvents:'none' }}>
            <Image src="/brand/letyou-logo-48.png" alt="LetYou" width={24} height={24} sizes="24px" />
            <span>이 페이지는 <strong>LetYou 홈페이지 포트폴리오</strong> 입니다</span>
          </div>

          {/* 우측: 방문 버튼 + 닫기 버튼 */}
          <div style={{ display:'flex', gap:8 }}>
            <Link
              href={backHref}
              style={{
                pointerEvents:'auto', background:'#fff', color:'#111',
                padding:'8px 14px', borderRadius:999, textDecoration:'none', fontWeight:700,
                display:'inline-flex', alignItems:'center', gap:6,
              }}
              aria-label="LetYou.kr 방문"
            >
              LetYou.kr 방문 <span aria-hidden>{'\u203A'}</span>
            </Link>

            <button
              onClick={() => { setHidden(true); try { localStorage.setItem('letyouBadgeClosed','1'); } catch {} }}
              style={{
                pointerEvents:'auto', background:'rgba(0,0,0,.06)', color:'inherit',
                width:36, height:36, borderRadius:999, border:'1px solid rgba(0,0,0,.12)',
                display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:18, lineHeight:1,
              }}
              aria-label="배지 닫기"
              title="닫기"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* 컨텐츠가 가려지지 않도록 하단 여백 */}
      <div style={{ height:64 }} />
    </>
  );
}
