const partnerLogos = [
  {
    id: "honeytons",
    label: "Honeytons",
    href: "https://honeytons.com",
    logoSrc: "/assets/honeytons-logo.avif",
  },
  {
    id: "wraith",
    label: "WRAITH",
  },
] as const;

const partnerLogoItems = partnerLogos.map((logo) => {
  const content = "logoSrc" in logo ? (
    <img
      src={logo.logoSrc}
      alt={logo.label}
      className="h-8 w-auto max-w-[9rem] object-contain opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.28)] md:h-10 md:max-w-[12rem]"
      loading="lazy"
      decoding="async"
      width={160}
      height={48}
    />
  ) : (
    <span className="font-headline text-xl font-black tracking-[0.25em] text-white opacity-80 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] md:text-3xl">
      {logo.label}
    </span>
  );

  return (
    <div key={logo.id} className="group flex items-center gap-4 md:gap-8">
      {"href" in logo ? (
        <a
          href={logo.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${logo.label} website`}
          className="transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          {content}
        </a>
      ) : (
        content
      )}
      <span className="h-1.5 w-1.5 rounded-full bg-primary/40 md:h-2 md:w-2" />
    </div>
  );
});

export function TrustedCompanies({ className = "" }: { className?: string }) {
  return (
    <section className={`relative overflow-hidden px-6 py-16 md:px-12 md:py-20 ${className}`} dir="rtl">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 hidden h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px] lg:block" />
        <div className="absolute bottom-0 right-1/4 hidden h-[400px] w-[400px] rounded-full bg-tertiary/10 blur-[120px] lg:block" />
      </div>

      <div className="relative z-20 mx-auto w-full max-w-6xl">
        <div className="mb-10 flex flex-col items-center justify-center text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-[0_0_15px_rgba(208,188,255,0.1)] md:text-sm">
            <span className="relative mb-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 md:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            شركاء النجاح
          </div>
          <h2 className="max-w-none whitespace-nowrap font-headline text-[1.55rem] font-black leading-none sm:text-3xl md:text-5xl">
            <span className="inline text-on-background">شركات ملهمة</span>
            <span className="mr-2 inline bg-gradient-to-l from-primary to-[#8b5cf6] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(208,188,255,0.4)]">
              وثقت بنا
            </span>
          </h2>
        </div>

        <div className="select-none px-1 py-2 lg:hidden" dir="ltr">
          <div className="flex items-center justify-center opacity-80 grayscale [mask-image:linear-gradient(to_right,transparent_0,black_8%,black_92%,transparent_100%)]">
            <div className="flex items-center justify-center gap-6 whitespace-nowrap">
              {partnerLogoItems}
            </div>
          </div>
        </div>

        <div
          className="group relative hidden h-16 w-full overflow-hidden bg-surface/0 opacity-70 grayscale transition-all duration-700 hover:grayscale-0 lg:block lg:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
          dir="ltr"
        >
          <style>{`
            @keyframes partner-marquee-sweep {
              0% { transform: translate3d(100%, -50%, 0); }
              100% { transform: translate3d(calc(-100vw - 100%), -50%, 0); }
            }
            @media (min-width: 1024px) {
              .partner-marquee-track {
                animation: partner-marquee-sweep 24s linear infinite;
                will-change: transform;
              }
              .group:hover .partner-marquee-track {
                animation-play-state: paused;
              }
            }
          `}</style>
          <div className="partner-marquee-track absolute right-0 top-1/2 flex w-max items-center justify-start [&>div]:mx-6 lg:[&>div]:mx-10">
            {partnerLogoItems}
          </div>
        </div>
      </div>
    </section>
  );
}
