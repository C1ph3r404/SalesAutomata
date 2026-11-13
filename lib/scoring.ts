import type { LeadStage } from "./types";

export type ScoringInput = {
  intent?: string | null;
  budget?: string | null;
  timeline?: string | null;
  location?: string | null;
  requirement?: string | null;
  phone?: string | null;
};

export type ScoringContext = {
  hasAppointment?: boolean;
  currentStage?: string | null;
};

export type ScoringResult = {
  score: number;
  reason: string;
  stage: LeadStage;
};

export function computeScore(
  input: ScoringInput,
  context: ScoringContext = {},
): ScoringResult {
  let score = 5;
  const known: string[] = [];

  if (input.intent) {
    score += 10;
    known.push(`intent ${input.intent}`);
  }
  if (input.budget) {
    score += 20;
    known.push(`budget ${input.budget}`);
  }
  if (input.timeline) {
    score += 15;
    known.push(`timeline ${input.timeline}`);
  }
  if (input.requirement) {
    score += 10;
    known.push("requirement captured");
  }
  if (input.location) {
    score += 5;
    known.push(`location ${input.location}`);
  }
  if (input.phone) {
    score += 10;
    known.push("contact available");
  }
  if (context.hasAppointment) {
    score += 15;
    known.push("viewing booked");
  }

  score = Math.min(100, score);

  const missing: string[] = [];
  if (!input.intent) missing.push("intent");
  if (!input.budget) missing.push("budget");
  if (!input.timeline) missing.push("timeline");
  if (!input.phone) missing.push("contact");

  const detail = known.length > 0 ? known.join(" · ") : "No qualification data";
  const reason =
    missing.length > 0 ? `${detail} · missing ${missing.join(", ")}` : detail;

  let stage: LeadStage;
  if (context.currentStage === "LOST") {
    stage = "LOST";
  } else if (context.hasAppointment) {
    stage = "BOOKED";
  } else if (score >= 75) {
    stage = "HOT";
  } else if (score >= 45) {
    stage = "QUALIFYING";
  } else {
    stage = "NEW";
  }

  return { score, reason, stage };
}
