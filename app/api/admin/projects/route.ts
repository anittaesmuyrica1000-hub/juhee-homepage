import { NextResponse } from "next/server";
import { guard } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase";
import type { ProjectInput } from "@/lib/types";

function normalize(body: Partial<ProjectInput>): ProjectInput {
  return {
    slug: String(body.slug ?? "").trim(),
    title: String(body.title ?? "").trim(),
    client: String(body.client ?? "").trim(),
    category: String(body.category ?? "").trim(),
    year: String(body.year ?? "").trim(),
    description: String(body.description ?? "").trim(),
    tags: Array.isArray(body.tags) ? body.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    image_url: body.image_url ? String(body.image_url) : null,
    palette: Array.isArray(body.palette) ? body.palette.map(String) : [],
    sort_order: Number.isFinite(body.sort_order) ? Number(body.sort_order) : 0,
  };
}

// 목록 조회 (관리자용 — 공개 정책과 동일하지만 일관성 위해 제공)
export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ projects: data });
}

// 신규 생성
export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  const input = normalize(await req.json().catch(() => ({})));
  if (!input.title) {
    return NextResponse.json({ error: "제목은 필수입니다." }, { status: 400 });
  }
  if (!input.slug) {
    input.slug = `project-${Date.now()}`;
  }

  const admin = createAdminClient();

  // sort_order 미지정 시 맨 뒤로
  if (!input.sort_order) {
    const { data: last } = await admin
      .from("projects")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    input.sort_order = (last?.sort_order ?? 0) + 1;
  }

  const { data, error } = await admin.from("projects").insert(input).select().single();
  if (error) {
    const status = error.code === "23505" ? 409 : 500; // unique 위반
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ project: data }, { status: 201 });
}
