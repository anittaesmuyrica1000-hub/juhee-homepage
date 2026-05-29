# 사이트 구조 (Structure)

Kim Juhee 그래픽·브랜딩 디자이너 포트폴리오의 페이지·섹션 구조 문서입니다.
실제 코드(`app/page.tsx`)의 섹션 구분 주석, `id` 앵커, 헤딩 텍스트를 기준으로 작성했습니다.

> 본 사이트는 **단일 페이지(One-page) 스크롤형** 구조입니다. 모든 콘텐츠가 `/` 한 라우트 안에 섹션으로 구성되며, 내비게이션은 페이지 이동이 아니라 **앵커(#) 스크롤**로 동작합니다.

---

## 페이지 리스트

| # | 경로 | 파일 | 설명 |
|---|------|------|------|
| 1 | `/` | `app/page.tsx` | 홈 — 포트폴리오 전체(원페이지) |
| — | `/_not-found` | (Next.js 기본) | 404 페이지 (자동 생성, 커스텀 없음) |

> 라우트는 `/` 단 하나입니다. `app/icon.svg`는 페이지가 아니라 파비콘(브라우저 탭 아이콘)으로 자동 제공됩니다.
> 메타데이터(title/OG 등)는 `app/layout.tsx`에서 전역 설정됩니다.

---

## `/` (홈) — 섹션 구성

`app/page.tsx` 안에서 위→아래 순서로 배치된 섹션입니다.
"섹션 이름"은 코드의 구분 주석(`{/* ─── HERO ─── */}`) 라벨을 그대로 사용했습니다.

| 순서 | 섹션 이름 | `id` 앵커 | 헤딩 / 핵심 카피 | 구성 요소 |
|------|-----------|-----------|------------------|-----------|
| 1 | **HERO** | `#top` (※`<main>`에 부여) | `브랜드의 본질을 / 시각 언어로 번역합니다.` | 역할 eyebrow(`그래픽 · 브랜딩 디자이너`), 대형 타이틀, 소개 문단, `작업 보기` 스크롤 CTA |
| 2 | **MARQUEE** | — (앵커 없음) | (헤딩 없음) | 클라이언트 로고 텍스트가 무한 흐르는 가로 마퀴 (`clients[]`) |
| 3 | **WORK** | `#work` | `Selected Work` | 프로젝트 카드 그리드 (`projects[]` → `ProjectCard`), 부제 `2022 — 2025 · 선별 프로젝트` |
| 4 | **ABOUT** | `#about` | `About` (eyebrow) + `김주희 / Kim Juhee` | 디자인 철학 문장, `접근`·`경험` 2단 설명 (다크 배경 섹션) |
| 5 | **SERVICES** | `#services` | `What I Do` | 서비스 목록 (`services[]`, `01`~`04`: 브랜드 아이덴티티 / 패키지 디자인 / 편집·타이포그래피 / 아트 디렉션) |
| 6 | **CONTACT** | `#contact` | `새 프로젝트를 시작할까요?` | 이메일 mailto 링크, 위치(`Seoul, KR`), `Let's work together` eyebrow |
| 7 | **FOOTER** | — (앵커 없음) | (헤딩 없음) | 저작권 표기, 소셜 링크(`socials[]`: Instagram / Behance / LinkedIn) |

### 내비게이션 ↔ 섹션 매핑 (`components/Nav.tsx`)

| 내비 메뉴 | 이동 대상 앵커 | 대상 섹션 |
|-----------|----------------|-----------|
| 로고 `Kim Juhee.` | `#top` | HERO (맨 위) |
| `Work` | `#work` | WORK |
| `About` | `#about` | ABOUT |
| `Services` | `#services` | SERVICES |
| `Contact` | `#contact` | CONTACT |
| `작업 의뢰` (버튼) | `#contact` | CONTACT |

---

## 콘텐츠 출처

화면에 표시되는 거의 모든 텍스트·데이터는 **`lib/content.ts`** 한 곳에서 관리됩니다.
JSX를 수정하지 않고 이 파일만 편집하면 내용이 바뀝니다.

| 데이터 | 사용 섹션 |
|--------|-----------|
| `profile` (이름·역할·태그라인·소개·이메일·위치·소셜) | HERO, ABOUT, CONTACT, FOOTER |
| `projects[]` (프로젝트 6건: 제목·클라이언트·카테고리·연도·태그·팔레트) | WORK |
| `services[]` (서비스 4건) | SERVICES |
| `clients[]` (클라이언트명 8건) | MARQUEE |

> 현재 콘텐츠는 **플레이스홀더**입니다. 프로젝트 카드의 비주얼은 실제 이미지가 아니라 각 프로젝트의 `palette` 값으로 만든 CSS 그라데이션입니다.

---

## 컴포넌트 구조

| 컴포넌트 | 역할 | 렌더링 |
|----------|------|--------|
| `app/page.tsx` | 모든 섹션을 순서대로 조합하는 단일 페이지 | 서버 |
| `app/layout.tsx` | 전역 레이아웃·폰트(Playfair Display)·메타데이터 | 서버 |
| `components/Nav.tsx` | 상단 고정 내비게이션 (스크롤 시 배경, 모바일 메뉴 토글) | 클라이언트 |
| `components/ProjectCard.tsx` | WORK 섹션의 개별 프로젝트 카드 | 서버 |
| `components/Reveal.tsx` | 스크롤 진입 시 페이드업 애니메이션 래퍼 (IntersectionObserver) | 클라이언트 |
