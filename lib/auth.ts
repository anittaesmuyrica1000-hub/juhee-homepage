// 간단 비밀번호 기반 관리자 세션.
// 세션 쿠키 값 = HMAC-SHA256(ADMIN_PASSWORD, 고정 메시지).
// 비밀번호를 모르면 위조 불가하며, 쿠키에 비밀번호 평문을 담지 않습니다.
// Web Crypto 만 사용하므로 Edge 미들웨어와 Node 라우트 양쪽에서 동작합니다.

export const COOKIE_NAME = "admin_session";
const SESSION_MSG = "juhee-admin-session-v1";

async function hmacHex(key: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** 로그인 성공 시 쿠키에 저장할 세션 토큰 */
export async function createSessionToken(): Promise<string> {
  const pw = process.env.ADMIN_PASSWORD ?? "";
  if (!pw) return "";
  return hmacHex(pw, SESSION_MSG);
}

/** 쿠키 토큰이 유효한지 검증 */
export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await createSessionToken();
  return expected.length > 0 && token.length === expected.length && token === expected;
}

/** 입력 비밀번호가 ADMIN_PASSWORD 와 일치하는지 */
export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD ?? "";
  return pw.length > 0 && input === pw;
}
