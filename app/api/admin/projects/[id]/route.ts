import { NextResponse } from "next/server";
import { guard } from "@/lib/admin-guard";
import { createAdminClient, BUCKET } from "@/lib/supabase";
import type { ProjectInput } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

// public URL → 버킷 내부 경로 추출
function storagePathFromUrl(url: string | null): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : url.slice(i + marker.length);
}

// 수정
export async function PUT(req: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Partial<ProjectInput>;

  // 전달된 필드만 갱신
  const patch: Record<string, unknown> = {};
  for (const key of [
    "slug",
    "title",
    "client",
    "category",
    "year",
    "description",
    "tags",
    "image_url",
    "palette",
    "body",
    "gallery",
    "sort_order",
  ] as const) {
    if (key in body) patch[key] = body[key];
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ project: data });
}

// 삭제 (연결된 이미지도 Storage 에서 제거)
export async function DELETE(_req: Request, { params }: Params) {
  const denied = await guard();
  if (denied) return denied;

  const { id } = await params;
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("projects")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const path = storagePathFromUrl(existing?.image_url ?? null);
  if (path) {
    await admin.storage.from(BUCKET).remove([path]).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
