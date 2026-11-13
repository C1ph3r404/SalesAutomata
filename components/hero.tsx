export function Hero() {
  return (
    <section className="relative mt-4 overflow-hidden rounded-[28px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero.jpg"
        alt="AI WhatsApp sales closer"
        className="block h-auto w-full"
      />

      {/* n8n element overlaid as in the reference composition */}
      <div className="pointer-events-none absolute bottom-4 right-4 w-[42%] max-w-[360px] sm:bottom-6 sm:right-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/n8n.svg"
          alt=""
          aria-hidden="true"
          className="block h-auto w-full drop-shadow-lg"
        />
      </div>
    </section>
  );
}
