import type {
  Appointment as AppointmentRow,
  Conversation as ConversationRow,
  Followup as FollowupRow,
  Lead as LeadRow,
  Message as MessageRow,
  User as UserRow,
  Workflow as WorkflowRow,
} from "@prisma/client";
import type {
  Appointment,
  Conversation,
  Followup,
  Lead,
  LeadStage,
  Message,
  MessageChannel,
  MessageDirection,
  Tint,
  User,
  UserStatus,
  Workflow,
} from "../types";

type OwnerRow = Pick<UserRow, "id" | "name" | "initials" | "role" | "tint">;

export function toUserSummary(row: OwnerRow | null | undefined) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    role: row.role,
    tint: row.tint as Tint,
  };
}

export function toLeadDTO(
  row: LeadRow & { owner?: OwnerRow | null },
): Lead {
  return {
    id: row.id,
    externalId: row.externalId,
    name: row.name,
    phone: row.phone,
    source: row.source,
    requirement: row.requirement,
    intent: row.intent,
    budget: row.budget,
    timeline: row.timeline,
    location: row.location,
    notes: row.notes,
    stage: row.stage as LeadStage,
    score: row.score,
    scoreReason: row.scoreReason,
    ownerId: row.ownerId,
    owner: toUserSummary(row.owner),
    handoffRequested: row.handoffRequested,
    handoffSummary: row.handoffSummary,
    handoffAt: row.handoffAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toMessageDTO(row: MessageRow): Message {
  return {
    id: row.id,
    leadId: row.leadId,
    conversationId: row.conversationId,
    direction: row.direction as MessageDirection,
    body: row.body,
    channel: row.channel as MessageChannel,
    waMessageId: row.waMessageId,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toConversationDTO(row: ConversationRow): Conversation {
  return {
    id: row.id,
    leadId: row.leadId,
    status: row.status as Conversation["status"],
    assignedTo: row.assignedTo,
    lastMessageAt: row.lastMessageAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toAppointmentDTO(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    leadId: row.leadId,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    status: row.status as Appointment["status"],
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toFollowupDTO(row: FollowupRow): Followup {
  return {
    id: row.id,
    leadId: row.leadId,
    runAt: row.runAt.toISOString(),
    reason: row.reason,
    step: row.step,
    status: row.status as Followup["status"],
    sentAt: row.sentAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toUserDTO(
  row: UserRow & { _count?: { leads: number } },
  bookings = 0,
): User {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    role: row.role,
    phone: row.phone,
    email: row.email,
    timezone: row.timezone,
    status: row.status as UserStatus,
    seat: row.seat,
    joined: row.joined,
    lastActive: row.lastActive,
    leads: row._count?.leads ?? 0,
    response: row.response,
    conversion: row.conversion,
    bookings,
    tint: row.tint as Tint,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toWorkflowDTO(row: WorkflowRow): Workflow {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    runs: row.runs,
    last: row.last,
    desc: row.desc,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
