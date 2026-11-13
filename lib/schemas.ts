import { z } from "zod";

const nullableText = (max = 200) =>
  z.string().trim().max(max).nullable().optional();

export const leadStageSchema = z.enum([
  "NEW",
  "QUALIFYING",
  "HOT",
  "BOOKED",
  "LOST",
]);

export const createLeadSchema = z.object({
  externalId: nullableText(120),
  name: z.string().trim().min(1).max(120),
  phone: nullableText(40),
  source: z.string().trim().min(1).max(80).default("WhatsApp"),
  requirement: nullableText(200),
  intent: nullableText(200),
  budget: nullableText(80),
  timeline: nullableText(80),
  location: nullableText(200),
  notes: nullableText(2000),
  ownerId: z.string().trim().min(1).nullable().optional(),
  initialMessage: z.string().trim().min(1).max(4000).optional(),
});

export const updateLeadSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    phone: nullableText(40),
    source: z.string().trim().min(1).max(80),
    notes: nullableText(2000),
    stage: leadStageSchema,
    ownerId: z.string().trim().min(1).nullable(),
  })
  .partial()
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field is required",
  });

export const leadFieldsSchema = z
  .object({
    requirement: nullableText(200),
    intent: nullableText(200),
    budget: nullableText(80),
    timeline: nullableText(80),
    location: nullableText(200),
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field is required",
  });

export const messageCreateSchema = z.object({
  conversationId: z.string().trim().min(1).nullable().optional(),
  direction: z.enum(["in", "out"]),
  body: z.string().trim().min(1).max(4000),
  channel: z.enum(["whatsapp", "sim"]).default("sim"),
  waMessageId: nullableText(160),
  status: z.string().trim().min(1).max(40).default("sent"),
});

export const appointmentCreateSchema = z.object({
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional(),
  durationMinutes: z.coerce.number().int().min(5).max(480).default(30),
  notes: nullableText(500),
  status: z.enum(["booked", "cancelled", "done"]).default("booked"),
});

export const followupCreateSchema = z.object({
  runAt: z.coerce.date(),
  reason: z.string().trim().min(1).max(500),
  step: z.string().trim().min(1).max(80).default("custom"),
});

export const handoffSchema = z.object({
  summary: nullableText(4000),
  assignedTo: nullableText(160),
});

export const turnSchema = z.object({
  leadId: z.string().trim().min(1),
  message: z.string().trim().min(1).max(4000),
  channel: z.enum(["whatsapp", "sim"]).default("sim"),
});

export const listLeadsQuerySchema = z.object({
  stage: leadStageSchema.optional(),
  q: z.string().trim().min(1).max(120).optional(),
  ownerId: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const timeWarpSchema = z.object({
  days: z.coerce.number().int().min(0).max(365).default(3),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadFieldsInput = z.infer<typeof leadFieldsSchema>;
export type MessageCreateInput = z.infer<typeof messageCreateSchema>;
export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;
export type FollowupCreateInput = z.infer<typeof followupCreateSchema>;
export type HandoffInput = z.infer<typeof handoffSchema>;
export type TurnInput = z.infer<typeof turnSchema>;
export type ListLeadsInput = z.infer<typeof listLeadsQuerySchema>;
export type TimeWarpInput = z.infer<typeof timeWarpSchema>;
