import { prisma } from "./prisma";
import { toLeadDTO, toUserDTO } from "./mappers";

export async function listUsers() {
  const rows = await prisma.user.findMany({
    include: { _count: { select: { leads: true } } },
    orderBy: { createdAt: "asc" },
  });

  return Promise.all(
    rows.map(async (row) => {
      const bookings = await prisma.appointment.count({
        where: {
          lead: { ownerId: row.id },
          status: { in: ["booked", "done"] },
        },
      });

      return toUserDTO(row, bookings);
    }),
  );
}

export async function getUser(id: string) {
  const row = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { leads: true } },
      leads: {
        include: { owner: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!row) return null;

  const bookings = await prisma.appointment.count({
    where: {
      lead: { ownerId: row.id },
      status: { in: ["booked", "done"] },
    },
  });

  return {
    ...toUserDTO(row, bookings),
    assignedLeads: row.leads.map(toLeadDTO),
  };
}
