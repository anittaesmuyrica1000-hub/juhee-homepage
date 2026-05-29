// 포트폴리오 콘텐츠 데이터. 실제 작업물로 교체해 사용하세요.

export const profile = {
  name: "김주희",
  nameEn: "Kim Juhee",
  role: "그래픽 · 브랜딩 디자이너",
  tagline: "브랜드의 본질을\n시각 언어로 번역합니다.",
  intro:
    "로고와 타이포그래피, 색과 그리드. 작은 시각 요소들이 모여 하나의 태도를 만듭니다. 저는 브랜드가 말하고 싶은 이야기를 가장 정확한 형태로 다듬는 일을 합니다.",
  email: "hello@juhee.design",
  location: "Seoul, KR",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Behance", href: "https://behance.net/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],
};

// 프로젝트(Work) 데이터는 Supabase 에서 관리됩니다 → lib/projects.ts, lib/types.ts

export const services = [
  {
    no: "01",
    title: "브랜드 아이덴티티",
    desc: "로고, 컬러, 타이포그래피를 아우르는 시각 시스템과 브랜드 가이드라인을 설계합니다.",
  },
  {
    no: "02",
    title: "패키지 디자인",
    desc: "제품의 가치를 손에 잡히는 경험으로 옮깁니다. 구조·소재·인쇄까지 함께 고려합니다.",
  },
  {
    no: "03",
    title: "편집 · 타이포그래피",
    desc: "브로슈어, 카탈로그, 도서. 읽는 리듬을 설계하는 그리드와 활자 운용.",
  },
  {
    no: "04",
    title: "아트 디렉션",
    desc: "캠페인의 톤앤매너를 정의하고 촬영·일러스트·모션의 방향을 이끕니다.",
  },
];

export const clients = [
  "Maru",
  "Soil",
  "Noon Books",
  "Tide",
  "Ssal Mill",
  "Form Studio",
  "Coda",
  "Atelier 9",
];
