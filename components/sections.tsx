import Link from "next/link";
import { ArrowUpRight, Check, Zap } from "lucide-react";
import type { Lead, Message, Metrics } from "@/lib/types";
import { formatTime } from "@/lib/format";
import { DiamondMark, GlobeCard } from "@/components/chrome";
import { EmptyBlock, StatusPill, stageTone } from "@/components/ui";
import { ChatThread } from "@/components/chat-thread";

export function TitleRow({ metrics }: { metrics: Metrics }) {
  return (
    <section className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-ink text-white">
            <Zap className="h-3 w-3" strokeWidth={2.6} />
          </span>
          <p className="micro-strong">Al-Noor Realty</p>
          <span className="tag tag-blue">Live</span>
        </div>
        <h1 className="display mt-3 text-[clamp(40px,6vw,72px)] text-ink">
          Knight of the Inbox
        </h1>
      </div>

      <div className="w-[240px] shrink-0">
        <p className="display text-[28px] leading-none text-ink">Follow-up</p>
        <div className="rule mt-3" />
        <p className="micro mt-2.5">
          Auto cadence · {metrics.followups.pending} pending
        </p>
      </div>
    </section>
  );
}

export function InfoA({ metrics }: { metrics: Metrics }) {
  return (
    <div className="panel p-5">
      <p className="micro">Median first reply</p>
      <p className="num-xl mt-3 text-ink">
        {metrics.medianFirstReplySeconds}s
      </p>
      <p className="micro mt-2">{metrics.leads.total} leads in workspace</p>

      <div className="rule-soft my-4" />

      <p className="text-[12px] leading-snug text-muted">
        Reply instantly, qualify every lead, and book viewings automatically.
      </p>

      <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
        <div>
          <p className="num-lg text-ink">{metrics.appointments.today}</p>
          <p className="micro mt-1">Viewings booked</p>
        </div>
        <span className="tag tag-ghost">Today</span>
      </div>
    </div>
  );
}

export function InfoB({ metrics }: { metrics: Metrics }) {
  const rows = [
    {
      label: "Estimation",
      value: `${metrics.qualificationRate}%`,
      note: "Qualification rate",
    },
    {
      label: "Approx",
      value: `${metrics.bookingRate}%`,
      note: "Booking rate",
    },
    {
      label: "Cadence",
      value: `${metrics.followups.pending}`,
      note: "Follow-ups due",
    },
  ];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <p className="micro-strong">Estimation</p>
        <DiamondMark />
      </div>

      <div className="mt-1">
        {rows.map((row) => (
          <div className="data-row" key={row.label}>
            <span className="micro">{row.label}</span>
            <span className="text-right">
              <span className="num-lg mr-2 text-[22px] text-ink">
                {row.value}
              </span>
              <span className="micro">{row.note}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-paper px-3 py-2.5">
        <span className="text-[11px] font-semibold text-ink-2">
          Auto follow-up cadence
        </span>
        <span className="tag tag-ghost">
          {metrics.followups.pending > 0 ? "Active" : "Idle"}
        </span>
      </div>

      <GlobeCard />
    </div>
  );
}

export function PipelineStrip({ leads }: { leads: Lead[] }) {
  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="micro-strong">Pipeline · Live</p>
        <Link
          href="/leads"
          className="micro-strong flex items-center gap-1 text-ink transition-opacity hover:opacity-60"
        >
          View all
          <ArrowUpRight className="h-3 w-3" strokeWidth={2.6} />
        </Link>
      </div>

      {leads.length === 0 ? (
        <EmptyBlock label="No leads yet. Create one or reset the demo." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {leads.slice(0, 4).map((lead) => (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="panel block p-4 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="micro">Lead · {formatTime(lead.updatedAt)}</p>
                  <p className="mt-2 truncate text-[15px] font-bold tracking-tight text-ink">
                    {lead.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11.5px] text-muted">
                    {lead.requirement ?? "No requirement"}
                  </p>
                </div>
                <StatusPill tone={stageTone(lead.stage)}>
                  {lead.stage}
                </StatusPill>
              </div>

              <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
                <div>
                  <p className="num-lg text-ink">{lead.score}</p>
                  <p className="micro mt-1">Score</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {lead.source}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function ChatPanel({
  messages,
  leadName,
  leadInitials,
  booked,
}: {
  messages: Message[];
  leadName?: string;
  leadInitials?: string;
  booked?: boolean;
}) {
  return (
    <section className="panel flex h-full flex-col p-4">
      <div className="flex items-center justify-between">
        <p className="micro-strong">Conversation</p>
        <span className="tag tag-blue">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live
        </span>
      </div>

      <div className="mt-4 flex-1">
        <ChatThread
          messages={messages}
          leadName={leadName}
          leadInitials={leadInitials}
          emptyText="No active conversation yet."
        />
      </div>

      <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3">
        <Check className="h-3 w-3 text-blue" strokeWidth={3} />
        <p className="text-[10.5px] font-medium text-muted">
          {booked
            ? `${leadName ?? "Lead"} has booked a viewing`
            : `${leadName ?? "Lead"} · ${messages.length} messages`}
        </p>
      </div>
    </section>
  );
}
