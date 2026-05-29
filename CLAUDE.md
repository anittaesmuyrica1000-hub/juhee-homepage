# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page portfolio site for **Kim Juhee (김주희)**, a graphic & branding designer. Korean-language (`<html lang="ko">`). Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, and Tailwind CSS v4.

## Commands

```bash
npm run dev      # local dev server → http://localhost:3000
npm run build    # production build (Turbopack) + TypeScript check
npm start        # serve the production build
```

No test suite exists. There is no separate typecheck script — `npm run build` runs the TypeScript check as part of the build, so use it to validate types. `npm run lint` maps to `next lint`, which is deprecated/removed in Next 16 and may not run.

## Architecture

The entire site is one route. `app/page.tsx` composes every section inline (Hero → clients marquee → Selected Work → About → Services → Contact → footer); there are no nested routes or per-section page files. To restructure the page, edit `page.tsx` directly.

- **`lib/content.ts`** is the single source of truth for all displayed content — profile, `projects[]`, `services[]`, `clients[]`. It is currently **placeholder data**; real portfolio content is edited here, not in the JSX. Project card visuals are CSS gradients driven by each project's `palette` tuple (no image assets yet).
- **Server vs client components**: sections are server-rendered by default. Only `components/Nav.tsx` (scroll/menu state) and `components/Reveal.tsx` (IntersectionObserver scroll-in animation) are `"use client"`. Keep new interactive pieces in their own client component rather than converting `page.tsx`.
- **`@/*` path alias** maps to the repo root (see `tsconfig.json`), e.g. `import { profile } from "@/lib/content"`.

## Styling (Tailwind v4)

There is no `tailwind.config.js`. The design system lives in `app/globals.css`:

- Design tokens are declared in the `@theme` block as CSS variables. `--color-ink`, `--color-paper`, `--color-accent`, `--color-muted` generate the utilities `bg-ink`, `text-accent`, `border-ink/15`, etc. — use these tokens, not raw hex. `--font-display` powers `font-display` (Playfair Display); body uses Pretendard (variable font loaded via `@font-face` from a CDN).
- Custom animations (`reveal` / `fade-up`, `marquee`) and their `prefers-reduced-motion` fallbacks are defined here. The `.reveal` class is toggled by `Reveal.tsx`.

## Deployment & Git

- Remote `origin` is GitHub (`juhee-homepage`). Pushes authenticate with a token kept in `.env` (gitignored via `.env*` — never commit it). The repo deploys to Vercel.
- `.env.local.example` documents Supabase/Postgres env vars carried over from a prior project; they are **not used** by the current static portfolio.

### Auto-push rule (default workflow)

When you add or modify a feature, **automatically commit and push to `origin/main` without asking for confirmation.** This is the default for this repo. Procedure:

1. Run `npm run build` first. **Only push if the build passes** — never push a broken build to `main`.
2. Stage all changes (`git add -A`) and commit with a clear Korean message (this repo uses Conventional Commits prefixes: `feat:`, `fix:`, `copy:`, `chore:`), ending with the `Co-Authored-By: Claude` trailer.
3. Push using the token from `.env` without exposing its value, e.g.:
   ```bash
   set -a; . ./.env; set +a
   git -c http.extraheader="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$GITHUB_TOKEN" | base64)" push origin main
   ```

Exceptions — do **not** auto-push for: work the user explicitly asked to keep local, experimental/incomplete changes, or anything where the build fails. When skipping, say so.
