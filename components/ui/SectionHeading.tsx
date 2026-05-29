import { cn } from "./cn";

// 섹션 대제목 (font-display). 우측에 보조 텍스트(meta) 옵션.
export default function SectionHeading({
  children,
  meta,
  className,
}: {
  children: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <h2 className="font-display text-4xl tracking-tight md:text-6xl">{children}</h2>
      {meta && <p className="text-sm text-muted">{meta}</p>}
    </div>
  );
}
