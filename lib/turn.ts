import { ApiError } from "./api";
import {
  addMessage,
  getLead,
  handoffLead,
  updateLeadFields,
} from "./db/leads";
import type { MessageChannel, TurnResult } from "./types";

function extractFields(body: string) {
  const fields: {
    intent?: string;
    budget?: string;
    timeline?: string;
    location?: string;
  } = {};

  const budget = body.match(
    /(?:rs\.?\s*)?(\d+(?:\.\d+)?)\s*(crore|cr|lakh|lac|k|million|m)\b/i,
  );
  if (budget) fields.budget = `${budget[1]} ${budget[2]}`;

  const timeline = body.match(
    /(\d+)\s*(day|days|week|weeks|month|months)\b/i,
  );
  if (timeline) fields.timeline = `${timeline[1]} ${timeline[2]}`;

  if (/\binvest/i.test(body)) {
    fields.intent = "investment";
  } else if (/\brent/i.test(body)) {
    fields.intent = "rental";
  } else if (/\b(?:buy|buying|purchase|self)\b/i.test(body)) {
    fields.intent = "buying";
  }

  const location = body.match(
    /\b(DHA(?: Phase \d+)?|Bahria Town|Gulberg|Blue Area|Askari(?:\s*\d+)?)\b/i,
  );
  if (location) fields.location = location[1];

  return fields;
}

function buildReply(body: string, requirement: string | null) {
  if (/\b(?:human|agent|person|representative)\b/i.test(body)) {
    return "Of course. I am connecting you to a specialist now.";
  }

  if (/\b(?:budget|crore|cr|lakh|lac)\b/i.test(body)) {
    return "Got it — noted. What timeline are you working with?";
  }

  if (/\b(?:day|week|month)\b/i.test(body)) {
    return "Thanks. I can hold a viewing Thursday 5 PM or Saturday 11 AM — which suits?";
  }

  return `Thanks for reaching out about ${requirement ?? "the property"}. Are you buying for yourself or investment?`;
}

export async function runTurn(
  leadId: string,
  message: string,
  channel: MessageChannel = "sim",
): Promise<TurnResult> {
  const existing = await getLead(leadId);

  if (!existing) {
    throw new ApiError("Lead not found", 404);
  }

  const fields = extractFields(message);

  if (Object.keys(fields).length > 0) {
    await updateLeadFields(leadId, fields);
  }

  await addMessage(leadId, {
    direction: "in",
    body: message,
    channel,
    status: "received",
  });

  const handoff = /\b(?:human|agent|person|representative)\b/i.test(message);
  const reply = buildReply(message, existing.requirement);

  await addMessage(leadId, {
    direction: "out",
    body: reply,
    channel,
    status: "sent",
  });

  if (handoff) {
    await handoffLead(leadId, {
      summary: `${existing.name} asked to speak to a human in the simulator.`,
    });
  }

  const lead = await getLead(leadId);

  if (!lead) {
    throw new ApiError("Lead not found", 404);
  }

  return {
    lead,
    messages: lead.messages,
    reply,
    appointment: lead.appointments.at(-1) ?? null,
    followup: lead.followups.find((item) => item.status === "pending") ?? null,
    handoff,
  };
}
