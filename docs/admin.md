# 관리자 페이지 (Admin) 구조 · 기능

포트폴리오의 **Work(프로젝트)** 콘텐츠를 브라우저에서 추가·수정·삭제·정렬하고 이미지를 업로드하는 관리자 기능 문서입니다.
데이터는 **Supabase Postgres**, 이미지는 **Supabase Storage**에 저장되며, 공개 페이지(`/`)의 Work 섹션이 이 데이터를 실시간으로 읽습니다.

---

## 1. 접근 · 인증

| 항목 | 내용 |
|------|------|
| 진입 URL | `/admin` |
| 로그인 | `/admin/login` — 비밀번호 1개 (환경변수 `ADMIN_PASSWORD`) |
| 보호 방식 | `proxy.ts`(Next 16 미들웨어)가 `/admin` 및 하위 경로를 가로채 미인증 시 `/admin/login?next=...`로 리다이렉트 |
| 세션 | 로그인 성공 시 `admin_session` **httpOnly 쿠키** 발급(7일). 값은 `HMAC-SHA256(ADMIN_PASSWORD, 고정메시지)` — 비밀번호 평문은 저장하지 않음 |
| 로그아웃 | 헤더의 "로그아웃" → 쿠키 삭제 |

> 인증 로직: `lib/auth.ts`(토큰 생성/검증, Edge·Node 공용 Web Crypto) · `lib/admin-guard.ts`(API 라우트용 `isAdmin()`/`guard()`).
> 공개 읽기는 인증이 필요 없고(공개 RLS 정책), **쓰기는 서버에서 secret 키로만** 수행됩니다.

---

## 2. 페이지 / 라우트

| 경로 | 파일 | 설명 |
|------|------|------|
| `/admin/login` | `app/admin/login/page.tsx` + `LoginForm.tsx` | 비밀번호 로그인 폼 |
| `/admin` | `app/admin/page.tsx` → `components/admin/AdminDashboard.tsx` | 프로젝트 관리 대시보드 |
| (모달) | `components/admin/ProjectEditor.tsx` | 추가/수정 시 뜨는 편집 모달 |

- `app/admin/layout.tsx`: 관리자 영역 공통 레이아웃 + `robots: noindex`(검색 비노출).
- 대시보드/공개 페이지 모두 `export const revalidate = 0`(동적 렌더)이라 편집 결과가 **새로고침 없이 즉시** 반영됩니다.

---

## 3. 기능 (대시보드)

| 기능 | 동작 | 호출 API |
|------|------|----------|
| **목록 보기** | 썸네일(이미지 없으면 그라데이션) · 제목 · 클라이언트·카테고리·연도 표시 | (서버에서 `getProjects()`) |
| **새 프로젝트** | "+ 새 프로젝트" → 빈 에디터 모달 → 저장 | `POST /api/admin/projects` |
| **수정** | 행의 "수정" → 값이 채워진 에디터 모달 → 저장 | `PUT /api/admin/projects/[id]` |
| **삭제** | 행의 "삭제" → 확인 후 제거(연결 이미지도 Storage에서 삭제) | `DELETE /api/admin/projects/[id]` |
| **순서 변경** | 행의 ▲/▼ 로 위·아래 이동(낙관적 업데이트, 실패 시 롤백) | `POST /api/admin/projects/reorder` |
| **이미지 업로드** | 에디터에서 파일 선택 → 업로드 → 미리보기, "이미지 제거"로 그라데이션 폴백 | `POST /api/admin/upload` |

### 에디터(ProjectEditor) 입력 필드
대표 이미지(업로드/교체/제거) · 제목(필수) · 클라이언트 · 카테고리 · 연도 · 슬러그(비우면 자동) · 설명 · 태그(쉼표 구분) · 폴백 그라데이션 색상 2개.

---

## 4. API 엔드포인트

모든 `/api/admin/*` 라우트는 호출 시 `guard()`로 세션을 검증하며, 실패하면 `401`을 반환합니다.

| 메서드 | 경로 | 역할 |
|--------|------|------|
| `POST` | `/api/admin/login` | 비밀번호 검증 → 세션 쿠키 발급 |
| `POST` | `/api/admin/logout` | 세션 쿠키 삭제 |
| `GET` | `/api/admin/projects` | 전체 프로젝트 조회 |
| `POST` | `/api/admin/projects` | 생성 (slug 미입력 시 자동, sort_order 맨 뒤) |
| `PUT` | `/api/admin/projects/[id]` | 부분 수정(전달된 필드만) |
| `DELETE` | `/api/admin/projects/[id]` | 삭제 + Storage 이미지 정리 |
| `POST` | `/api/admin/projects/reorder` | `{ ids: [] }` 순서대로 `sort_order` 재할당 |
| `POST` | `/api/admin/upload` | multipart 이미지 업로드(최대 8MB, 이미지 MIME만) → 공개 URL 반환 |

서버 쓰기는 `createAdminClient()`(secret 키, RLS 우회)를 사용합니다 — `lib/supabase.ts`.

---

## 5. 데이터 모델

### 테이블 `public.projects`
| 컬럼 | 타입 | 비고 |
|------|------|------|
| `id` | uuid | PK (기본값 `gen_random_uuid()`) |
| `slug` | text | unique, URL/앵커용 |
| `title` | text | 제목 (필수) |
| `client` | text | 클라이언트명 |
| `category` | text | 카테고리 (예: Brand Identity) |
| `year` | text | 연도 |
| `description` | text | 설명 |
| `tags` | text[] | 태그 목록 |
| `image_url` | text \| null | 업로드 이미지 공개 URL (없으면 그라데이션) |
| `palette` | text[] | `[시작색, 끝색]` 폴백 그라데이션 |
| `sort_order` | int | 노출 순서(오름차순) |
| `created_at` / `updated_at` | timestamptz | `updated_at`은 트리거로 자동 갱신 |

- **RLS**: `anon`/`authenticated`에 **SELECT만** 허용(`public read projects`). INSERT/UPDATE/DELETE 정책 없음 → 쓰기는 secret 키 서버 라우트로만 가능.

### Storage 버킷 `portfolio`
- `public = true`(공개 읽기). 업로드 경로: `projects/<uuid>.<ext>`.

---

## 6. 공개 페이지 연동

- `lib/projects.ts`의 `getProjects()`가 publishable 키로 `projects`를 `sort_order` 순으로 읽음.
- `app/page.tsx`의 **WORK** 섹션이 이를 받아 `components/ProjectCard.tsx`로 렌더.
- 카드 비주얼: `image_url`이 있으면 `<img>`, 없으면 `palette` 그라데이션.

---

## 7. 필요한 환경변수 (`.env`)

| 변수 | 용도 | 노출 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 공개 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 공개 읽기 키 | 공개 |
| `SUPABASE_SECRET_KEY` | 서버 쓰기/업로드(RLS 우회) | **서버 전용, 비공개** |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 | **비공개** |

> ⚠️ `SUPABASE_SECRET_KEY`가 비어있거나 잘못되면 저장/업로드 시 "Invalid API key" 에러가 모달에 표시됩니다(읽기/로그인은 정상 동작).
> Vercel 배포 시 위 4개 변수를 프로젝트 환경변수에 동일하게 등록해야 합니다.
