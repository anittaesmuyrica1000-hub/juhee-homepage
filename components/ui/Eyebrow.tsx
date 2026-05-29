import { cn } from "./cn";

// 섹션 상단의 작은 라벨 (모노스페이스 트래킹). tone 으로 강조색 선택.
export default function Eyebrow({
  children,
  className,
  tone = "muted",
  line = false,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "primary" | "secondary";
  line?: boolean;
}) {
  const toneClass =
    tone === "primary" ? "text-primary" : tone === "secondary" ? "text-secondary" : "text-muted";
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em]",
        toneClass,
        className
      )}
    >
      {line && <span className="inline-block h-px w-10 bg-primary" />}
      {children}
    </p>
  );
}
