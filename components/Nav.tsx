"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-paper/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="font-display text-xl tracking-tight md:text-2xl"
        >
          Kim&nbsp;Juhee<span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-9 text-sm md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative tracking-wide text-ink/70 transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="rounded-full bg-ink px-5 py-2 text-paper transition-transform hover:-translate-y-0.5"
            >
              작업 의뢰
            </a>
          </li>
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="메뉴 열기"
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 bg-ink transition-transform ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-ink transition-transform ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-paper md:hidden">
          <ul className="flex flex-col px-6 py-4">
            {[...LINKS, { href: "#contact", label: "작업 의뢰" }].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-lg"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
