import Link from "next/link";
import { ArrowUpRight, Check, Zap } from "lucide-react";
import { bubbles, leads, metaRows } from "@/lib/data";
import { DiamondMark, GlobeCard } from "@/components/chrome";
import { StatusPill, stageTone } from "@/components/ui";

export function TitleRow() {
  return (
    <section className="mt-9 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-ink text-white">
            <Zap className="h-3 w-3" strokeWidth={2.6} />
          </span>
          <p className="micro-strong">Al-Noor Realty //</p>
          <span className="tag tag-blue">Live</span>
        </div>
        <h1 className="display mt-3 text-[clamp(42px,7vw,84px)] text-ink">
          Knight of the Inbox
        </h1>
      </div>

      <div className="w-[240px] shrink-0">
        <p className="display text-[30px] leading-none text-ink">Follow-up</p>
        <div className="rule mt-3" />
        <p className="micro mt-2.5">Auto cadence · 6 steps</p>
      </div>
    </section>
  );
}

export function InfoA() {
  return (
    <div className="panel p-5">
      <p className="micro">Median first reply</p>
      <p className="num-xl mt-3 text-ink">6s</p>
      <p className="micro mt-2">// 033</p>

      <div className="rule-soft my-4" />

      <p className="script">آج کی لید ہی کل کی فروخت ہے۔</p>

      <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
        <div>
          <p className="num-lg text-ink">9</p>
          <p className="micro mt-1">Viewings booked</p>
        </div>
        <span className="tag tag-ghost">Today</span>
      </div>
    </div>
  );
}

export function InfoB() {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <p className="micro-strong">Estimation</p>
        <DiamondMark />
      </div>

      <div className="mt-1">
        {metaRows.map((row) => (
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
        <span className="flex items-center gap-2 text-[11px] font-semibold text-ink-2">
          <DiamondMark />
          Straight Blast
        </span>
        <span className="tag tag-ghost">Armed</span>
      </div>

      <GlobeCard />
    </div>
  );
}

export function PipelineStrip() {
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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {leads.slice(0, 4).map((lead) => (
          <Link key={lead.id} href="/leads" className="panel block p-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="micro">Lead · {lead.time}</p>
                <p className="mt-2 truncate text-[15px] font-bold tracking-tight text-ink">
                  {lead.name}
                </p>
                <p className="mt-0.5 truncate text-[11.5px] text-muted">
                  {lead.requirement}
                </p>
              </div>
              <StatusPill tone={stageTone(lead.stage)}>{lead.stage}</StatusPill>
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
    </section>
  );
}

const bubbleTone: Record<string, string> = {
  blue: "bubble-blue",
  dark: "bubble-dark",
  paper: "bubble-paper",
};

function AvatarDot({ initials, tone }: { initials: string; tone: string }) {
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9px] font-bold ${
        tone === "blue"
          ? "bg-white/20 text-white ring-1 ring-white/40"
          : "bg-ink text-white"
      }`}
    >
      {initials}
    </span>
  );
}

export function ChatPanel() {
  return (
    <section className="panel flex h-full flex-col p-4">
      <div className="flex items-center justify-between">
        <p className="micro-strong">Conversation</p>
        <span className="tag tag-blue">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live
        </span>
      </div>

      <div className="mt-4 flex-1 space-y-2.5">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className={`flex items-end gap-2 ${
              b.tone === "dark" ? "" : "justify-end"
            }`}
          >
            {b.tone === "dark" ? (
              <AvatarDot initials="Me" tone="dark" />
            ) : null}
            <div className={`bubble ${bubbleTone[b.tone]}`}>
              <p className="text-[12.5px] font-medium">{b.text}</p>
              <p className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.14em] opacity-70">
                {b.meta}
              </p>
            </div>
            {b.tone !== "dark" ? (
              <AvatarDot initials="AR" tone="blue" />
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3">
        <Check className="h-3 w-3 text-blue" strokeWidth={3} />
        <p className="text-[10.5px] font-medium text-muted">
          Ahmed has booked a viewing
        </p>
      </div>
    </section>
  );
}
