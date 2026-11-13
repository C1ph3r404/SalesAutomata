import { notFound } from "next/navigation";
import { LeadDetailPanel } from "@/components/lead-detail";
import { getLead } from "@/lib/db/leads";
import { listUsers } from "@/lib/db/users";

export const dynamic = "force-dynamic";

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, users] = await Promise.all([getLead(id), listUsers()]);

  if (!lead) notFound();

  return <LeadDetailPanel lead={lead} users={users} />;
}