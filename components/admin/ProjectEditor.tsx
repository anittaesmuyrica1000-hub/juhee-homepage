"use client";

import { useRef, useState } from "react";
import type { Project } from "@/lib/types";

export type EditorValue = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  image_url: string | null;
  palette: string[];
};

const FALLBACK_PALETTE = ["#ddd8cf", "#2b2b2b"];

export default function ProjectEditor({
  project,
  onSave,
  onCancel,
}: {
  project: Project | null;
  onSave: (value: EditorValue) => Promise<void>;
  onCancel: () => void;
}) {
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [title, setTitle] = useState(project?.title ?? "");
  const [client, setClient] = useState(project?.client ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [year, setYear] = useState(project?.year ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [tagsText, setTagsText] = useState((project?.tags ?? []).join(", "));
  const [imageUrl, setImageUrl] = useState<string | null>(project?.image_url ?? null);
  const [palette, setPalette] = useState<string[]>(
    project?.palette?.length ? project.palette : FALLBACK_PALETTE
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "업로드 실패");
      setImageUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        slug: slug.trim(),
        title: title.trim(),
        client: client.trim(),
        category: category.trim(),
        year: year.trim(),
        description: description.trim(),
        tags: tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image_url: imageUrl,
        palette,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSaving(false);
    }
  }

  const field =
    "mt-1.5 w-full rounded-lg border border-ink/20 bg-paper px-3 py-2 outline-none focus:border-accent";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="my-8 w-full max-w-2xl rounded-2xl bg-paper p-6 shadow-2xl md:p-8"
      >
        <h2 className="font-display text-2xl tracking-tight">
          {project ? "프로젝트 수정" : "새 프로젝트"}
        </h2>

        {/* 이미지 업로드 */}
        <div className="mt-6">
          <span className="text-sm font-medium">대표 이미지</span>
          <div className="mt-2 flex items-center gap-4">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-ink/5"
              style={
                imageUrl
                  ? undefined
                  : { background: `linear-gradient(150deg, ${palette[0]}, ${palette[1]})` }
              }
            >
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="space-y-2 text-sm">
              {/* ref + button 방식: label/display:none 보다 모든 브라우저에서 확실히 picker 가 열림 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                  e.target.value = ""; // 같은 파일 재선택 가능하도록 초기화
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-block rounded-full border border-ink/20 px-4 py-2 hover:bg-ink hover:text-paper disabled:opacity-40"
              >
                {uploading ? "업로드 중…" : imageUrl ? "이미지 교체" : "이미지 업로드"}
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="block text-accent hover:underline"
                >
                  이미지 제거 (그라데이션 사용)
                </button>
              )}
              <p className="text-xs text-muted">
                이미지가 없으면 아래 팔레트 그라데이션이 표시됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 텍스트 필드 */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            제목 *
            <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="block text-sm">
            클라이언트
            <input className={field} value={client} onChange={(e) => setClient(e.target.value)} />
          </label>
          <label className="block text-sm">
            카테고리
            <input className={field} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Brand Identity" />
          </label>
          <label className="block text-sm">
            연도
            <input className={field} value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
          </label>
          <label className="block text-sm">
            슬러그 (URL용, 비우면 자동)
            <input className={field} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="maru" />
          </label>
          <label className="block text-sm sm:col-span-2">
            설명
            <textarea className={`${field} min-h-24`} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="block text-sm sm:col-span-2">
            태그 (쉼표로 구분)
            <input className={field} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="로고, 아이덴티티, 패키지" />
          </label>
        </div>

        {/* 팔레트 (이미지 없을 때 폴백) */}
        <div className="mt-4">
          <span className="text-sm font-medium">폴백 그라데이션 색상</span>
          <div className="mt-2 flex gap-3">
            {[0, 1].map((idx) => (
              <input
                key={idx}
                type="color"
                value={palette[idx] ?? FALLBACK_PALETTE[idx]}
                onChange={(e) => {
                  const next = [...palette];
                  next[idx] = e.target.value;
                  setPalette(next);
                }}
                className="h-10 w-16 cursor-pointer rounded border border-ink/20 bg-paper"
                aria-label={idx === 0 ? "시작 색" : "끝 색"}
              />
            ))}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-accent">{error}</p>}

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-2.5 text-sm text-ink/70 hover:text-ink"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-ink px-6 py-2.5 text-sm text-paper disabled:opacity-40"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
