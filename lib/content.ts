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

export type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  // 팔레트로 표현한 플레이스홀더 비주얼 (실제 이미지로 교체 가능)
  palette: [string, string];
};

export const projects: Project[] = [
  {
    id: "maru",
    title: "MARU 도자 브랜드",
    client: "Maru Ceramics",
    category: "Brand Identity",
    year: "2025",
    description:
      "전통 백자의 절제된 곡선에서 출발한 로고타입과 그리드 시스템. 여백을 핵심 자산으로 정의했습니다.",
    tags: ["로고", "아이덴티티", "패키지"],
    palette: ["#e8e2d6", "#1c1b19"],
  },
  {
    id: "soil",
    title: "SOIL 친환경 화장품",
    client: "Soil Beauty",
    category: "Packaging",
    year: "2024",
    description:
      "흙과 식물에서 추출한 색을 그대로 옮긴 팔레트. 재생용지 질감을 살린 미니멀 패키지 라인.",
    tags: ["패키지", "타이포그래피", "아트디렉션"],
    palette: ["#c2b59b", "#3a4a32"],
  },
  {
    id: "noon",
    title: "정오의 서점 리브랜딩",
    client: "Noon Books",
    category: "Rebranding",
    year: "2024",
    description:
      "동네 서점의 따뜻함을 잃지 않으면서 디지털 채널까지 확장 가능한 유연한 비주얼 시스템.",
    tags: ["리브랜딩", "편집", "사이니지"],
    palette: ["#f1d9b5", "#a8431f"],
  },
  {
    id: "tide",
    title: "TIDE 뮤직 페스티벌",
    client: "Tide Festival",
    category: "Visual Identity",
    year: "2023",
    description:
      "파도의 리듬을 모듈형 그래픽으로 변주한 키 비주얼. 포스터부터 굿즈까지 일관된 톤을 구축.",
    tags: ["키비주얼", "포스터", "모션"],
    palette: ["#cfe3e8", "#16384a"],
  },
  {
    id: "ssal",
    title: "쌀 도정소 패키지",
    client: "Ssal Mill",
    category: "Packaging",
    year: "2023",
    description:
      "한 줌의 쌀알을 활자처럼 배열한 타이포그래피 중심 패키지. 품종별 컬러 코드 도입.",
    tags: ["패키지", "타이포그래피"],
    palette: ["#efe7d2", "#7a6a3f"],
  },
  {
    id: "form",
    title: "FORM 가구 카탈로그",
    client: "Form Studio",
    category: "Editorial",
    year: "2022",
    description:
      "제품 사진과 도면을 교차시킨 편집 그리드. 종이의 물성을 고려한 인쇄 디렉션.",
    tags: ["편집", "아트디렉션", "인쇄"],
    palette: ["#ddd8cf", "#2b2b2b"],
  },
];

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
