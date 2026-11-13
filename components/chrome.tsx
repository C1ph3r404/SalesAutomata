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
    <section className="relative mt-8 -mx-4 sm:-mx-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bottom.svg"
        alt=""
        aria-hidden="true"
        className="block h-auto w-full"
      />

      <div className="absolute inset-0 flex items-end">
        <div className="flex w-full flex-wrap items-end gap-x-8 gap-y-4 px-6 pb-[3.5%] pt-[6%] sm:px-10 sm:pl-[26%]">
          <div className="text-white">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
              Rating
            </p>
            <p className="num-lg mt-1 text-white">4.9</p>
          </div>

          <div className="text-white">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
              Type
            </p>
            <p className="num-lg mt-1 text-white">CORE</p>
          </div>

          <div className="min-w-[240px] flex-1 text-white">
            <p className="display text-[22px] leading-none text-white sm:text-[28px]">
              Proceed With Cautions
            </p>
            <p className="mt-2 max-w-[520px] text-[10.5px] leading-relaxed text-white/60 sm:text-[11.5px]">
              WhatsApp replies are free-form inside 24 hours. Outside that
              window, follow-ups must be pre-approved templates — timed and
              stopped on reply or opt-out.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="tag border-white/40 bg-transparent text-white">
                Adapt
              </span>
              <span className="tag border-white/40 bg-transparent text-white">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
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
      <div className="border-t border-line bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/n8n.svg"
          alt="n8n workflow"
          className="block h-auto w-full"
        />
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
