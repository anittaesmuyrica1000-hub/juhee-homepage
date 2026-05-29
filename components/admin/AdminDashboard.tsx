"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/lib/types";
import ProjectEditor, { type EditorValue } from "./ProjectEditor";

export default function AdminDashboard({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function save(value: EditorValue, id?: string) {
    setError("");
    const res = await fetch(
      id ? `/api/admin/projects/${id}` : "/api/admin/projects",
      {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "저장에 실패했습니다.");
    }
    const saved = data.project as Project;
    setProjects((prev) =>
      id ? prev.map((p) => (p.id === id ? saved : p)) : [...prev, saved]
    );
    setEditing(null);
    router.refresh();
  }

  async function remove(p: Project) {
    if (!confirm(`"${p.title}" 프로젝트를 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setBusyId(p.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "삭제에 실패했습니다.");
      }
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyId(null);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= projects.length) return;
    const reordered = [...projects];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    setProjects(reordered);
    setError("");
    try {
      const res = await fetch("/api/admin/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error("순서 저장에 실패했습니다.");
      router.refresh();
    } catch (e) {
      setProjects(projects); // 롤백
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-paper/90 px-6 py-4 backdrop-blur md:px-10">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl tracking-tight">
            Kim Juhee<span className="text-accent">.</span>
          </span>
          <span className="text-sm text-muted">관리자</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="/" target="_blank" className="text-ink/70 hover:text-ink">
            사이트 보기 ↗
          </a>
          <button onClick={logout} className="text-ink/70 hover:text-ink">
            로그아웃
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-tight md:text-4xl">
              프로젝트 관리
            </h1>
            <p className="mt-1 text-sm text-muted">
              총 {projects.length}개 · 순서·내용·이미지를 편집하면 공개 페이지에 바로 반영됩니다.
            </p>
          </div>
          <button
            onClick={() => setEditing("new")}
            className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-transform hover:-translate-y-0.5"
          >
            + 새 프로젝트
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-accent/10 px-4 py-3 text-sm text-accent">
            {error}
          </p>
        )}

        <ul className="mt-8 space-y-3">
          {projects.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white/40 p-3"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="px-1 text-ink/50 hover:text-ink disabled:opacity-20"
                  aria-label="위로"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === projects.length - 1}
                  className="px-1 text-ink/50 hover:text-ink disabled:opacity-20"
                  aria-label="아래로"
                >
                  ▼
                </button>
              </div>

              <div
                className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink/5"
                style={
                  p.image_url
                    ? undefined
                    : {
                        background: `linear-gradient(150deg, ${
                          p.palette[0] ?? "#ddd8cf"
                        }, ${p.palette[1] ?? "#2b2b2b"})`,
                      }
                }
              >
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.title}</p>
                <p className="truncate text-sm text-muted">
                  {p.client} · {p.category} · {p.year}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-sm">
                <button
                  onClick={() => setEditing(p)}
                  className="rounded-full border border-ink/20 px-4 py-1.5 hover:bg-ink hover:text-paper"
                >
                  수정
                </button>
                <button
                  onClick={() => remove(p)}
                  disabled={busyId === p.id}
                  className="rounded-full px-3 py-1.5 text-accent hover:bg-accent/10 disabled:opacity-40"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
          {projects.length === 0 && (
            <li className="rounded-xl border border-dashed border-ink/20 p-10 text-center text-muted">
              아직 프로젝트가 없습니다. “새 프로젝트”로 추가하세요.
            </li>
          )}
        </ul>
      </main>

      {editing && (
        <ProjectEditor
          project={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={(value) =>
            save(value, editing === "new" ? undefined : editing.id)
          }
        />
      )}
    </>
  );
}
