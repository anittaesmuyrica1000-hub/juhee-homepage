import { getPublicClient } from "./supabase";
import type { Project } from "./types";

/**
 * 공개 페이지용 프로젝트 목록 (sort_order 오름차순).
 * Supabase 미설정/오류 시 빈 배열을 반환해 페이지가 깨지지 않게 합니다.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await getPublicClient()
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[getProjects]", error.message);
      return [];
    }
    return (data ?? []) as Project[];
  } catch (e) {
    console.error("[getProjects]", e);
    return [];
  }
}

/** slug 로 단일 프로젝트 조회 (상세 페이지용). 없으면 null. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const { data, error } = await getPublicClient()
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("[getProjectBySlug]", error.message);
      return null;
    }
    return (data as Project) ?? null;
  } catch (e) {
    console.error("[getProjectBySlug]", e);
    return null;
  }
}
