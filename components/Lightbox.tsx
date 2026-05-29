"use client";

import { useEffect } from "react";
import type { Project } from "@/lib/types";

export default function Lightbox({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  // ESC 닫기 + 열려있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  const [from, to] = project.palette.length >= 2 ? project.palette : ["#ddd8cf", "#2b2b2b"];

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} 전체 이미지`}
    >
      {/* 상단 바: 제목 + 닫기 */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-5 text-paper md:px-10">
        <div className="min-w-0">
          <p className="truncate font-display text-lg tracking-tight md:text-2xl">
            {project.title}
          </p>
          <p className="truncate font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
            {[project.client, project.category, project.year].filter(Boolean).join(" · ")}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/30 text-xl text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          ✕
        </button>
      </div>

      {/* 전체 이미지 (object-contain → 잘리지 않고 전체 표시) */}
      <div
        className="flex min-h-0 flex-1 items-center justify-center px-4 pb-8 md:px-10"
        onClick={onClose}
      >
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={`${project.title} 전체 이미지`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          // 이미지가 없는 프로젝트는 팔레트 + 설명을 크게 표시
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex aspect-[4/3] w-full max-w-3xl flex-col justify-end rounded-xl p-8 text-paper"
            style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }}
          >
            <span className="font-display text-4xl mix-blend-difference md:text-6xl">
              {project.client || project.title}
            </span>
            {project.description && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/90 mix-blend-difference">
                {project.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
