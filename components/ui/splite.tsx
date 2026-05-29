"use client";

import dynamic from "next/dynamic";

// Spline 은 브라우저 전용(런타임이 window 사용)이라 SSR 비활성화 + 클라이언트에서만 로드
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="loader" />
    </div>
  ),
});

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return <Spline scene={scene} className={className} />;
}
