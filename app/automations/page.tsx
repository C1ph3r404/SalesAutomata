import { N8nConnect } from "@/components/automations";
import { PageHead } from "@/components/ui";
import { listWorkflows } from "@/lib/db/workflows";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const workflows = await listWorkflows();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const webhookUrl = `${appUrl.replace(/\/$/, "")}/api/webhook/n8n`;

  return (
    <div>
      <PageHead
        eyebrow="Workspace / Automations"
        title="Automations"
        right={<span className="tag tag-ghost">n8n · v1.0</span>}
      />

      <div className="mt-5">
        <N8nConnect workflows={workflows} webhookUrl={webhookUrl} />
      </div>
    </div>
  );
}