import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { SiteIcon, type SiteIconName } from "../components/SiteIcon";
import { useHorizontalRailState } from "../lib/useHorizontalRailState";
import { useHorizontalTouchScroll } from "../lib/useHorizontalTouchScroll";

const whyChooseItems = [
  {
    id: "fast",
    number: "01",
    iconName: "bolt" as const,
    title: "تنفيذ فوري",
    description: "طلبك يبدأ خلال دقائق من التأكيد بدون أي تأخير",
    borderClass: "md:hover:border-primary/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(208,188,255,0.08)]",
    overlayClass: "from-primary/[0.04]",
    iconClass: "bg-primary/10 border-primary/20 text-primary",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(208,188,255,0.2)]",
  },
  {
    id: "safe",
    number: "02",
    iconName: "shield" as const,
    title: "أمان كامل",
    description: "حساباتك محمية ولا نطلب أي بيانات سرية مطلقاً",
    borderClass: "md:hover:border-[#3b82f6]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(59,130,246,0.08)]",
    overlayClass: "from-[#3b82f6]/[0.04]",
    iconClass: "bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#3b82f6]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
  },
  {
    id: "support",
    number: "03",
    iconName: "headset_mic" as const,
    title: "دعم ٢٤/٧",
    description: "فريق متخصص جاهز لمساعدتك في أي وقت تحتاجه",
    borderClass: "md:hover:border-[#10b981]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(16,185,129,0.08)]",
    overlayClass: "from-[#10b981]/[0.04]",
    iconClass: "bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]",
  },
  {
    id: "payments",
    number: "04",
    iconName: "payments" as const,
    title: "دفع مرن",
    description: "ندعم التحويل البنكي والكاش حسب ما يناسبك",
    borderClass: "md:hover:border-[#f59e0b]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(245,158,11,0.08)]",
    overlayClass: "from-[#f59e0b]/[0.04]",
    iconClass: "bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  },
  {
    id: "quality",
    number: "05",
    iconName: "workspace_premium" as const,
    title: "جودة مضمونة",
    description: "ضمان زارز الملكي على كل خدمة نقدّمها لك",
    borderClass: "md:hover:border-[#e11d48]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(225,29,72,0.08)]",
    overlayClass: "from-[#e11d48]/[0.04]",
    iconClass: "bg-[#e11d48]/10 border-[#e11d48]/20 text-[#e11d48]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(225,29,72,0.2)]",
  },
  {
    id: "results",
    number: "06",
    iconName: "trending_up" as const,
    title: "نتائج حقيقية",
    description: "خدمات فعلية بنتائج ملموسة وقابلة للقياس",
    borderClass: "md:hover:border-[#8b5cf6]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(139,92,246,0.08)]",
    overlayClass: "from-[#8b5cf6]/[0.04]",
    iconClass: "bg-[#8b5cf6]/10 border-[#8b5cf6]/20 text-[#8b5cf6]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]",
  },
] as const;

type FaqEntry = {
  question: string;
  answer: string;
};

type WhyChooseItem = (typeof whyChooseItems)[number];

function FaqItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: FaqEntry;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`perf-card faq-mobile-card cyber-glass-card rounded-2xl overflow-hidden border transition-[border-color,background-color,box-shadow] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
        isOpen
          ? "border-[#e11d48]/30 bg-[#e11d48]/5 shadow-[0_4px_30px_rgba(225,29,72,0.1)]"
          : "border-outline-variant/10 bg-surface-container-low/30 md:hover:border-outline-variant/30"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-6 text-start"
      >
        <h3 className="text-lg font-bold text-on-surface">{faq.question}</h3>
        <SiteIcon
          name={isOpen ? "remove" : "add"}
          className={`origin-center transition-[transform,color] duration-[380ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "rotate-180 text-[#e11d48]" : "rotate-0 text-[#0ea5e9]"}`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-[460ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`px-6 pb-6 text-[#cbc3d9] leading-relaxed transition-[transform,opacity] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            }`}
          >
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqAccordion({
  faqs,
}: {
  faqs: FaqEntry[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 text-start">
      {faqs.map((faq, idx) => (
        <React.Fragment key={idx}>
          <FaqItem
            faq={faq}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

function WhyChooseCard({ item }: { item: WhyChooseItem }) {
  return (
    <div
      className={`perf-card why-choose-mobile-card group relative overflow-hidden rounded-[1.25rem] border border-outline-variant/10 bg-surface-container-low/60 p-5 transition-[transform,opacity,border-color,background-color,box-shadow] duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] md:p-7 md:duration-500 ${item.borderClass} ${item.shadowClass} md:hover:-translate-y-1.5`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.overlayClass} to-transparent opacity-0 transition-opacity duration-300 md:group-hover:opacity-100`} />
      <div className="pointer-events-none absolute top-4 left-4 select-none text-[3.5rem] leading-none font-black text-white/[0.03]">
        {item.number}
      </div>
      <div className="relative z-10">
        <div
          className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 md:group-hover:scale-110 ${item.iconClass} ${item.iconGlowClass}`}
        >
          <SiteIcon name={item.iconName} className="text-[22px]" />
        </div>
        <h4 className="mb-2 text-sm font-black text-on-surface md:text-[15px]">{item.title}</h4>
        <p className="text-xs leading-relaxed text-outline md:text-[13px]">{item.description}</p>
      </div>
    </div>
  );
}

const techLogoNames = [
  { id: "nova", label: "NOVA", iconName: "rocket_launch" },
  { id: "luma", label: "LUMA", iconName: "bolt" },
  { id: "vera", label: "VERA", iconName: "verified" },
  { id: "nexa", label: "NEXA", iconName: "trending_up" },
  { id: "orbit", label: "ORBIT", iconName: "groups" },
  { id: "arc", label: "ARC", iconName: "code" },
  { id: "vanta", label: "VANTA", iconName: "shield" },
  { id: "mono", label: "MONO", iconName: "storefront" },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  iconName: SiteIconName;
}>;

const desktopTechLogos = techLogoNames.map((logo) => (
  <div key={logo.id} className="group flex items-center gap-4 md:gap-8">
    <span className="font-black text-xl md:text-3xl tracking-[0.25em] text-white opacity-80 font-headline drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
      {logo.label}

const whyChooseItems = [
  {
    id: "fast",
    number: "01",
    iconName: "bolt" as const,
    title: "تنفيذ فوري",
    description: "طلبك يبدأ خلال دقائق من التأكيد بدون أي تأخير",
    borderClass: "md:hover:border-primary/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(208,188,255,0.08)]",
    overlayClass: "from-primary/[0.04]",
    iconClass: "bg-primary/10 border-primary/20 text-primary",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(208,188,255,0.2)]",
  },
  {
    id: "safe",
    number: "02",
    iconName: "shield" as const,
    title: "أمان كامل",
    description: "حساباتك محمية ولا نطلب أي بيانات سرية مطلقاً",
    borderClass: "md:hover:border-[#3b82f6]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(59,130,246,0.08)]",
    overlayClass: "from-[#3b82f6]/[0.04]",
    iconClass: "bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#3b82f6]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
  },
  {
    id: "support",
    number: "03",
    iconName: "headset_mic" as const,
    title: "دعم ٢٤/٧",
    description: "فريق متخصص جاهز لمساعدتك في أي وقت تحتاجه",
    borderClass: "md:hover:border-[#10b981]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(16,185,129,0.08)]",
    overlayClass: "from-[#10b981]/[0.04]",
    iconClass: "bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]",
  },
  {
    id: "payments",
    number: "04",
    iconName: "payments" as const,
    title: "دفع مرن",
    description: "ندعم التحويل البنكي والكاش حسب ما يناسبك",
    borderClass: "md:hover:border-[#f59e0b]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(245,158,11,0.08)]",
    overlayClass: "from-[#f59e0b]/[0.04]",
    iconClass: "bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  },
  {
    id: "quality",
    number: "05",
    iconName: "workspace_premium" as const,
    title: "جودة مضمونة",
    description: "ضمان زارز الملكي على كل خدمة نقدّمها لك",
    borderClass: "md:hover:border-[#e11d48]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(225,29,72,0.08)]",
    overlayClass: "from-[#e11d48]/[0.04]",
    iconClass: "bg-[#e11d48]/10 border-[#e11d48]/20 text-[#e11d48]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(225,29,72,0.2)]",
  },
  {
    id: "results",
    number: "06",
    iconName: "trending_up" as const,
    title: "نتائج حقيقية",
    description: "خدمات فعلية بنتائج ملموسة وقابلة للقياس",
    borderClass: "md:hover:border-[#8b5cf6]/30",
    shadowClass: "md:hover:shadow-[0_16px_40px_rgba(139,92,246,0.08)]",
    overlayClass: "from-[#8b5cf6]/[0.04]",
    iconClass: "bg-[#8b5cf6]/10 border-[#8b5cf6]/20 text-[#8b5cf6]",
    iconGlowClass: "md:group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]",
  },
] as const;

type FaqEntry = {
  question: string;
  answer: string;
};

type WhyChooseItem = (typeof whyChooseItems)[number];

function FaqItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: FaqEntry;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`perf-card faq-mobile-card cyber-glass-card rounded-2xl overflow-hidden border transition-[border-color,background-color,box-shadow] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
        isOpen
          ? "border-[#e11d48]/30 bg-[#e11d48]/5 shadow-[0_4px_30px_rgba(225,29,72,0.1)]"
          : "border-outline-variant/10 bg-surface-container-low/30 md:hover:border-outline-variant/30"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-6 text-start"
      >
        <h3 className="text-lg font-bold text-on-surface">{faq.question}</h3>
        <SiteIcon
          name={isOpen ? "remove" : "add"}
          className={`origin-center transition-[transform,color] duration-[380ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "rotate-180 text-[#e11d48]" : "rotate-0 text-[#0ea5e9]"}`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-[460ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`px-6 pb-6 text-[#cbc3d9] leading-relaxed transition-[transform,opacity] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            }`}
          >
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqAccordion({
  faqs,
}: {
  faqs: FaqEntry[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 text-start">
      {faqs.map((faq, idx) => (
        <React.Fragment key={idx}>
          <FaqItem
            faq={faq}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

function WhyChooseCard({ item }: { item: WhyChooseItem }) {
  return (
    <div
      className={`perf-card why-choose-mobile-card group relative overflow-hidden rounded-[1.25rem] border border-outline-variant/10 bg-surface-container-low/60 p-5 transition-[transform,opacity,border-color,background-color,box-shadow] duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] md:p-7 md:duration-500 ${item.borderClass} ${item.shadowClass} md:hover:-translate-y-1.5`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.overlayClass} to-transparent opacity-0 transition-opacity duration-300 md:group-hover:opacity-100`} />
      <div className="pointer-events-none absolute top-4 left-4 select-none text-[3.5rem] leading-none font-black text-white/[0.03]">
        {item.number}
      </div>
      <div className="relative z-10">
        <div
          className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 md:group-hover:scale-110 ${item.iconClass} ${item.iconGlowClass}`}
        >
          <SiteIcon name={item.iconName} className="text-[22px]" />
        </div>
        <h4 className="mb-2 text-sm font-black text-on-surface md:text-[15px]">{item.title}</h4>
        <p className="text-xs leading-relaxed text-outline md:text-[13px]">{item.description}</p>
      </div>
    </div>
  );
}

const techLogoNames = [
  { id: "nova", label: "NOVA", iconName: "rocket_launch" },
  { id: "luma", label: "LUMA", iconName: "bolt" },
  { id: "vera", label: "VERA", iconName: "verified" },
  { id: "nexa", label: "NEXA", iconName: "trending_up" },
  { id: "orbit", label: "ORBIT", iconName: "groups" },
  { id: "arc", label: "ARC", iconName: "code" },
  { id: "vanta", label: "VANTA", iconName: "shield" },
  { id: "mono", label: "MONO", iconName: "storefront" },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  iconName: SiteIconName;
}>;

const desktopTechLogos = techLogoNames.map((logo) => (
  <div key={logo.id} className="group flex items-center gap-4 md:gap-8">
    <span className="font-black text-xl md:text-3xl tracking-[0.25em] text-white opacity-80 font-headline drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
      {logo.label}
    </span>
    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/40"></span>
  </div>
));

const mobileTechLogos = (
  <div className="flex items-center justify-center whitespace-nowrap text-white/[0.24]">
    <span className="font-black text-[0.78rem] tracking-[0.22em] font-headline [text-shadow:0_1px_0_rgba(255,255,255,0.05),0_-1px_0_rgba(0,0,0,0.55)]">
      WRAITH
    </span>
  </div>
);

const Section = React.memo(
  ({ children, className, id, ...props }: React.ComponentProps<"section">) => {
    return (
      <section id={id} className={className} {...props}>
        {children}
      </section>
    );
  }
);

export function Home() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const railIndicatorRef = useRef<HTMLDivElement>(null);
  useHorizontalTouchScroll(scrollContainerRef);
  const { isAtStart, isAtEnd } = useHorizontalRailState(scrollContainerRef, {
    onProgress: (progress) => {
      if (!railIndicatorRef.current) return;
      railIndicatorRef.current.style.transform = `translateX(${(-192 * progress).toFixed(2)}px)`;
    },
  });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.state && (location.state as any).scrollToFaq) {
      const timer = window.setTimeout(() => {
        const faqSection = document.getElementById('faq');
        if (faqSection) faqSection.scrollIntoView({ behavior: 'smooth' });

        const currentHistoryState = window.history.state;
        const nextHistoryState =
          currentHistoryState && typeof currentHistoryState === "object"
            ? { ...currentHistoryState, usr: null }
            : currentHistoryState;

        window.history.replaceState(
          nextHistoryState,
          document.title,
          `${location.pathname}${location.search}`,
        );
      }, 100);

      return () => window.clearTimeout(timer);
    }
  }, [location.pathname, location.search, location.state]);

  return (
    <div className="home-mobile-page pt-12 md:pt-14">
      {/* Hero Section */}
      <Section className="relative min-h-0 overflow-hidden px-4 pb-2 pt-16 sm:px-6 sm:py-10 md:px-12 md:py-12 lg:py-20">
        <div className="absolute inset-0 z-0">
          <img
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20"
            src="/assets/hero-ambient.svg"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-background/50"></div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-background/70 to-background sm:h-28"></div>
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-stretch justify-between gap-10 lg:flex-row lg:items-center xl:gap-16">

          {/* Main Hero Text */}
          <div className="mx-auto flex w-full max-w-[22rem] flex-1 min-w-0 flex-col text-right lg:mx-0 lg:max-w-none lg:text-start" dir="rtl">
            <h1 className="mb-5 px-1 text-[1.92rem] font-black font-headline text-on-background leading-[1.18] tracking-[-0.02em] text-glow sm:mb-5 sm:max-w-[21rem] sm:px-0 sm:text-[2.2rem] sm:leading-[1.2] md:mb-6 md:max-w-none md:text-4xl md:leading-tight xl:text-6xl">
              تسوق كل ما تحتاجه في <br className="hidden sm:block" />
              <span className="mt-1 block text-primary not-italic md:mt-0 md:italic">مكان واحد</span>
            </h1>
            <p className="mb-7 px-1 text-[0.95rem] leading-7 text-outline sm:mb-8 sm:max-w-[22rem] sm:px-0 sm:text-[0.98rem] md:max-w-2xl md:text-base xl:text-lg">
              مرحباً بك في زارز، وجهتك الأولى للخدمات الرقمية. نوفر لك شحن ألعاب فوري، اشتراكات الذكاء الاصطناعي، خدمات زيادة المتابعين، وتطوير المتاجر بأفضل الأسعار وأسرع تنفيذ.
            </p>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-4 md:justify-start md:gap-6">
              <Link
                to="/products"
                className="primary-gradient w-full rounded-full px-8 py-4 text-center text-base font-bold text-on-primary transition-all scale-100 active:scale-95 hover:shadow-[0_0_30px_rgba(208,188,255,0.4)] sm:min-w-[12rem] sm:w-auto md:px-10 md:py-5 md:text-lg"
              >
                عروضنا الحصرية
              </Link>
              <Link
                to="/contact"
                className="w-full rounded-full border-[1.5px] border-outline/40 px-8 py-4 text-center text-base text-on-background transition-all hover:bg-white/5 sm:min-w-[12rem] sm:w-auto md:px-10 md:py-5 md:text-lg"
              >
                تواصل معنا
              </Link>
            </div>
          </div>

          {/* Features Vertical Card */}
          <div className="perf-panel w-full lg:w-[340px] xl:w-[380px] shrink-0 cyber-glass-card rounded-[2rem] p-6 xl:p-8 border border-white/5 bg-surface/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative hidden lg:block">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="flex justify-start mb-6">
              <span className="bg-[#9f1239]/40 border border-[#e11d48]/30 text-[#fda4af] font-bold text-xs px-4 py-2 rounded-full backdrop-blur-md">
                الأكثر طلباً هذا الأسبوع
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-on-background leading-tight mb-4 text-start tracking-tight">
              تجربة أسرع وأوضح للطلبات الرقمية
            </h3>

            <p className="text-[#a1a1aa] text-sm leading-relaxed mb-8 text-start font-medium">
              اختر الخدمة، أرسل بياناتك، وتابع التنفيذ من نفس المكان بدون خطوات معقدة.
            </p>

            <div className="space-y-4">
              {/* Feature 1 */}
              <div className="perf-card p-4 rounded-[1.25rem] bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#e11d48] shrink-0 flex items-center justify-center text-white text-2xl font-black shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                  #
                </div>
                <div className="text-start">
                  <h4 className="font-bold text-on-surface mb-1 text-sm">نمو للحسابات والتفاعل</h4>
                  <p className="text-xs text-outline line-clamp-1">باقات سوشيال ميديا مناسبة للبدء أو التوسع</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="perf-card p-4 rounded-[1.25rem] bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#3b82f6] shrink-0 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                  <SiteIcon name="bolt" className="text-2xl" />
                </div>
                <div className="text-start">
                  <h4 className="font-bold text-on-surface mb-1 text-sm">شحن واشتراكات مباشرة</h4>
                  <p className="text-xs text-outline line-clamp-1">تأكيد سريع ومتابعة عبر واتساب أو الهاتف</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="perf-card p-4 rounded-[1.25rem] bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#10b981] shrink-0 flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <SiteIcon name="laptop_mac" className="text-2xl" />
                </div>
                <div className="text-start">
                  <h4 className="font-bold text-on-surface mb-1 text-sm">تنفيذ مواقع ومتاجر حسب الطلب</h4>
                  <p className="text-xs text-outline line-clamp-1">من التعديل السريع إلى المشروع الكامل</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-5 select-none pointer-events-none hidden lg:block">
          <span className="text-[25rem] font-black font-headline tracking-tighter">ZARZ</span>
        </div>
      </Section>

      <FeaturedProducts />

      {/* Services Grid (Horizontal Carousel) */}
      <Section className="perf-mobile-section px-6 py-32 bg-surface-container-low md:px-12 relative overflow-hidden" data-perf-size="tall">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-background to-transparent pointer-events-none z-0 border-t border-background"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-0 border-b border-background"></div>
        
        <div className="home-mobile-glow absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-row justify-between items-end mb-12 gap-4">
            <div className="text-start">
              <span className="text-primary font-bold tracking-widest text-sm md:text-base uppercase block mb-1">تخصصاتنا</span>
              <h2 className="text-3xl md:text-5xl font-black font-headline text-on-background">أقسامنا الرئيسية</h2>
            </div>
            
            <div className="flex gap-2 md:gap-3 mb-1 md:hidden" dir="ltr">
              <button 
                onClick={scrollLeft}
                disabled={isAtEnd}
                className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all ${
                  !isAtEnd 
                    ? "bg-primary text-white md:hover:bg-primary/90 md:hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(208,188,255,0.4)]" 
                    : "border border-primary/20 bg-surface-container/50 backdrop-blur-md text-primary opacity-40 cursor-not-allowed"
                }`}
              >
                <SiteIcon name="chevron_left" className="text-2xl" />
              </button>
              <button 
                onClick={scrollRight}
                disabled={isAtStart}
                className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-all ${
                  !isAtStart 
                    ? "bg-primary text-white md:hover:bg-primary/90 md:hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(208,188,255,0.4)]" 
                    : "border border-primary/20 bg-surface-container/50 backdrop-blur-md text-primary opacity-40 cursor-not-allowed"
                }`}
              >
                <SiteIcon name="chevron_right" className="text-2xl" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="perf-mobile-horizontal-cards flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-proximity md:snap-none no-scrollbar pb-12 pt-4 px-4 -mx-4 md:px-0 md:-mx-0"
          >
            {[
              {
                id: "ai",
                title: "الذكاء الاصطناعي",
                description: "أتمتة ذكية وحلول تحليلية مبنية على أحدث تقنيات، لتطوير أعمالك بشكل غير مسبوق وتحقيق قفزات نوعية في الإنتاجية.",
                iconName: "neurology",
                link: "/products/catalog/ai",
                linkText: "تفاصيل الخدمة",
                badge: "حصري",
                subBadge: "Neural Core v2.0"
              },
              {
                id: "social",
                title: "إدارة المنصات",
                description: "نصنع محتوى يتفاعل معه العالم بأسلوب احترافي وجذاب يضمن وصول رسالتك للجمهور المستهدف.",
                iconName: "campaign",
                link: "/products/catalog/social",
                linkText: "تصفح الباقات"
              },
              {
                id: "gaming",
                title: "خدمات الألعاب",
                description: "شحن، اشتراكات، وأدوات احترافية لأفضل تجربة لعب. كل ما يحتاجه المحترفون في مكان واحد.",
                iconName: "sports_esports",
                link: "/products/catalog/gaming",
                linkText: "تصفح العروض"
              },
              {
                id: "web",
                title: "خدمات الويب",
                description: "برمجة وتصميم واجهات عصرية تضمن أفضل تجربة مستخدم وأداء فائق السرعة مع بنية تحتية رقمية متينة.",
                iconName: "terminal",
                link: "/products/catalog/web",
                linkText: "اكتشف المزيد",
                bgIcon: "code"
              }
            ].map((srv, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={srv.id}
                  className="block snap-start snap-always shrink-0 w-[280px] md:w-auto"
                  onClick={() => setActiveIndex(idx)}
                >
                  <div
                    className={`perf-panel cyber-glass-card rounded-[2.5rem] p-6 md:p-8 group relative flex h-[360px] md:h-[400px] w-full flex-col justify-between overflow-hidden transition-all duration-500 cursor-pointer ${
                      isActive 
                        ? "border-primary md:scale-[1.02] shadow-[0_20px_50px_rgba(208,188,255,0.15)] z-10" 
                        : "border-outline-variant/10 md:hover:border-primary/30 md:hover:-translate-y-1"
                    }`}
                    style={{ contain: "layout style" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] to-transparent opacity-0 transition-opacity duration-500 md:group-hover:opacity-100"></div>
                    
                    <div className={`main-service-card__bg mesh-gradient-bg transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}></div>
                    
                    {/* Top Right Arrow */}
                    <div className={`absolute top-6 left-6 p-2 rounded-xl border transition-colors z-20 ${
                      isActive ? "border-primary/50 text-white bg-primary/20" : "border-outline-variant/20 text-outline-variant md:group-hover:border-primary/30"
                    }`}>
                      <SiteIcon name="arrow_outward" className="text-lg" />
                    </div>

                    <div className="relative z-20">
                      <div className={`main-service-card__icon-shell icon-glow-container mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 ${
                        isActive ? "border-primary/40 bg-primary/20 scale-110 shadow-inner" : "border-white/10 bg-white/5"
                      }`}>
                        <SiteIcon
                          name={srv.iconName as SiteIconName}
                          className={`text-3xl transition-colors ${
                            isActive ? "text-primary drop-shadow-[0_0_15px_rgba(208,188,255,0.8)]" : "icon-gradient"
                          }`}
                        />
                      </div>
                      
                      {srv.badge && (
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`rounded-full border px-3 py-1 text-xs font-bold sm:backdrop-blur-md transition-colors ${
                            isActive ? "border-transparent bg-primary text-on-primary" : "border-primary/30 bg-primary/20 text-primary"
                          }`}>{srv.badge}</span>
                          {srv.subBadge && <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${
                            isActive ? "text-primary text-glow" : "text-primary/50"
                          }`}>{srv.subBadge}</span>}
                        </div>
                      )}
                      
                      <h3 className={`text-2xl md:text-3xl font-black mb-3 tracking-tight transition-colors ${
                        isActive ? "text-primary text-glow" : "text-on-background"
                      }`}>{srv.title}</h3>
                      
                      <p className={`text-sm md:text-base leading-relaxed line-clamp-3 transition-colors ${
                        isActive ? "text-white" : "text-outline"
                      }`}>
                        {srv.description}
                      </p>
                    </div>
                    
                    <div className="relative z-20 mt-auto pt-6 border-t border-outline-variant/10">
                      <Link to={srv.link} className={`main-service-card__link group/link inline-flex items-center gap-2 font-black transition-all duration-300 ${
                        isActive ? "text-primary gap-4 text-glow" : "text-on-surface md:hover:text-primary"
                      }`}>
                        <span className="text-sm md:text-base">{srv.linkText}</span>
                        <SiteIcon name="arrow_back" className="text-sm transition-transform duration-300 md:group-hover/link:-translate-x-1" />
                      </Link>
                    </div>
                    
                    {srv.bgIcon && (
                      <div className="hidden lg:block">
                        <SiteIcon
                          name={srv.bgIcon as SiteIconName}
                          className={`absolute -left-8 -bottom-8 select-none pointer-events-none rotate-12 transition-all duration-1000 ${
                            isActive ? "text-primary/10 text-[180px]" : "text-on-surface/5 text-[140px]"
                          }`}
                          strokeWidth={1.4}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="block md:hidden w-64 h-1.5 bg-outline-variant/10 rounded-full mx-auto mt-8 relative shadow-inner overflow-hidden" dir="rtl">
            <div
              ref={railIndicatorRef}
              className="home-mobile-rail-indicator absolute top-0 right-0 bottom-0 w-16 bg-primary rounded-full shadow-[0_0_8px_rgba(208,188,255,0.6)]"
              style={{ transform: "translateX(0px)" }}
            />
          </div>
        </div>
              <p className="text-lg md:text-xl text-[#cbc3d9] leading-relaxed max-w-2xl">
                سواء كنت تحتاج شحن ألعاب، نمو لحساباتك، أو متجر احترافي، البداية من هنا.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto shrink-0 pb-0 xl:pb-2">
              <a href="https://wa.me/201500007300" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-surface/50 backdrop-blur-md text-on-background border border-outline-variant/30 px-8 py-5 rounded-xl font-bold text-lg md:hover:bg-white/10 transition-all w-full sm:w-auto">
                <SiteIcon name="forum" className="text-xl" />
                تواصل عبر واتساب
              </a>
              <Link to="/products" className="primary-gradient text-on-primary font-bold px-8 py-5 rounded-xl text-lg md:hover:shadow-[0_0_30px_rgba(208,188,255,0.4)] transition-all scale-100 active:scale-95 text-center flex items-center justify-center gap-3 w-full sm:w-auto">
                استعرض المنتجات
                <SiteIcon name="arrow_back" className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
