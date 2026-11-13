import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  MessageSquare,
  PhoneCall,
  Repeat2,
  Sparkles,
  Zap,
} from "lucide-react";

const stats = [
  { value: "3.2x", label: "More replies", icon: MessageSquare },
  { value: "68%", label: "Leads qualified", icon: BadgeCheck },
  { value: "41%", label: "Bookings made", icon: CalendarCheck2 },
  { value: "24/7", label: "Always on", icon: PhoneCall },
];

const flow = [
  {
    title: "Lead comes in",
    desc: "Inbound from WhatsApp, web forms, socials, ads.",
    icon: Zap,
  },
  {
    title: "AI qualifies instantly",
    desc: "Asks the right questions and scores every lead.",
    icon: Sparkles,
  },
  {
    title: "Follow-ups that don't quit",
    desc: "Timed cadence keeps warm leads engaged.",
    icon: Repeat2,
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      {/* Top bar */}
      <header className="flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-bold tracking-tight">SalesAutomata</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
              AI Closer
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-[13px] font-medium text-ink-2 md:flex">
          <a href="#pipeline" className="hover:text-brand">
            Pipeline
          </a>
          <a href="#how" className="hover:text-brand">
            How it works
          </a>
          <a href="#offer" className="hover:text-brand">
            Offer
          </a>
        </nav>

        <a
          href="#offer"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-brand-dark"
        >
          Get started <ArrowRight className="h-4 w-4" />
        </a>
      </header>

      {/* Hero */}
      <section className="mt-6 overflow-hidden rounded-[28px] border border-line bg-panel">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-6 p-7 sm:p-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
              <Sparkles className="h-3.5 w-3.5" /> AI Sales Closer
            </div>
            <div>
              <h1 className="text-[clamp(34px,5vw,58px)] font-bold leading-[0.98] tracking-tight">
                Every lead
                <br />
                becomes a
                <br />
                <span className="text-brand">closed deal.</span>
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-2">
                SalesAutomata replies instantly, qualifies every lead, follows
                up automatically, and books appointments — so your team only
                talks to serious buyers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#offer"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-brand-dark"
              >
                Close more leads <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-[13px] font-semibold text-ink transition hover:bg-paper"
              >
                See how it works
              </a>
            </div>

            <div className="flex items-center gap-3 text-[12px] text-muted">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              Trusted by real-estate, auto &amp; insurance teams
            </div>
          </div>

          <div className="relative min-h-[280px] bg-brand">
            {/* Reference art pilled into the hero panel */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero.jpg"
              alt="AI sales closer illustration"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-line bg-panel p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                {s.label}
              </p>
              <s.icon className="h-4 w-4 text-brand" strokeWidth={2.2} />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight">
              {s.value}
            </p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section id="how" className="mt-6 rounded-[28px] border border-line bg-panel p-7 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="micro text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              How it works
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              From enquiry to booked slot
            </h2>
          </div>
          <a
            href="#offer"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand hover:text-brand-dark"
          >
            Try it on your leads <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {flow.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl bg-paper p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
                <step.icon className="h-5 w-5" strokeWidth={2.1} />
              </div>
              <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.14em] text-muted">
                Step {i + 1}
              </p>
              <p className="mt-1 text-[15px] font-bold tracking-tight">
                {step.title}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-ink-2">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Offer / CTA */}
      <section
        id="offer"
        className="mt-6 overflow-hidden rounded-[28px] bg-ink text-paper"
      >
        <div className="grid gap-8 p-8 sm:grid-cols-2 sm:p-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
              Ready when you are
            </p>
            <h2 className="mt-2 text-[clamp(28px,4vw,44px)] font-bold leading-[1] tracking-tight">
              Turn your inbox
              <br />
              into revenue.
            </h2>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-paper/75">
              Connect your WhatsApp and let SalesAutomata handle the replies,
              qualification and follow-ups — while you close.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/60">
                Starter plan
              </p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold">₹0</span>
                <span className="text-sm text-paper/60">/ month to start</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-[12px] text-paper/80">
                <li>· Up to 100 AI conversations</li>
                <li>· Auto follow-ups &amp; booking</li>
                <li>· Lead scoring &amp; routing</li>
              </ul>
              <a
                href="#lead-form"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-brand-dark"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-[11px] text-muted">
        <span>© {new Date().getFullYear()} SalesAutomata</span>
        <span>Real estate · Auto · Insurance · Education</span>
      </footer>
    </main>
  );
}
