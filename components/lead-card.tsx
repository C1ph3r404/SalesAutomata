import type { Lead } from "@/lib/types";
import { formatScoreReason } from "@/lib/format";
import { StatusPill, stageTone } from "@/components/ui";

export function LeadCard({ lead }: { lead: Lead }) {
  const fields = [
    { label: "Intent", value: lead.intent },
    { label: "Budget", value: lead.budget },
    { label: "Timeline", value: lead.timeline },
    { label: "Location", value: lead.location },
    { label: "Requirement", value: lead.requirement },
  ];

  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="micro">Lead</p>
          <h2 className="mt-2 truncate text-[22px] font-bold tracking-tight text-ink">
            {lead.name}
          </h2>
          <p className="micro mt-1">
            {lead.phone ?? "No phone"} · {lead.source}
          </p>
        </div>
        <StatusPill tone={stageTone(lead.stage)}>{lead.stage}</StatusPill>
      </div>

      <div className="mt-4 flex items-end justify-between border-y border-line py-4">
        <div>
          <p className="num-xl text-ink">{lead.score}</p>
          <p className="micro mt-2">Score / 100</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              lead.score >= 75
                ? "bg-blue"
                : lead.score >= 45
                  ? "bg-yellow"
                  : "bg-muted"
            }`}
          />
          <span className="micro-strong">
            {lead.score >= 75
              ? "Hot"
              : lead.score >= 45
                ? "Qualifying"
                : "New"}
          </span>
        </div>
      </div>

      <p className="mt-3 text-[11.5px] leading-relaxed text-ink-2">
        {formatScoreReason(lead.scoreReason)}
      </p>

      <div className="mt-3">
        {fields.map((field) => (
          <div className="data-row" key={field.label}>
            <span className="micro">{field.label}</span>
            <span className="max-w-[70%] text-right text-[12px] font-medium text-ink">
              {field.value ?? "—"}
            </span>
          </div>
        ))}
        <div className="data-row">
          <span className="micro">Owner</span>
          <span className="text-right text-[12px] font-medium text-ink">
            {lead.owner?.name ?? "Unassigned"}
          </span>
        </div>
      </div>

      {lead.handoffRequested ? (
        <div className="mt-4 rounded-xl border border-blue/20 bg-blue-soft p-3">
          <p className="micro-strong text-blue-deep">Human handoff</p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            {lead.handoffSummary ?? "A human has been requested."}
          </p>
        </div>
      ) : null}
    </section>
  );
}