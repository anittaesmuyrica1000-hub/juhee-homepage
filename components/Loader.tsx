"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const DURATION = 1600; // 카운트업 시간(ms)

export default function Loader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 관리자 영역에서는 인트로 생략
    if (isAdmin) {
      setDone(true);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCount(100);
      setLeaving(true);
      const t = setTimeout(() => setDone(true), 200);
      return () => clearTimeout(t);
    }

    document.body.style.overflow = "hidden";
    let raf = 0;
    let leaveTimer: ReturnType<typeof setTimeout>;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        leaveTimer = setTimeout(() => setDone(true), 850);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
    };
  }, [isAdmin]);

  // 리빌 완료 후 스크롤 복구 + 언마운트
  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-paper px-6 py-6 md:px-10 md:py-8 ${
        leaving ? "loader-leaving" : ""
      }`}
      aria-hidden
    >
      {/* 상단: 브랜드 마크 */}
      <div className="flex items-center justify-between">
        <span className="font-display text-xl tracking-tight">
          Kim&nbsp;Juhee<span className="text-accent">.</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted md:text-xs">
          Graphic · Branding
        </span>
      </div>

      {/* 중앙: 카운트업 숫자 */}
      <div className="flex items-end justify-between">
        <span className="font-display text-[26vw] leading-[0.78] tabular-nums md:text-[13rem]">
          {String(count).padStart(2, "0")}
        </span>
        <span className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted md:mb-6">
          {count < 100 ? "Loading" : "Welcome"}
        </span>
      </div>

      {/* 하단: 진행 라인 */}
      <div className="mt-6 h-px w-full bg-ink/10">
        <div
          className="h-full origin-left bg-accent transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${count / 100})` }}
        />
      </div>
    </div>
  );
}
