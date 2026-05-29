import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { getProjectBySlug, getProjects } from "@/lib/projects";

export const revalidate = 0;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "프로젝트를 찾을 수 없음" };
  return {
    title: project.title,
    description: project.description || undefined,
    openGraph: {
      title: project.title,
      description: project.description || undefined,
      images: project.image_url ? [project.image_url] : undefined,
    },
  };
}

export default async function WorkDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [from, to] =
    project.palette.length >= 2 ? project.palette : ["#ddd8cf", "#2b2b2b"];
  const paragraphs = project.body
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Nav />
      <main className="px-6 pt-28 pb-24 md:px-10 md:pt-36">
        <article className="mx-auto max-w-5xl">
          {/* 뒤로 */}
          <Reveal>
            <Link
              href="/#work"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              모든 작업
            </Link>
          </Reveal>

          {/* 헤더 */}
          <Reveal delay={80}>
            <header className="mt-8 border-b border-ink/10 pb-10">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                {project.category || "Project"}
              </p>
              <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
                {project.title}
              </h1>
              {project.description && (
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
                  {project.description}
                </p>
              )}
              <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 text-sm">
                {project.client && (
                  <div>
                    <dt className="text-muted">클라이언트</dt>
                    <dd className="mt-1 font-medium">{project.client}</dd>
                  </div>
                )}
                {project.year && (
                  <div>
                    <dt className="text-muted">연도</dt>
                    <dd className="mt-1 font-medium">{project.year}</dd>
                  </div>
                )}
                {project.tags.length > 0 && (
                  <div>
                    <dt className="text-muted">작업</dt>
                    <dd className="mt-1 font-medium">{project.tags.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </header>
          </Reveal>

          {/* 대표 이미지 */}
          <Reveal delay={120}>
            <div className="mt-10 overflow-hidden rounded-xl bg-ink/5">
              {project.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_url}
                  alt={`${project.title} 대표 이미지`}
                  className="w-full object-cover"
                />
              ) : (
                <div
                  className="aspect-[16/10] w-full"
                  style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}
                />
              )}
            </div>
          </Reveal>

          {/* 본문 */}
          {paragraphs.length > 0 && (
            <Reveal delay={80}>
              <div className="mx-auto mt-16 max-w-2xl space-y-6 text-lg leading-relaxed text-ink/80">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          )}

          {/* 갤러리 */}
          {project.gallery.length > 0 && (
            <div className="mt-16 space-y-8">
              {project.gallery.map((src, i) => (
                <Reveal key={src + i} delay={(i % 2) * 100}>
                  <div className="overflow-hidden rounded-xl bg-ink/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${project.title} 이미지 ${i + 1}`}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/* 하단 내비 */}
          <div className="mt-20 border-t border-ink/10 pt-10">
            <Link
              href="/#work"
              className="font-display text-2xl tracking-tight transition-colors hover:text-accent md:text-3xl"
            >
              ← 다른 작업 보기
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

// 알려진 slug 들을 미리 생성(빌드 시 비어있으면 런타임 처리)
export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}
