import { N8nConnect } from "@/components/automations";
import { PageHead } from "@/components/ui";

export default function AutomationsPage() {
  return (
    <div>
      <PageHead
        eyebrow="Workspace / Automations"
        title="Automations"
        right={<span className="tag tag-ghost">n8n · v1.0</span>}
      />

      <div className="mt-5">
        <N8nConnect />
      </div>
    </div>
  );
}
