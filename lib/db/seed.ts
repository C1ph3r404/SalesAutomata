import { prisma } from "./prisma";
import {
  leads as mockLeads,
  users as mockUsers,
  workflows as mockWorkflows,
} from "../data";
import { computeScore } from "../scoring";

type LeadProfile = {
  phone: string;
  intent: string | null;
  budget: string | null;
  timeline: string | null;
  location: string | null;
};

const profiles: Record<string, LeadProfile> = {
  l1: {
    phone: "+92 300 1122334",
    intent: "investment",
    budget: "3.2 Cr",
    timeline: "30 days",
    location: "DHA Phase 6",
  },
  l2: {
    phone: "+92 321 4455667",
    intent: "buying for family",
    budget: "4.5 Cr",
    timeline: "60 days",
    location: "DHA Phase 5",
  },
  l3: {
    phone: "+92 333 7788990",
    intent: "buying",
    budget: "4.5 Cr",
    timeline: null,
    location: "Askari 11",
  },
  l4: {
    phone: "+92 345 2233445",
    intent: "buying",
    budget: "5 Cr",
    timeline: "this week",
    location: "DHA Phase 6",
  },
  l5: {
    phone: "+92 312 6677889",
    intent: null,
    budget: null,
    timeline: null,
    location: "Bahria Town",
  },
  l6: {
    phone: "+92 300 9900112",
    intent: null,
    budget: null,
    timeline: null,
    location: "DHA Phase 6",
  },
  l7: {
    phone: "+92 321 3344556",
    intent: "commercial investment",
    budget: null,
    timeline: "90 days",
    location: "Blue Area",
  },
  l8: {
    phone: "+92 333 5566778",
    intent: "rental",
    budget: null,
    timeline: "1 month",
    location: "Gulberg",
  },
};

const conversations: Record<string, string> = {};
const messages = [
  {
    leadId: "l1",
    direction: "in",
    body: "Have you seen the DHA Phase 6 listing?",
    minutesAgo: 5,
  },
  {
    leadId: "l1",
    direction: "out",
    body: "Yes — 2BHK, corner unit, ready to move.",
    minutesAgo: 4,
  },
  {
    leadId: "l1",
    direction: "in",
    body: "Is 3.2 crore negotiable?",
    minutesAgo: 3,
  },
  {
    leadId: "l1",
    direction: "out",
    body: "Slightly. I can hold a viewing at 5 PM.",
    minutesAgo: 2,
  },
  {
    leadId: "l2",
    direction: "in",
    body: "Is the 3BHK in DHA Phase 5 available?",
    minutesAgo: 20,
  },
  {
    leadId: "l2",
    direction: "out",
    body: "Yes, it is. What budget range are you working with?",
    minutesAgo: 19,
  },
  {
    leadId: "l3",
    direction: "in",
    body: "Can I talk to a human?",
    minutesAgo: 30,
  },
  {
    leadId: "l3",
    direction: "out",
    body: "Of course. I am connecting you to a specialist now.",
    minutesAgo: 29,
  },
];

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000);
}

function tomorrowAt(hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hour, 0, 0, 0);
  return date;
}

export async function resetDemoData() {
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.followup.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.lead.deleteMany(),
    prisma.workflow.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  for (const user of mockUsers) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        initials: user.initials,
        role: user.role,
        phone: user.phone,
        email: user.email,
        timezone: user.timezone,
        status: user.status,
        seat: user.seat,
        joined: user.joined,
        lastActive: user.lastActive,
        response: user.response,
        conversion: user.conversion,
        tint: user.tint,
      },
    });
  }

  const ownerIds = new Map(mockUsers.map((user) => [user.name, user.id]));

  for (const [index, lead] of mockLeads.entries()) {
    const profile = profiles[lead.id];
    const ownerId = ownerIds.get(lead.owner) ?? null;
    const createdAt = new Date(Date.now() - (index + 1) * 8 * 60 * 1000);
    const hasAppointment = lead.stage === "BOOKED";

    const scored = computeScore(
      {
        intent: profile?.intent,
        budget: profile?.budget,
        timeline: profile?.timeline,
        location: profile?.location,
        requirement: lead.requirement,
        phone: profile?.phone,
      },
      { hasAppointment, currentStage: null },
    );

    const row = await prisma.lead.create({
      data: {
        id: lead.id,
        name: lead.name,
        phone: profile?.phone ?? null,
        source: lead.source,
        requirement: lead.requirement,
        intent: profile?.intent ?? null,
        budget: profile?.budget ?? null,
        timeline: profile?.timeline ?? null,
        location: profile?.location ?? null,
        stage: scored.stage,
        score: scored.score,
        scoreReason: scored.reason,
        ownerId,
        createdAt,
      },
    });

    const conversation = await prisma.conversation.create({
      data: { leadId: row.id, lastMessageAt: createdAt },
    });
    conversations[lead.id] = conversation.id;
  }

  for (const message of messages) {
    const createdAt = minutesAgo(message.minutesAgo);
    await prisma.message.create({
      data: {
        leadId: message.leadId,
        conversationId: conversations[message.leadId],
        direction: message.direction,
        body: message.body,
        channel: "whatsapp",
        createdAt,
      },
    });
  }

  for (const [leadId, conversationId] of Object.entries(conversations)) {
    const last = await prisma.message.findFirst({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
    });

    if (last) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: last.createdAt },
      });
    }
  }

  const startsAt = tomorrowAt(17);
  const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);

  await prisma.appointment.create({
    data: {
      leadId: "l4",
      startsAt,
      endsAt,
      status: "booked",
      notes: "Viewing · 4BHK DHA Phase 6",
    },
  });

  await prisma.followup.createMany({
    data: [
      {
        leadId: "l2",
        runAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        reason: "Ask whether financing is arranged and confirm weekend availability",
        step: "day-1",
      },
      {
        leadId: "l5",
        runAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        reason: "Share two alternate Bahria Town listings within budget",
        step: "day-3",
      },
      {
        leadId: "l7",
        runAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        reason: "Send the commercial inventory update for Blue Area",
        step: "day-7",
      },
    ],
  });

  await prisma.lead.update({
    where: { id: "l3" },
    data: {
      handoffRequested: true,
      handoffSummary:
        "Omar wants a 4BHK in Askari 11. Budget is 4.5 Cr. He asked for a human before confirming a viewing slot.",
      handoffAt: minutesAgo(28),
    },
  });

  await prisma.conversation.updateMany({
    where: { leadId: "l3" },
    data: { status: "human", assignedTo: "usman-tariq" },
  });

  for (const workflow of mockWorkflows) {
    await prisma.workflow.create({
      data: {
        id: workflow.id,
        name: workflow.name,
        status: workflow.status,
        runs: workflow.runs,
        last: workflow.last,
        desc: workflow.desc,
      },
    });
  }

  return { ok: true };
}
