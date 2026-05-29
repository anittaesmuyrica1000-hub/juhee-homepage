# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page portfolio site for **Kim Juhee (김주희)**, a graphic & branding designer. Korean-language (`<html lang="ko">`). Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, and Tailwind CSS v4. The public page is one scroll route; **Work projects are managed via a password-protected admin (`/admin`) backed by Supabase** (Postgres + Storage). See `docs/structure.md` (public sections) and `docs/admin.md` (admin internals).

## Commands

```bash
npm run dev      # local dev server → http://localhost:3000
npm run build    # production build (Turbopack) + TypeScript check
npm start        # serve the production build
```

No test suite exists. There is no separate typecheck script — `npm run build` runs the TypeScript check as part of the build, so use it to validate types. `npm run lint` maps to `next lint`, which is deprecated/removed in Next 16 and may not run.

## Architecture

The public page is one route. `app/page.tsx` composes every section inline (Hero → clients marquee → Selected Work → About → Services → Contact → footer). To restructure the page, edit `page.tsx` directly.

- **Two content sources.** Static copy (profile, `services[]`, `clients[]`) lives in **`lib/content.ts`** and is edited in code. **Work projects are dynamic**, stored in Supabase and edited through the admin — never hardcode projects in `content.ts` again. `app/page.tsx` is an async server component that calls `getProjects()` (`lib/projects.ts`); it sets `revalidate = 0` so admin edits show immediately.
- **Supabase layer** (`lib/supabase.ts`): `supabasePublic` (publishable key, read-only, used by the public page) vs `createAdminClient()` (secret key, RLS-bypassing, **server-only** — used only inside `/api/admin/*` routes). Types in `lib/types.ts`. A project's card shows its uploaded `image_url`, falling back to a `palette` gradient.
- **Admin** lives under `app/admin/*` + `app/api/admin/*`, gated by `proxy.ts` (Next 16's renamed middleware — the file MUST be `proxy.ts` with an exported `proxy` function, not `middleware`). Auth is a single `ADMIN_PASSWORD` → HMAC session cookie (`lib/auth.ts` for edge+node, `lib/admin-guard.ts` for route handlers). Full details in `docs/admin.md`.
- **Server vs client components**: sections are server-rendered by default. `components/Nav.tsx`, `components/Reveal.tsx`, and everything under `components/admin/` are `"use client"`. Keep new interactive pieces in their own client component rather than converting `page.tsx`.
- **`@/*` path alias** maps to the repo root (see `tsconfig.json`), e.g. `import { getProjects } from "@/lib/projects"`.

## Styling (Tailwind v4)

There is no `tailwind.config.js`. The design system lives in `app/globals.css`:

- Design tokens are declared in the `@theme` block as CSS variables. `--color-ink`, `--color-paper`, `--color-accent`, `--color-muted` generate the utilities `bg-ink`, `text-accent`, `border-ink/15`, etc. — use these tokens, not raw hex. `--font-display` powers `font-display` (Playfair Display); body uses Pretendard (variable font loaded via `@font-face` from a CDN).
- Custom animations (`reveal` / `fade-up`, `marquee`) and their `prefers-reduced-motion` fallbacks are defined here. The `.reveal` class is toggled by `Reveal.tsx`.

## Deployment & Git

- Remote `origin` is GitHub (`juhee-homepage`). Pushes authenticate with a token kept in `.env` (gitignored via `.env*` — never commit it). The repo deploys to Vercel.
- **Required env vars** (`.env` locally, Vercel project settings in prod): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (public read), `SUPABASE_SECRET_KEY` (server-only writes/uploads), `ADMIN_PASSWORD` (admin login). See `.env.local.example`. If `SUPABASE_SECRET_KEY` is missing/invalid, reads and login still work but admin saves/uploads fail with "Invalid API key".

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
