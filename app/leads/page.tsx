import Link from "next/link";
import { LeadsTable } from "@/components/leads";
import { PageHead } from "@/components/ui";
import { listLeads } from "@/lib/db/leads";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await listLeads({ limit: 100 });

  return (
    <div>
      <PageHead
        eyebrow="Workspace / Leads"
        title="Leads"
        right={
          <div className="flex items-center gap-2">
            <span className="tag tag-ghost">{leads.length} active</span>
            <Link href="/leads/new" className="tag tag-blue">
              New lead
            </Link>
          </div>
        }
      />

      <div className="mt-5">
        <LeadsTable initialLeads={leads} />
      </div>
    </div>
  );
}