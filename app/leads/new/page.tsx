import Link from "next/link";
import { NewLeadForm } from "@/components/new-lead-form";
import { PageHead } from "@/components/ui";
import { listUsers } from "@/lib/db/users";

export const dynamic = "force-dynamic";

export default async function NewLeadPage() {
  const users = await listUsers();

  return (
    <div>
      <PageHead
        eyebrow="Leads / New"
        title="New lead"
        right={
          <Link href="/leads" className="tag tag-ghost">
            Cancel
          </Link>
        }
      />

      <NewLeadForm users={users} />
    </div>
  );
}