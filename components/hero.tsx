import fs from "node:fs";
import path from "node:path";

export function Hero() {
  const hasImage = fs.existsSync(
    path.join(process.cwd(), "public", "hero.jpg"),
  );

  return (
    <section className="relative mt-4 h-[380px] overflow-hidden rounded-[36px] bg-blue sm:h-[440px]">
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/hero.jpg"
          alt="AI WhatsApp sales closer"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-blue" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5" />

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-9">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-blue shadow-sm backdrop-blur-sm">
          PS-14 · Sales Closer
        </span>

        <div className="flex items-end justify-between gap-4">
          <p className="max-w-[420px] text-[11px] font-bold uppercase tracking-[0.28em] text-white/90 drop-shadow-sm">
            Qualify · Score · Book · Follow up
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/n8n.svg"
            alt="n8n"
            className="hidden h-10 w-auto rounded-lg bg-white/90 p-1.5 shadow-sm backdrop-blur-sm sm:block"
          />
        </div>
      </div>
    </section>
  );
}
