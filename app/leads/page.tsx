import Link from "next/link";
import { LeadsTable } from "@/components/leads";
import { PageHead } from "@/components/ui";

export default function LeadsPage() {
  return (
    <div>
      <PageHead
        eyebrow="Workspace / Leads"
        title="Leads"
        right={
          <div className="flex items-center gap-2">
            <span className="tag tag-ghost">8 active</span>
            <Link href="/leads/new" className="tag tag-blue">
              New lead
            </Link>
          </div>
        }
      />

      <div className="mt-5">
        <LeadsTable />
      </div>
    </div>
  );
}
