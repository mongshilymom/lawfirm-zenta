// C:\Users\mongshilymom\dev\letyou\templates\template-lawfirm-zenta/app/components/LetYouBadge.tsx
// (로펌 템플릿 웹사이트에 부착될 LetYou 포트폴리오 안내 배지)

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
        // 로컬 스토리지 확인 (배지 닫기 상태 유지)
        if (localStorage.getItem('letyouBadgeClosed') === '1') setHidden(true);
        // 현재 호스트 이름으로 UTM 소스 설정
        setSource(window.location.hostname || 'demo'); 
      }
    } catch {}
  }, []);

  const contactHref = useMemo(
    // 문의하기 버튼의 링크를 동적으로 생성 (UTM 추적용)
    () =>
      `https://letyou.kr/#contact?utm_source=${encodeURIComponent(
        source
      )}&utm_medium=demo_badge&utm_campaign=portfolio`,
    [source]
  );

  if (hidden) return null; // 배지가 숨겨져야 할 경우 null 반환

  return (
    <>
      {/* 하단 고정 배지 컨테이너 */}
      <div id="letyou-badge" role="complementary" aria-label="LetYou 포트폴리오 안내">
        <div className="inner">
          {/* 좌측: 로고 + 안내문 */}
          <div className="left">
            <Image
              src="/brand/letyou-logo-48.png"
              alt="LetYou"
              width={20}
              height={20}
              sizes="20px"
              priority={false}
            />
            <span className="muted">이 페이지는</span>
            <strong className="brand">LetYou 포트폴리오 데모</strong>
            <span className="dot" aria-hidden>
              ·
            </span>
            <a
              className="email"
              href="mailto:hello@letyou.kr"
              aria-label="이메일로 문의하기: hello@letyou.kr"
            >
              hello@letyou.kr
            </a>
          </div>

          {/* 우측: 문의 버튼 + 닫기 */}
          <div className="right">
            <Link href={contactHref} className="btn" aria-label="LetYou 문의하기">
              문의하기 <span aria-hidden>›</span>
            </Link>
            <button
              className="close"
              onClick={() => {
                setHidden(true);
                try {
                  // 로컬 스토리지에 닫기 상태 저장
                  localStorage.setItem('letyouBadgeClosed', '1');
                } catch {}
              }}
              aria-label="배지 닫기"
              title="닫기"
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* 컨텐츠가 가려지지 않도록 하단 여백 (높이 64px) */}
      <div aria-hidden style={{ height: 64 }} />

      {/* CSS 스타일링 (Styled-JSX) */}
      <style jsx>{`
        #letyou-badge {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2147483647;
          pointer-events: none; /* 오버레이가 본문 클릭 막지 않도록 */
        }
        .inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: transparent;
          color: inherit;
          font-size: 14px;
        }
        .left {
          display: flex;
          align-items: center;
          gap: 10px;
          pointer-events: auto; /* 이메일 클릭 가능 */
          line-height: 1.6;
        }
        .muted {
          opacity: 0.8;
        }
        .brand {
          font-weight: 600;
        }
        .dot {
          opacity: 0.6;
          padding: 0 2px;
        }
        .email {
          text-decoration: underline;
          opacity: 0.85;
        }
        .right {
          display: flex;
          gap: 8px;
          pointer-events: auto; /* 버튼/닫기 클릭 가능 */
        }
        .btn {
          background: #fff;
          color: #111;
          padding: 8px 14px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .close {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: rgba(0, 0, 0, 0.06);
          color: inherit;
          font-size: 18px;
          line-height: 1;
        }
        @media (max-width: 380px) {
          .email {
            display: none; /* 모바일 초소형에서 이메일 텍스트 숨김 */
          }
        }
      `}</style>
    </>
  );
}