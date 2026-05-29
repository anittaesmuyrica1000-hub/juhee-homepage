import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let _publicClient: SupabaseClient | null = null;

/**
 * 공개 읽기 전용 클라이언트 (publishable/anon 키).
 * 지연 생성 — 환경변수가 없으면 import 시점이 아니라 호출 시점에만 에러가 나도록.
 * (빌드의 page-data 수집 단계에서 모듈이 import 되어도 크래시하지 않게 함)
 */
export function getPublicClient(): SupabaseClient {
  if (!url || !publishableKey) {
    throw new Error(
      "Supabase 공개 환경변수(NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)가 설정되지 않았습니다."
    );
  }
  if (!_publicClient) {
    _publicClient = createClient(url, publishableKey, {
      auth: { persistSession: false },
    });
  }
  return _publicClient;
}

/**
 * 서버 전용 관리자 클라이언트 (secret 키, RLS 우회).
 * API 라우트에서만 호출하세요. 클라이언트 번들에 절대 포함되면 안 됩니다.
 */
export function createAdminClient(): SupabaseClient {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error(
      "Supabase 환경변수가 없습니다. NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SECRET_KEY 를 설정하세요."
    );
  }
  return createClient(url, secret, { auth: { persistSession: false } });
}

export const BUCKET = "portfolio";
