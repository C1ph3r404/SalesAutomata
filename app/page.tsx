import { FooterBand, StatusBar } from "@/components/chrome";
import { Hero } from "@/components/hero";
import {
  ChatPanel,
  InfoA,
  InfoB,
  PipelineStrip,
  TitleRow,
} from "@/components/sections";
import { getLead, listLeads } from "@/lib/db/leads";
import { getMetrics } from "@/lib/db/metrics";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [metrics, leads] = await Promise.all([
    getMetrics(),
    listLeads({ limit: 20 }),
  ]);

  const activeLead =
    leads.find((lead) => lead.stage === "HOT") ?? leads[0] ?? null;
  const detail = activeLead ? await getLead(activeLead.id) : null;
  const initials =
    activeLead?.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? undefined;
  const booked = detail?.appointments.some(
    (appointment) => appointment.status === "booked",
  );

  return (
    <div>
      <StatusBar metrics={metrics} />
      <Hero />
      <TitleRow metrics={metrics} />

      <div className="mt-6 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <InfoA metrics={metrics} />
          <InfoB metrics={metrics} />
        </div>
        <ChatPanel
          messages={detail?.messages ?? []}
          leadName={activeLead?.name}
          leadInitials={initials}
          booked={booked}
        />
      </div>

      <PipelineStrip leads={leads} />
      <FooterBand />
    </div>
  );
}