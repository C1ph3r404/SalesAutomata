export function Hero() {
  return (
    <section className="relative mt-4 h-[380px] overflow-hidden rounded-[36px] bg-blue sm:h-[440px]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hero-dots"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="4" cy="4" r="2.4" fill="#ffffff" opacity="0.4" />
          </pattern>
          <pattern
            id="hero-dots-fine"
            width="13"
            height="13"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.1" fill="#ffffff" opacity="0.28" />
          </pattern>
        </defs>

        <rect width="1200" height="520" fill="#2b5cff" />
        <rect width="1200" height="520" fill="url(#hero-dots)" opacity="0.5" />

        <circle cx="1020" cy="140" r="250" fill="#ffffff" opacity="0.12" />
        <circle cx="1020" cy="140" r="160" fill="#ffffff" opacity="0.14" />
        <circle cx="1020" cy="140" r="96" fill="#ffffff" opacity="0.16" />

        <polygon
          points="0,520 560,150 660,230 120,520"
          fill="#ffffff"
          opacity="0.1"
        />
        <polygon
          points="0,520 300,300 380,340 60,520"
          fill="#ffffff"
          opacity="0.08"
        />

        {/* angular spear */}
        <polygon
          points="884,40 962,14 936,206 898,186"
          fill="#ffffff"
          opacity="0.92"
        />
        <polygon
          points="962,14 1000,4 982,80 936,206"
          fill="#ffffff"
          opacity="0.35"
        />

        {/* speed lines */}
        <g stroke="#ffffff" strokeWidth="3" opacity="0.55">
          <line x1="120" y1="120" x2="420" y2="120" />
          <line x1="180" y1="160" x2="500" y2="160" opacity="0.4" />
          <line x1="90" y1="200" x2="340" y2="200" opacity="0.3" />
        </g>

        <rect
          x="0"
          y="440"
          width="1200"
          height="80"
          fill="url(#hero-dots-fine)"
          opacity="0.6"
        />
      </svg>

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-blue">
            PS-14 · Sales Closer
          </span>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 sm:block">
            01 / 04
          </span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">
              AI WhatsApp
            </p>
            <h2 className="display mt-1 text-[clamp(64px,13vw,190px)] text-white">
              Closer
            </h2>
          </div>

          <div className="hidden flex-col items-end gap-1.5 pb-2 md:flex">
            {["Qualified", "Scored", "Booked"].map((step, i) => (
              <span
                key={step}
                className="flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/75"
              >
                {step}
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                <span className="text-white/40">0{i + 1}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
