import { cn } from "./cn";

// 태그/배지 칩. tone 으로 스타일 변형.
export default function Tag({
  children,
  className,
  tone = "outline",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "outline" | "primary" | "secondary" | "solid";
}) {
  const tones: Record<string, string> = {
    outline: "border border-ink/15 text-ink/70",
    primary: "border border-primary/40 text-primary",
    secondary: "border border-secondary/40 text-secondary",
    solid: "bg-ink text-paper",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
