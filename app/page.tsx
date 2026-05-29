import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { profile, services, clients } from "@/lib/content";
import { getProjects } from "@/lib/projects";

// 관리자 편집이 즉시 반영되도록 매 요청 시 최신 데이터를 읽습니다.
export const revalidate = 0;

export default async function Home() {
  const projects = await getProjects();
  return (
    <>
      <Nav />
      <main id="top">
        {/* ───────────────── HERO (Spline 3D) ───────────────── */}
        <Hero />

        {/* ───────────────── MARQUEE ───────────────── */}
        <section className="overflow-hidden border-y border-ink/10 py-5">
          <div className="flex w-max marquee-track">
            {[0, 1].map((dup) => (
              <ul
                key={dup}
                className="flex items-center gap-10 pr-10"
                aria-hidden={dup === 1}
              >
                {clients.map((c) => (
                  <li
                    key={`${dup}-${c}`}
                    className="flex items-center gap-10 font-display text-2xl text-ink/45 md:text-3xl"
                  >
                    {c}
                    <span className="text-secondary">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        {/* ───────────────── WORK ───────────────── */}
        <section id="work" className="px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading className="mb-14" meta="2022 — 2025 · 선별 프로젝트">
                Selected Work
              </SectionHeading>
            </Reveal>

            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 120}>
                  <ProjectCard project={p} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────── ABOUT ───────────────── */}
        <section id="about" className="bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <Eyebrow className="text-paper/50">About</Eyebrow>
              <p className="mt-6 font-display text-3xl leading-tight md:text-4xl">
                {profile.name}
                <span className="block text-paper/40">{profile.nameEn}</span>
              </p>
            </Reveal>

            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={120}>
                <p className="font-display text-2xl leading-snug md:text-[2rem]">
                  좋은 디자인은 설명이 필요 없습니다. 보는 순간 브랜드의 온도가
                  전해지도록, 군더더기를 덜어내는 일에 집중합니다.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-12 grid gap-10 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-paper/50">접근</h3>
                    <p className="mt-3 leading-relaxed text-paper/80">
                      리서치에서 시작해 콘셉트를 한 문장으로 정의하고, 그 문장이
                      모든 시각 결정의 기준이 되도록 시스템을 설계합니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-paper/50">경험</h3>
                    <p className="mt-3 leading-relaxed text-paper/80">
                      8년간 스튜디오와 인하우스를 오가며 식음료, 뷰티, 문화
                      브랜드의 아이덴티티와 패키지를 만들어 왔습니다.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────────────── SERVICES ───────────────── */}
        <section id="services" className="px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading className="mb-14">What I Do</SectionHeading>
            </Reveal>
            <div className="border-t border-ink/15">
              {services.map((s, i) => (
                <Reveal key={s.no} delay={i * 80}>
                  <div className="group grid grid-cols-1 items-baseline gap-4 border-b border-ink/15 py-8 transition-colors hover:bg-ink/[0.03] md:grid-cols-[auto_1fr_2fr] md:gap-10 md:px-4">
                    <span className="font-mono text-sm text-secondary">{s.no}</span>
                    <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                      {s.title}
                    </h3>
                    <p className="leading-relaxed text-muted md:text-right md:text-ink/70">
                      {s.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────── CONTACT ───────────────── */}
        <section
          id="contact"
          className="px-6 py-24 md:px-10 md:py-40"
        >
          <div className="mx-auto max-w-7xl text-center">
            <Reveal>
              <Eyebrow tone="primary" className="justify-center">
                Let’s work together
              </Eyebrow>
            </Reveal>
            <Reveal delay={120}>
              <a
                href={`mailto:${profile.email}`}
                className="mt-8 block font-display text-[12vw] leading-none tracking-tight transition-colors hover:text-accent md:text-[6rem]"
              >
                새 프로젝트를
                <br />
                <span className="italic">시작할까요?</span>
              </a>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-lg underline decoration-accent decoration-2 underline-offset-8"
                >
                  {profile.email}
                </a>
                <span className="text-muted">{profile.location}</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────────────── FOOTER ───────────────── */}
        <footer className="border-t border-ink/10 px-6 py-10 md:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-sm text-muted md:flex-row">
            <p>
              © {new Date().getFullYear()} {profile.nameEn}. All rights reserved.
            </p>
            <ul className="flex gap-6">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </main>
    </>
  );
}
