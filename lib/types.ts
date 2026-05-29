// projects 테이블과 1:1 대응하는 타입
export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  image_url: string | null;
  palette: string[]; // [from, to] — image_url 이 없을 때 그라데이션 폴백
  body: string; // 상세 페이지 본문 (줄바꿈 = 문단)
  gallery: string[]; // 상세 페이지 추가 이미지 URL 목록
  sort_order: number;
};

// 관리자 폼에서 주고받는 입력 형태 (id/타임스탬프 제외)
export type ProjectInput = {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  image_url: string | null;
  palette: string[];
  body: string;
  gallery: string[];
  sort_order: number;
};
