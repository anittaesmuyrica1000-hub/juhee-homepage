import type { Project } from "@/lib/types";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [from, to] = project.palette.length >= 2 ? project.palette : ["#ddd8cf", "#2b2b2b"];
  const hasImage = Boolean(project.image_url);

  return (
    <a
      href={`#${project.slug}`}
      className="group block"
      aria-label={`${project.title} 프로젝트 보기`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink/5">
        {hasImage ? (
          // 업로드된 실제 이미지
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url as string}
            alt={`${project.title} 대표 이미지`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          // 이미지가 없으면 팔레트 그라데이션 폴백
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)`,
            }}
          />
        )}

        {/* 카테고리 / 클라이언트 오버레이 */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 mix-blend-difference">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/80">
            {project.category}
          </span>
          <span className="font-display text-3xl leading-none text-white md:text-4xl">
            {project.client}
          </span>
        </div>
        <span className="absolute right-5 top-5 text-xs font-medium text-white/70 mix-blend-difference">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-medium tracking-tight">{project.title}</h3>
        <span className="shrink-0 text-sm text-muted">{project.year}</span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <li
            key={t}
            className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/70"
          >
            {t}
          </li>
        ))}
      </ul>
    </a>
  );
}
