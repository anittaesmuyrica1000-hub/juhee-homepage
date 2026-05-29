import { NextResponse } from "next/server";
import { guard } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase";

// body: { ids: string[] } — 배열 순서대로 sort_order(1..N) 재할당
export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const ids: string[] = Array.isArray(body?.ids) ? body.ids.map(String) : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "ids 가 필요합니다." }, { status: 400 });
  }

  const admin = createAdminClient();
  const results = await Promise.all(
    ids.map((id, i) =>
      admin.from("projects").update({ sort_order: i + 1 }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
