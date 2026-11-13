import { Check, Clock, Webhook, Zap } from "lucide-react";
import type { Metrics } from "@/lib/types";

export function StatusBar(_props: { metrics?: Metrics }) {
  return (
    <section className="panel px-5 py-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[12.5px] font-medium text-ink-2">
          Syncing WhatsApp leads…
        </p>
        <span className="num-lg text-[14px] text-ink">70%</span>
      </div>

      <div className="track mt-3">
        <div className="fill" style={{ width: "70%" }} />
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">
        <Clock className="h-3 w-3 text-muted" strokeWidth={2.4} />
        <span className="text-[10.5px] font-medium text-muted">16 min left</span>
      </div>
    </section>
  );
}

export function FooterBand() {
  return (
    <section className="mt-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bottom.svg"
        alt="Proceed with cautions"
        className="block h-auto w-full"
      />
    </section>
  );
}

export function DiamondMark() {
  return (
    <span className="relative inline-block h-5 w-5" aria-hidden="true">
      <span className="absolute left-0 top-0 h-3.5 w-3.5 rotate-45 rounded-[3px] bg-blue" />
      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rotate-45 rounded-[3px] bg-yellow" />
    </span>
  );
}

export function GlobeCard() {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Webhook className="h-4 w-4 text-ink" strokeWidth={2.2} />
          <p className="micro-strong">n8n</p>
        </div>
        <span className="tag tag-ghost">Connected</span>
      </div>
      <div className="border-t border-line px-4 py-4">
        <p className="text-[11.5px] leading-snug text-muted">
          Workflow automation — trigger follow-ups, bookings and CRM sync from
          WhatsApp conversations.
        </p>
      </div>
    </div>
  );
}

export function BotMark() {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-blue text-white shadow-[0_2px_0_0_var(--color-blue-deep)]">
      <Zap className="h-[17px] w-[17px]" strokeWidth={2.4} />
    </span>
  );
}
