import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * 공개 읽기 전용 클라이언트 (publishable/anon 키).
 * RLS 의 "public read" 정책으로 projects 를 SELECT 만 할 수 있습니다.
 */
export const supabasePublic = createClient(url ?? "", publishableKey ?? "", {
  auth: { persistSession: false },
});

/**
 * 서버 전용 관리자 클라이언트 (secret 키, RLS 우회).
 * API 라우트에서만 호출하세요. 클라이언트 번들에 절대 포함되면 안 됩니다.
 */
export function createAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error(
      "Supabase 환경변수가 없습니다. NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SECRET_KEY 를 .env 에 설정하세요."
    );
  }
  return createClient(url, secret, { auth: { persistSession: false } });
}

export const BUCKET = "portfolio";
