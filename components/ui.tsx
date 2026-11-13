import type { ReactNode } from "react";
import { tints, type Tint } from "@/lib/data";

export function Avatar({
  initials,
  tint,
  size = "md",
}: {
  initials: string;
  tint: Tint;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm"
      ? "h-7 w-7 rounded-[8px] text-[9px]"
      : size === "lg"
        ? "h-12 w-12 rounded-[14px] text-[14px]"
        : "h-9 w-9 rounded-[11px] text-[11px]";

  return (
    <span
      className={`grid shrink-0 place-items-center font-bold tracking-tight ${dims} ${tints[tint]}`}
    >
      {initials}
    </span>
  );
}

export function PageHead({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div>
        <p className="micro flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue" />
          {eyebrow}
        </p>
        <h1 className="display mt-2 text-[clamp(38px,6vw,68px)] text-ink">
          {title}
        </h1>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "blue" | "ghost" | "amber" | "dark" | "jade";
  children: ReactNode;
}) {
  const map = {
    blue: "tag-blue",
    ghost: "tag-ghost",
    amber: "border-amber/30 bg-amber-soft text-amber",
    dark: "tag-dark",
    jade: "border-jade/20 bg-jade-soft text-jade",
  } as const;

  return <span className={`tag ${map[tone]}`}>{children}</span>;
}

export function stageTone(stage: string): "blue" | "ghost" | "dark" {
  if (stage === "HOT") return "blue";
  if (stage === "BOOKED") return "dark";
  return "ghost";
}
