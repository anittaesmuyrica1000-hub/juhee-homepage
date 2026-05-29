"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import Lightbox from "./Lightbox";

export default function WorkGallery({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 120}>
            <ProjectCard project={p} index={i} onOpen={setSelected} />
          </Reveal>
        ))}
      </div>

      <Lightbox project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
