import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "./auth";

/** 현재 요청이 인증된 관리자인지 (API 라우트 전용) */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(COOKIE_NAME)?.value);
}

/** 인증 실패 시 401 응답을, 통과 시 null 을 반환 */
export async function guard(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
}
