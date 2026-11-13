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

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-9">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-blue shadow-sm">
          PS-14 · Sales Closer
        </span>

        {!hasImage ? (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">
              AI WhatsApp
            </p>
            <h2 className="display mt-1 text-[clamp(64px,13vw,190px)] text-white">
              Closer
            </h2>
          </div>
        ) : null}
      </div>
    </section>
  );
}
