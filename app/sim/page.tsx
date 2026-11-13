import { ChatSimulator } from "@/components/chat-simulator";
import { PageHead } from "@/components/ui";
import { ResetButton } from "@/components/reset-button";
import { listLeads } from "@/lib/db/leads";

export const dynamic = "force-dynamic";

export default async function SimulatorPage() {
  const leads = await listLeads({ limit: 100 });

  return (
    <div>
      <PageHead
        eyebrow="Workspace / Simulator"
        title="Simulator"
        right={<ResetButton className="tag tag-ghost" />}
      />

      <div className="mt-5">
        <ChatSimulator initialLeads={leads} />
      </div>
    </div>
  );
}