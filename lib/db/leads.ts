import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import {
  toAppointmentDTO,
  toConversationDTO,
  toFollowupDTO,
  toLeadDTO,
  toMessageDTO,
} from "./mappers";
import { computeScore } from "../scoring";
import { ApiError } from "../api";
import type {
  LeadDetail,
  Message,
} from "../types";
import type {
  AppointmentCreateInput,
  CreateLeadInput,
  FollowupCreateInput,
  HandoffInput,
  LeadFieldsInput,
  ListLeadsInput,
  MessageCreateInput,
  UpdateLeadInput,
} from "../schemas";

type TransactionClient = Prisma.TransactionClient;

async function scoreLead(client: TransactionClient, leadId: string) {
  const lead = await client.lead.findUnique({
    where: { id: leadId },
    include: { appointments: true },
  });

  if (!lead) {
    throw new ApiError("Lead not found", 404);
  }

  const hasAppointment = lead.appointments.some(
    (appointment) =>
      appointment.status === "booked" || appointment.status === "done",
  );

  const result = computeScore(lead, {
    hasAppointment,
    currentStage: lead.stage,
  });

  return client.lead.update({
    where: { id: leadId },
    data: {
      score: result.score,
      scoreReason: result.reason,
      stage: result.stage,
    },
  });
}

export async function listLeads(input: ListLeadsInput) {
  const where: Prisma.LeadWhereInput = {};

  if (input.stage) where.stage = input.stage;
  if (input.ownerId) where.ownerId = input.ownerId;

  if (input.q) {
    where.OR = [
      { name: { contains: input.q } },
      { phone: { contains: input.q } },
      { requirement: { contains: input.q } },
      { budget: { contains: input.q } },
    ];
  }

  const rows = await prisma.lead.findMany({
    where,
    include: { owner: true },
    orderBy: { updatedAt: "desc" },
    take: input.limit,
  });

  return rows.map(toLeadDTO);
}

export async function getLead(id: string): Promise<LeadDetail | null> {
  const row = await prisma.lead.findUnique({
    where: { id },
    include: {
      owner: true,
      conversations: { orderBy: { lastMessageAt: "desc" }, take: 1 },
      messages: { orderBy: { createdAt: "asc" } },
      appointments: { orderBy: { startsAt: "asc" } },
      followups: { orderBy: { runAt: "asc" } },
    },
  });

  if (!row) return null;

  return {
    ...toLeadDTO(row),
    conversation: row.conversations[0]
      ? toConversationDTO(row.conversations[0])
      : null,
    messages: row.messages.map(toMessageDTO),
    appointments: row.appointments.map(toAppointmentDTO),
    followups: row.followups.map(toFollowupDTO),
  };
}

export async function createLead(
  input: CreateLeadInput,
): Promise<LeadDetail> {
  if (input.externalId) {
    const existing = await prisma.lead.findUnique({
      where: { externalId: input.externalId },
    });

    if (existing) {
      const detail = await getLead(existing.id);
      if (detail) return detail;
    }
  }

  const leadId = await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        externalId: input.externalId ?? null,
        name: input.name,
        phone: input.phone ?? null,
        source: input.source,
        requirement: input.requirement ?? null,
        intent: input.intent ?? null,
        budget: input.budget ?? null,
        timeline: input.timeline ?? null,
        location: input.location ?? null,
        notes: input.notes ?? null,
        ownerId: input.ownerId ?? null,
      },
    });

    const conversation = await tx.conversation.create({
      data: { leadId: lead.id },
    });

    if (input.initialMessage) {
      const message = await tx.message.create({
        data: {
          leadId: lead.id,
          conversationId: conversation.id,
          direction: "in",
          body: input.initialMessage,
          channel: "whatsapp",
        },
      });

      await tx.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: message.createdAt },
      });
    }

    await scoreLead(tx, lead.id);

    return lead.id;
  });

  const lead = await getLead(leadId);

  if (!lead) {
    throw new ApiError("Lead could not be loaded", 500);
  }

  return lead;
}

export async function updateLead(
  id: string,
  input: UpdateLeadInput,
): Promise<LeadDetail> {
  const data: Prisma.LeadUpdateInput = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.source !== undefined) data.source = input.source;
  if (input.notes !== undefined) data.notes = input.notes;
  if (input.stage !== undefined) data.stage = input.stage;

  if (input.ownerId !== undefined) {
    data.owner = input.ownerId
      ? { connect: { id: input.ownerId } }
      : { disconnect: true };
  }

  await prisma.lead.update({ where: { id }, data });

  const lead = await getLead(id);

  if (!lead) {
    throw new ApiError("Lead not found", 404);
  }

  return lead;
}

export async function updateLeadFields(
  id: string,
  input: LeadFieldsInput,
): Promise<LeadDetail> {
  const existing = await prisma.lead.findUnique({ where: { id } });

  if (!existing) {
    throw new ApiError("Lead not found", 404);
  }

  const data: Prisma.LeadUpdateInput = {};

  if (input.requirement !== undefined) data.requirement = input.requirement;
  if (input.intent !== undefined) data.intent = input.intent;
  if (input.budget !== undefined) data.budget = input.budget;
  if (input.timeline !== undefined) data.timeline = input.timeline;
  if (input.location !== undefined) data.location = input.location;

  await prisma.lead.update({ where: { id }, data });
  await scoreLead(prisma, id);

  const lead = await getLead(id);

  if (!lead) {
    throw new ApiError("Lead not found", 404);
  }

  return lead;
}

export async function addMessage(
  leadId: string,
  input: MessageCreateInput,
): Promise<Message> {
  if (input.waMessageId) {
    const existing = await prisma.message.findUnique({
      where: { waMessageId: input.waMessageId },
    });

    if (existing) return toMessageDTO(existing);
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true },
  });

  if (!lead) {
    throw new ApiError("Lead not found", 404);
  }

  let conversation = input.conversationId
    ? await prisma.conversation.findUnique({
        where: { id: input.conversationId },
      })
    : await prisma.conversation.findFirst({ where: { leadId } });

  if (conversation && conversation.leadId !== leadId) {
    throw new ApiError("Conversation does not belong to this lead", 400);
  }

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { leadId },
    });
  }

  const message = await prisma.message.create({
    data: {
      leadId,
      conversationId: conversation.id,
      direction: input.direction,
      body: input.body,
      channel: input.channel,
      waMessageId: input.waMessageId ?? null,
      status: input.status,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: message.createdAt },
  });

  return toMessageDTO(message);
}

export async function bookAppointment(
  leadId: string,
  input: AppointmentCreateInput,
) {
  const startsAt = input.startsAt;
  const endsAt =
    input.endsAt ??
    new Date(startsAt.getTime() + input.durationMinutes * 60 * 1000);

  if (endsAt.getTime() <= startsAt.getTime()) {
    throw new ApiError("Appointment end must be after start", 422);
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true },
  });

  if (!lead) {
    throw new ApiError("Lead not found", 404);
  }

  const appointmentId = await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        leadId,
        startsAt,
        endsAt,
        status: input.status,
        notes: input.notes ?? null,
      },
    });

    await scoreLead(tx, leadId);

    return appointment.id;
  });

  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id: appointmentId },
  });
  const detail = await getLead(leadId);

  if (!detail) {
    throw new ApiError("Lead not found", 404);
  }

  return {
    appointment: toAppointmentDTO(appointment),
    lead: detail,
  };
}

export async function scheduleFollowup(
  leadId: string,
  input: FollowupCreateInput,
) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true },
  });

  if (!lead) {
    throw new ApiError("Lead not found", 404);
  }

  const followup = await prisma.followup.create({
    data: {
      leadId,
      runAt: input.runAt,
      reason: input.reason,
      step: input.step,
    },
  });

  return toFollowupDTO(followup);
}

export async function handoffLead(leadId: string, input: HandoffInput) {
  const existing = await prisma.lead.findUnique({ where: { id: leadId } });

  if (!existing) {
    throw new ApiError("Lead not found", 404);
  }

  const summary =
    input.summary ??
    `${existing.name} requested a human. Stage ${existing.stage}, score ${existing.score}.`;

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      handoffRequested: true,
      handoffSummary: summary,
      handoffAt: new Date(),
    },
  });

  await prisma.conversation.updateMany({
    where: { leadId },
    data: {
      status: "human",
      assignedTo: input.assignedTo ?? undefined,
    },
  });

  const lead = await getLead(leadId);

  if (!lead) {
    throw new ApiError("Lead not found", 404);
  }

  return lead;
}

export async function timeWarpFollowups(days: number) {
  const now = new Date();
  const through = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const due = await prisma.followup.findMany({
    where: { status: "pending", runAt: { lte: through } },
    orderBy: { runAt: "asc" },
  });

  for (const followup of due) {
    await addMessage(followup.leadId, {
      direction: "out",
      body: `Follow-up (${followup.step}): ${followup.reason}`,
      channel: "sim",
      status: "sent",
    });

    await prisma.followup.update({
      where: { id: followup.id },
      data: { status: "sent", sentAt: now },
    });
  }

  return {
    flushed: due.length,
    through: through.toISOString(),
  };
}
