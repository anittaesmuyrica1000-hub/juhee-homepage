"use client";

import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { profile } from "@/lib/content";

export default function Hero() {
  return (
    <section className="px-6 pt-24 pb-12 md:px-10 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <Card className="relative min-h-[640px] w-full overflow-hidden border-ink/10 bg-ink md:h-[680px]">
          {/* 스포트라이트 (orange glow) */}
          <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#f15a24" />

          <div className="flex h-full flex-col md:flex-row">
            {/* 좌측: 카피 */}
            <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-12 lg:p-16">
              <Eyebrow line tone="primary">
                {profile.role}
              </Eyebrow>

              <h1 className="mt-6 break-keep font-display text-5xl leading-[0.95] tracking-tight text-paper sm:text-6xl lg:text-7xl">
                <span className="block bg-gradient-to-b from-white to-white/55 bg-clip-text text-transparent">
                  브랜드의 본질을
                </span>
                <span className="block bg-gradient-to-b from-white to-white/55 bg-clip-text text-transparent">
                  시각 언어로{" "}
                  <span className="bg-none text-primary [-webkit-text-fill-color:var(--color-primary)]">
                    번역
                  </span>
                  합니다.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-paper/70">
                {profile.intro}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/#work" variant="primary">
                  작업 보기
                </Button>
                <Button
                  href="/#contact"
                  variant="outline"
                  className="border-paper/30 text-paper hover:bg-paper hover:text-ink"
                >
                  작업 의뢰
                </Button>
              </div>
            </div>

            {/* 우측: 3D Spline 씬 */}
            <div className="relative min-h-[280px] flex-1">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="h-full w-full"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
