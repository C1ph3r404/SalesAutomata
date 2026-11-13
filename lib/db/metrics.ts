import { prisma } from "./prisma";
import type { Metrics } from "../types";

export async function getMetrics(): Promise<Metrics> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const [
    total,
    newLeads,
    hot,
    qualifying,
    booked,
    lost,
    appointmentsTotal,
    appointmentsBooked,
    appointmentsToday,
    followupsPending,
    followupsSent,
    usersTotal,
    usersActive,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { stage: "NEW" } }),
    prisma.lead.count({ where: { stage: "HOT" } }),
    prisma.lead.count({ where: { stage: "QUALIFYING" } }),
    prisma.lead.count({ where: { stage: "BOOKED" } }),
    prisma.lead.count({ where: { stage: "LOST" } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "booked" } }),
    prisma.appointment.count({
      where: {
        status: "booked",
        startsAt: { gte: startOfDay, lt: endOfDay },
      },
    }),
    prisma.followup.count({ where: { status: "pending" } }),
    prisma.followup.count({ where: { status: "sent" } }),
    prisma.user.count(),
    prisma.user.count({ where: { status: "Active" } }),
  ]);

  const qualified = hot + qualifying + booked;

  return {
    leads: {
      total,
      new: newLeads,
      hot,
      qualifying,
      booked,
      lost,
    },
    appointments: {
      total: appointmentsTotal,
      booked: appointmentsBooked,
      today: appointmentsToday,
    },
    followups: {
      pending: followupsPending,
      sent: followupsSent,
    },
    users: {
      total: usersTotal,
      active: usersActive,
    },
    qualificationRate: total > 0 ? Math.round((qualified / total) * 100) : 0,
    bookingRate: total > 0 ? Math.round((booked / total) * 100) : 0,
    medianFirstReplySeconds: 6,
  };
}
