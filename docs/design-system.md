# 디자인 시스템 (Design System)

Kim Juhee 포트폴리오의 디자인 토큰과 재사용 UI 컴포넌트 문서입니다.
토큰은 `app/globals.css` 의 `@theme` 에, 컴포넌트는 `components/ui/` 에 있습니다.

---

## 1. 컬러 토큰

`@theme` 의 CSS 변수로 정의되며, Tailwind 유틸리티(`bg-*`, `text-*`, `border-*`)로 자동 생성됩니다.

| 토큰 | 값 | 의미 | 대표 유틸리티 |
|------|-----|------|----------------|
| `--color-primary` | `#f15a24` (orange) | **주 강조색** — CTA, 강조 포인트 | `bg-primary`, `text-primary` |
| `--color-primary-strong` | `#d6471a` | primary hover/press | `hover:bg-[var(--color-primary-strong)]` |
| `--color-secondary` | `#1f9d55` (green) | **보조 강조색** — 보조 액션·포인트 | `bg-secondary`, `text-secondary` |
| `--color-secondary-strong` | `#178047` | secondary hover/press | — |
| `--color-ink` | `#0a0a0a` | 본문 텍스트/다크 배경 | `text-ink`, `bg-ink` |
| `--color-paper` | `#ffffff` | 기본 배경 | `bg-paper`, `text-paper` |
| `--color-muted` | `#8a8a8a` | 보조 텍스트 | `text-muted` |
| `--color-accent` | `#f15a24` | **primary 의 별칭** (레거시 `text-accent`/`bg-accent` 호환) | `text-accent` |

> 색을 바꾸려면 `@theme` 의 변수 한 곳만 수정하면 전체에 반영됩니다. raw hex 대신 항상 토큰을 사용하세요.
> `accent` 는 과거 코드 호환용 별칭이며 새 코드는 `primary` 를 사용합니다.

### 사용 예
- **primary(orange)**: 내비 "작업 의뢰" 버튼, 히어로 강조어("번역"), Contact 강조, 진행 라인
- **secondary(green)**: 클라이언트 마퀴 구분자(✦), Services 번호(01–04)

---

## 2. 타이포그래피

| 토큰 | 폰트 |
|------|------|
| `--font-sans` (본문) | Roboto → Pretendard(한글) → system |
| `--font-display` (제목) | Roboto 헤비 → Pretendard |

- `.font-display` 클래스는 `font-weight: 800` + 타이트한 트래킹(`-0.025em`)을 적용합니다.
- 영문은 Roboto, 한글은 Pretendard(가변 폰트, CDN) 로 렌더됩니다.

---

## 3. 재사용 UI 컴포넌트 (`components/ui/`)

모두 토큰 기반이라 색·폰트를 바꾸면 일관되게 따라옵니다. `@/components/ui` 배럴로 import.

### `Button`
```tsx
import { Button } from "@/components/ui";
<Button variant="primary" size="md">작업 의뢰</Button>
<Button href="/#contact" variant="secondary">문의</Button>   // href 있으면 <Link>
```
- `variant`: `primary`(orange) · `secondary`(green) · `outline` · `ghost`
- `size`: `sm` · `md` · `lg`
- `href` 가 있으면 `next/link`, 없으면 `<button>` 으로 렌더 (동일 스타일 재사용)

### `Tag`
```tsx
<Tag>로고</Tag>                 // outline(기본)
<Tag tone="primary">신규</Tag>  // primary · secondary · solid
```

### `Eyebrow`
섹션 상단 소형 라벨(모노스페이스, 트래킹).
```tsx
<Eyebrow line tone="primary">그래픽 · 브랜딩 디자이너</Eyebrow>
```
- `tone`: `muted`(기본) · `primary` · `secondary`
- `line`: 앞에 강조선 표시

### `SectionHeading`
```tsx
<SectionHeading meta="2022 — 2025">Selected Work</SectionHeading>
```
좌측 대제목(`font-display`) + 우측 보조 텍스트.

### `Container`
```tsx
<Container>…</Container>              // max-w-7xl + 공통 패딩
<Container size="narrow">…</Container> // max-w-3xl
```

### `cn(...)`
falsy 를 제거하고 className 을 합치는 유틸. 모든 ui 컴포넌트가 `className` prop 으로 확장 가능합니다.

---

## 4. 모션
- `.reveal` — 스크롤 진입 페이드업 (`components/Reveal.tsx` 가 토글)
- `.marquee-track` — 클라이언트 로고 무한 슬라이드
- 인트로 로더 슬라이드업(`.loader-leaving`)
- 모두 `prefers-reduced-motion: reduce` 폴백 제공

---

## 5. 원칙
- **토큰 우선**: 색/폰트는 raw 값 대신 토큰 사용 → 한 곳 수정으로 전체 반영
- **컴포넌트 재사용**: 반복되는 버튼·태그·헤딩·라벨은 `components/ui` 의 컴포넌트로
- **확장 가능**: 모든 ui 컴포넌트는 `className` 으로 케이스별 오버라이드 허용
