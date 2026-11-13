import { Check, Clock, Globe, Zap } from "lucide-react";

export function StatusBar() {
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
    <section className="band mt-4 overflow-hidden p-7 sm:p-9">
      <svg
        className="pointer-events-none absolute -left-4 bottom-0 h-[120px] w-[260px] opacity-90"
        viewBox="0 0 260 120"
        fill="none"
        aria-hidden="true"
      >
        <polygon points="0,120 40,20 70,20 20,120" fill="#fff" />
        <polygon points="70,120 120,0 150,0 100,120" fill="#fff" opacity="0.75" />
        <polygon points="150,120 210,30 240,30 180,120" fill="#fff" opacity="0.45" />
      </svg>

      <div className="relative flex flex-wrap gap-x-10 gap-y-7">
        <div>
          <p className="micro text-white/45">Rating</p>
          <p className="num-lg mt-2 text-white">4.9</p>
          <p className="micro mt-1.5 text-white/45">BOS</p>
        </div>

        <div>
          <p className="micro text-white/45">Type</p>
          <p className="num-lg mt-2 text-white">CORE</p>
          <p className="micro mt-1.5 flex items-center gap-1.5 text-white/45">
            Element
            <span className="inline-block h-2 w-2 rounded-full bg-blue" />
          </p>
        </div>

        <div className="min-w-[280px] flex-1">
          <p className="display text-[26px] leading-none text-white">
            Proceed With Cautions
          </p>
          <p className="mt-3 max-w-[540px] text-[11.5px] leading-relaxed text-white/60">
            WhatsApp only allows free-form replies inside a 24-hour customer
            window. Outside it, every touch must be a pre-approved template —
            which is why the follow-up cadence is template-driven, timed to
            quiet hours, and stops the moment a lead replies or opts out.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="micro text-white/45">
              Additional buildup abilities
            </span>
            <span className="tag border-white/40 bg-transparent text-white">
              Adapt
            </span>
            <span className="tag border-white/40 bg-transparent text-white">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
              Verified
            </span>
          </div>
        </div>

        <div className="hidden xl:block">
          <p className="num-xl text-white/[0.13]">01</p>
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
    <div className="mt-4 rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-ink" strokeWidth={2.2} />
        <p className="micro-strong">Work in Progress</p>
      </div>
      <p className="mt-2 text-[11.5px] leading-snug text-muted">
        Once the bot changes, don&apos;t look back.
      </p>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="num-lg">2H26M</p>
          <p className="micro mt-1">Time to book</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="tag tag-ghost">USD</span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-blue text-white shadow-[0_2px_0_0_var(--color-blue-deep)]">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        </div>
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
