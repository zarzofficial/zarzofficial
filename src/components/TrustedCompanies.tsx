import { memo } from "react";

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

const partnerMarqueeCycles = ["main", "loop-1", "loop-2", "loop-3"] as const;

const PartnerLogoItems = memo(function PartnerLogoItems({
  cycle,
  isDuplicate = false,
}: {
  cycle: string;
  isDuplicate?: boolean;
}) {
  return (
    <div
      className="partner-marquee-cycle flex shrink-0 items-center gap-10 pe-10 md:gap-12 md:pe-12 lg:gap-20 lg:pe-20"
      aria-hidden={isDuplicate ? "true" : undefined}
    >
      {partnerLogos.map((logo) => {
        const content = "logoSrc" in logo ? (
          <img
            src={logo.logoSrc}
            alt={logo.label}
            className="partner-marquee-logo h-8 w-auto max-w-[9rem] object-contain opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.28)] md:h-10 md:max-w-[12rem]"
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
          <div key={`${cycle}-${logo.id}`} className="group flex items-center gap-4 md:gap-8">
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
      })}
    </div>
  );
});

export const TrustedCompanies = memo(function TrustedCompanies({ className = "" }: { className?: string }) {
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

        <div
          className="partner-marquee-shell relative h-14 w-full overflow-hidden opacity-80 grayscale transition-opacity duration-300 active:grayscale-0 lg:hidden [--partner-marquee-duration:20s] [mask-image:linear-gradient(to_right,transparent_0,black_48px,black_calc(100%-48px),transparent_100%)]"
          dir="ltr"
        >
          <div className="absolute inset-0 flex items-center overflow-hidden">
            <div className="partner-marquee-track flex w-max items-center justify-start">
              {partnerMarqueeCycles.map((cycle, index) => (
                <PartnerLogoItems key={`mobile-${cycle}`} cycle={`mobile-${cycle}`} isDuplicate={index > 0} />
              ))}
            </div>
          </div>
        </div>

        <div
          className="partner-marquee-shell relative hidden h-16 w-full overflow-hidden bg-surface/0 opacity-70 grayscale transition-opacity duration-500 hover:grayscale-0 lg:block lg:[--partner-marquee-duration:28s] lg:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
          dir="ltr"
        >
          <div className="absolute inset-0 flex items-center overflow-hidden">
            <div className="partner-marquee-track flex w-max items-center justify-start">
              {partnerMarqueeCycles.map((cycle, index) => (
                <PartnerLogoItems key={`desktop-${cycle}`} cycle={`desktop-${cycle}`} isDuplicate={index > 0} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
