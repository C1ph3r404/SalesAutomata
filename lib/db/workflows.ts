import { prisma } from "./prisma";
import { toWorkflowDTO } from "./mappers";

export async function listWorkflows() {
  const rows = await prisma.workflow.findMany({
    orderBy: { createdAt: "asc" },
  });

  return rows.map(toWorkflowDTO);
}
