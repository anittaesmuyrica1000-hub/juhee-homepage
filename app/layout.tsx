import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://juhee.design";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kim Juhee — 그래픽 · 브랜딩 디자이너",
    template: "%s — Kim Juhee",
  },
  description:
    "브랜드의 본질을 시각 언어로 번역하는 그래픽·브랜딩 디자이너 김주희의 포트폴리오. 아이덴티티, 타이포그래피, 편집, 패키지 디자인.",
  keywords: [
    "김주희",
    "Kim Juhee",
    "그래픽 디자이너",
    "브랜딩 디자이너",
    "브랜드 아이덴티티",
    "타이포그래피",
    "편집 디자인",
    "포트폴리오",
  ],
  authors: [{ name: "Kim Juhee" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Kim Juhee Studio",
    title: "Kim Juhee — 그래픽 · 브랜딩 디자이너",
    description:
      "브랜드의 본질을 시각 언어로 번역하는 그래픽·브랜딩 디자이너 김주희의 포트폴리오.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kim Juhee — 그래픽 · 브랜딩 디자이너",
    description: "브랜드의 본질을 시각 언어로 번역하는 디자이너 김주희.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
