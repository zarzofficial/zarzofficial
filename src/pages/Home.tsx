import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { SiteIcon, type SiteIconName } from "../components/SiteIcon";
import { useCoarsePointer } from "../lib/useCoarsePointer";
import { useScrollReveal } from "../lib/useScrollReveal";
import { useDesktopViewport } from "../lib/useDesktopViewport";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── Mobile/Desktop Hero split ────────────────────────────────────────────────
// MobileHero: pure static HTML, zero framer-motion, no glow/blur elements.
// DesktopHero: full motion.* entrance animation.
// useIsMobile() picks the right one AFTER mount (useLayoutEffect), so:
//   · No window.innerWidth during render phase → no hydration mismatch
//   · No resize / matchMedia listeners
//   · framer-motion is never instantiated on mobile devices

function MobileHero() {
  return (
    <div
      className="mx-auto flex w-full max-w-[22rem] flex-1 min-w-0 flex-col text-right"
      dir="rtl"
    >
      <h1 className="mb-4 max-w-[20rem] px-1 text-[1.92rem] font-black font-headline text-on-background leading-[1.36] tracking-[-0.02em] sm:mb-5 sm:max-w-[21rem] sm:px-0 sm:text-[2.2rem] sm:leading-[1.32]">
        تسوق كل ما تحتاجه في
        <span className="mt-1 block text-[#a78bfa] not-italic">مكان واحد</span>
      </h1>
      <p className="mb-6 px-1 text-[0.95rem] leading-7 text-[#c4bcda] sm:mb-6 sm:max-w-[22rem] sm:px-0 sm:text-[0.98rem]">
        مرحباً بك في زارز، وجهتك الأولى للخدمات الرقمية. نوفر لك شحن ألعاب فوري، اشتراكات الذكاء الاصطناعي، خدمات زيادة المتابعين، وتطوير المتاجر بأفضل الأسعار وأسرع تنفيذ.
      </p>
      <div className="flex w-full px-1 sm:px-0">
        <Link
          to="/products"
          className="primary-gradient w-full max-w-[13.25rem] rounded-full px-4 py-2 text-center text-[0.82rem] font-bold text-on-primary active:scale-95 sm:min-w-[12rem] sm:w-auto sm:max-w-none sm:px-8 sm:py-3.5 sm:text-base"
        >
          عروضنا الحصرية
        </Link>
      </div>
    </div>
  );
}

function DesktopHero() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
      }}
      className="mx-auto flex w-full max-w-[22rem] flex-1 min-w-0 flex-col text-right lg:mx-0 lg:max-w-none lg:text-start"
      dir="rtl"
    >
      <motion.h1
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
        className="mb-4 px-1 text-[1.92rem] font-black font-headline text-on-background leading-[1.3] tracking-[-0.02em] sm:mb-5 sm:max-w-[21rem] sm:px-0 sm:text-[2.2rem] sm:leading-[1.3] md:mb-6 md:max-w-none md:text-5xl xl:text-6xl md:leading-[1.3] md:tracking-tight"
      >
        تسوق كل ما تحتاجه في <br className="hidden sm:block" />
        <span className="relative inline-block mt-1 py-1 md:py-2 md:mt-3">
          <span className="absolute inset-0 bg-[#a78bfa]/20 blur-[30px] rounded-full hidden lg:block animate-[pulse_4s_ease-in-out_infinite]" />
          <span className="relative text-[#a78bfa] not-italic md:italic md:drop-shadow-[0_0_15px_rgba(167,139,250,0.6)] lg:animate-[pulse_3s_ease-in-out_infinite]">
            مكان واحد
          </span>
        </span>
      </motion.h1>
      <motion.p
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
        className="mb-6 px-1 text-[0.95rem] leading-7 text-outline sm:mb-6 sm:max-w-[22rem] sm:px-0 sm:text-[0.98rem] md:mb-8 md:max-w-2xl md:text-xl md:leading-relaxed text-[#c4bcda]"
      >
        مرحباً بك في زارز، وجهتك الأولى للخدمات الرقمية. نوفر لك شحن ألعام فوري، اشتراكات الذكاء الاصطناعي، خدمات زيادة المتابعين، وتطوير المتاجر بأفضل الأسعار وأسرع تنفيذ.
      </motion.p>
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
        className="flex w-full md:justify-start"
      >
        <Link
          to="/products"
          className="primary-gradient w-full max-w-[16rem] rounded-full px-8 py-3.5 text-center text-base font-bold text-on-primary active:scale-95 md:hover:-translate-y-1 md:hover:shadow-[0_0_40px_rgba(208,188,255,0.5)] md:transition-all sm:min-w-[12rem] sm:w-auto sm:max-w-none md:px-10 md:py-4 md:text-lg"
        >
          عروضنا الحصرية
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Hook: detects mobile AFTER mount — useLayoutEffect fires synchronously
// before paint, so no flash and no hydration mismatch.
// Keep prerender and hydration on the same mobile-safe markup, then opt into
// desktop-only UI after mount.
// ─────────────────────────────────────────────────────────────────────────────

const ScrollReveal = ({ children, type = "fadeUp", delay = 0, className = "", enabled = true }: { children: React.ReactNode, type?: "fadeUp" | "fadeRight" | "fadeLeft" | "scaleUp" | "blurIn", delay?: number, className?: string, enabled?: boolean }) => {
  // Read once at component definition time — avoids re-reading on every render
  // On mobile: plain div, zero JS cost, no IntersectionObserver, no framer-motion
  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    fadeUp:    { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
    fadeRight: { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
    fadeLeft:  { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
    scaleUp:   { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } },
    blurIn:    { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants[type]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type HeroFeatureItem = {
  title: string;
  description: string;
  accentClassName: string;
  shadowClassName: string;
  iconName?: SiteIconName;
  glyph?: string;
};

const heroFeatureItems: HeroFeatureItem[] = [
  {
    title: "نمو للحسابات والتفاعل",
    description: "باقات سوشيال ميديا مناسبة للبدء أو التوسع",
    accentClassName: "bg-[#e11d48]",
    shadowClassName: "shadow-[0_0_15px_rgba(225,29,72,0.4)]",
    glyph: "#",
  },
  {
    title: "شحن واشتراكات مباشرة",
    description: "تأكيد سريع ومتابعة عبر واتساب أو الهاتف",
    accentClassName: "bg-[#3b82f6]",
    shadowClassName: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
    iconName: "bolt",
  },
  {
    title: "تنفيذ مواقع ومتاجر حسب الطلب",
    description: "من التعديل السريع إلى المشروع الكامل",
    accentClassName: "bg-[#10b981]",
    shadowClassName: "shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    iconName: "laptop_mac",
  },
];

function HeroFeatureCard({
  className = "",
  compact = false,
  interactive = false,
}: {
  className?: string;
  compact?: boolean;
  interactive?: boolean;
}) {
  const shellClassName = [
    "perf-panel relative w-full shrink-0 overflow-hidden rounded-[2rem] border border-white/10 text-on-background shadow-[0_0_50px_rgba(0,0,0,0.38)]",
    compact
      ? "max-w-[22rem] self-center bg-[rgba(31,14,45,0.88)] px-4 py-5"
      : "lg:w-[340px] xl:w-[380px] bg-[rgba(31,14,45,0.7)] p-5 backdrop-blur-2xl xl:p-6",
    className,
  ].join(" ");

  const content = (
    <>
      <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-primary/20 blur-[42px]" />

      <div className="relative text-right" dir="rtl">
        <div className="mb-4 flex justify-start">
          <span className="rounded-full border border-[#e11d48]/30 bg-[#9f1239]/40 px-3 py-1.5 text-[10px] font-bold text-[#fda4af] backdrop-blur-md">
            الأكثر طلباً هذا الأسبوع
          </span>
        </div>

        <h3 className={`font-headline font-black leading-tight tracking-tight ${compact ? "mb-3 text-[2rem]" : "mb-4 text-xl md:text-2xl"}`}>
          تجربة أسرع وأوضح للطلبات الرقمية
        </h3>

        <p className={`font-medium ${compact ? "mb-5 text-[0.92rem] leading-7 text-[#c9c2dd]" : "mb-6 text-xs leading-relaxed text-[#a1a1aa]"}`}>
          اختر الخدمة، أرسل بياناتك، وتابع التنفيذ من نفس المكان بدون خطوات معقدة.
        </p>

        <div className={compact ? "space-y-3" : "space-y-4"}>
          {heroFeatureItems.map((item) => (
            <div
              key={item.title}
              className="perf-card flex items-center gap-3 rounded-[1.25rem] border border-white/8 bg-white/6 p-4 transition-colors hover:bg-white/10"
            >
              <div
                className={`flex ${compact ? "h-12 w-12" : "h-10 w-10"} shrink-0 items-center justify-center rounded-xl text-white ${item.accentClassName} ${item.shadowClassName}`}
              >
                {item.iconName ? (
                  <SiteIcon name={item.iconName} className={compact ? "text-[1.35rem]" : "text-xl"} />
                ) : (
                  <span className={`${compact ? "text-2xl" : "text-xl"} font-black leading-none`}>{item.glyph}</span>
                )}
              </div>

              <div className="min-w-0 text-start">
                <h4 className={`mb-0.5 font-bold text-on-surface ${compact ? "text-[1.02rem]" : "text-sm"}`}>{item.title}</h4>
                <p className={`text-outline ${compact ? "text-[0.84rem] leading-6" : "line-clamp-1 text-xs"}`}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (interactive) {
    return <TiltCard className={shellClassName}>{content}</TiltCard>;
  }

  return <div className={shellClassName}>{content}</div>;
}

const useKeyboardSectionSnap = () => {
  useEffect(() => {
    if (window.innerWidth < 1024) return;

    let isScrolling = false;
    let currentIndex = 0;

    const getSections = (): HTMLElement[] =>
      Array.from(document.querySelectorAll('[data-snap-section="true"]')) as HTMLElement[];

    const getAbsoluteTop = (el: HTMLElement): number =>
      el.getBoundingClientRect().top + window.scrollY;

    const scrollToIndex = (idx: number) => {
      const sections = getSections();
      if (idx < 0 || idx >= sections.length) return;
      currentIndex = idx;
      isScrolling = true;
      // Index 0 = Hero: always scroll to very top so sticky navbar is visible
      const target = idx === 0 ? 0 : getAbsoluteTop(sections[idx]);
      const lenis = (window as any).__lenis;
      if (lenis) {
        // Use Lenis for perfectly smooth, conflict-free snap scroll
        lenis.scrollTo(target, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
      setTimeout(() => { isScrolling = false; }, 1300);
    };

    // Sync currentIndex when user scrolls manually
    const syncIndex = () => {
      if (isScrolling) return;
      const sections = getSections();
      const mid = window.scrollY + window.innerHeight / 2;
      let best = 0;
      let bestDiff = Infinity;
      sections.forEach((s, i) => {
        const diff = Math.abs(getAbsoluteTop(s) + s.offsetHeight / 2 - mid);
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      });
      currentIndex = best;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

      // Always prevent default arrow scroll on home page (desktop)
      e.preventDefault();
      if (isScrolling) return;

      const sections = getSections();
      if (sections.length === 0) return;

      if (e.key === "ArrowDown") {
        if (currentIndex < sections.length - 1) scrollToIndex(currentIndex + 1);
      } else {
        // Always use scrollToIndex so we land precisely on the section top
        scrollToIndex(Math.max(0, currentIndex - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", syncIndex, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", syncIndex);
    };
  }, []);
};

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
      className={`perf-card faq-mobile-card cyber-glass-card rounded-2xl overflow-hidden border md:transition-[border-color] md:duration-300 ${
        isOpen
          ? "border-[#e11d48]/30"
          : "border-outline-variant/10"
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
        className={`grid overflow-hidden md:transition-[grid-template-rows,opacity] md:duration-[460ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`px-6 pb-6 text-[#cbc3d9] leading-relaxed md:transition-[transform,opacity] md:duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
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
      className={`perf-card why-choose-mobile-card group relative overflow-hidden rounded-[1.25rem] border border-outline-variant/10 bg-surface-container-low/60 p-4 md:p-6 md:transition-[transform,border-color] md:duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] md:duration-500 ${item.borderClass} md:hover:-translate-y-1.5`}
    >
      {/* gradient overlay — opacity only, compositor-safe */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.overlayClass} to-transparent opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100`} />
      <div className="pointer-events-none absolute top-4 left-4 select-none text-[3.5rem] leading-none font-black text-white/[0.03]">
        {item.number}
      </div>
      <div className="relative z-10">
        <div
          className={`mb-3 md:mb-4 flex h-11 w-11 items-center justify-center rounded-xl border md:transition-transform md:duration-300 md:group-hover:scale-110 ${item.iconClass}`}
        >
          <SiteIcon name={item.iconName} className="text-[22px]" />
        </div>
        <h4 className="mb-1.5 text-sm font-black text-on-surface md:text-[15px]">{item.title}</h4>
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

const IsolatedSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="isolate-section">
      {children}
    </div>
  );
};

const Section = React.memo(
  ({ children, className, id, ...props }: React.ComponentProps<"section">) => {
    return (
      <IsolatedSection>
        <section id={id} className={className} {...props}>
          {children}
        </section>
      </IsolatedSection>
    );
  }
);

export function Home() {
  useKeyboardSectionSnap();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const isCoarsePointer = useCoarsePointer();
  const revealRef = useScrollReveal();
  const isDesktopViewport = useDesktopViewport();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getServiceRailStep = () => {
    if (!scrollContainerRef.current) return 0;
    const firstCard = scrollContainerRef.current.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(window.getComputedStyle(scrollContainerRef.current).columnGap || window.getComputedStyle(scrollContainerRef.current).gap || "0") || 0;

    return (firstCard?.getBoundingClientRect().width ?? scrollContainerRef.current.clientWidth) + gap;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -getServiceRailStep(), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: getServiceRailStep(), behavior: 'smooth' });
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
    <div ref={revealRef} className="home-mobile-page pt-12 md:pt-14">
      {/* Hero Section */}
      <Section data-snap-section="true" className="relative overflow-hidden px-4 pb-6 pt-14 sm:px-6 sm:py-8 md:px-12 md:py-8 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-10">
        <div className="absolute inset-0 z-0">
          <img
            alt="ZARZ Hero Background"
            className="h-full w-full object-cover object-center"
            src="/assets/hero-zarz-bg.avif"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            width={2752}
            height={1536}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,7,27,0.46),rgba(18,7,27,0.78))]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-[rgba(20,8,28,0.58)] to-background sm:h-32" />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-stretch justify-between gap-8 lg:flex-row lg:items-center xl:gap-12">
          {isDesktopViewport ? (
            <>
              <DesktopHero />
              <HeroFeatureCard
                interactive
                className="hidden lg:block lg:animate-in lg:slide-in-from-left-12 lg:fade-in lg:duration-1000 lg:delay-300 lg:fill-mode-both"
              />
            </>
          ) : (
            <MobileHero />
          )}
        </div>

        {/* Decorative Watermark */}
        {isDesktopViewport && (
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-5 select-none pointer-events-none hidden lg:block">
            <span className="text-[25rem] font-black font-headline tracking-tighter">ZARZ</span>
          </div>
        )}
      </Section>

      {/* Featured Products Section */}
      <section
        data-snap-section="true"
        className="relative overflow-hidden bg-background lg:flex lg:flex-col lg:justify-center lg:min-h-[100vh]"
      >
        <FeaturedProducts />
      </section>

      {/* Services Grid */}
      <Section data-snap-section="true" className="perf-mobile-section px-6 py-16 md:py-20 bg-surface-container-low md:px-12 relative overflow-hidden lg:flex lg:flex-col lg:justify-center lg:min-h-screen">
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
                className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary text-white transition-all md:hover:bg-primary/90 md:hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(208,188,255,0.4)] touch-manipulation"
              >
                <SiteIcon name="chevron_left" className="text-2xl" />
              </button>
              <button 
                onClick={scrollRight}
                className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary text-white transition-all md:hover:bg-primary/90 md:hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(208,188,255,0.4)] touch-manipulation"
              >
                <SiteIcon name="chevron_right" className="text-2xl" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="perf-mobile-horizontal-cards flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-proximity md:snap-none no-scrollbar pb-12 pt-4 px-4 -mx-4 md:px-0 md:-mx-0"
            style={{ scrollPaddingInline: "1rem" }}
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
                  className="block snap-start snap-always shrink-0 w-[calc(100vw-2.5rem)] md:w-auto"
                  onClick={() => {
                    if (!isCoarsePointer) {
                      setActiveIndex(idx);
                    }
                  }}
                >
                  <div
                    className={`perf-panel cyber-glass-card rounded-[2.5rem] p-6 md:p-8 group relative flex h-[360px] md:h-[400px] w-full flex-col justify-between overflow-hidden transition-all duration-500 cursor-pointer ${
                      isActive 
                        ? "border-primary md:scale-[1.02] shadow-[0_20px_50px_rgba(208,188,255,0.15)] z-10" 
                        : "border-outline-variant/10 md:hover:border-primary/30 md:hover:-translate-y-1"
                    }`}
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

          </div>
      </Section>

      {/* Why ZARZ Section */}
      <Section data-snap-section="true" className="py-12 md:py-20 px-6 md:px-12 relative overflow-hidden lg:flex lg:flex-col lg:justify-center lg:min-h-[100vh]">
        <div className="why-choose-mobile-glow home-mobile-glow absolute top-0 left-1/3 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[60px] md:blur-[120px] pointer-events-none"></div>
        <div className="why-choose-mobile-glow home-mobile-glow absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-tertiary/5 blur-[50px] md:blur-[100px] pointer-events-none"></div>
        <ScrollReveal enabled={isDesktopViewport} type="fadeUp" className="max-w-6xl mx-auto relative z-10 w-full">
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-bold mb-4">لماذا نحن مختلفون؟</span>
            <h2 className="text-3xl md:text-5xl font-black font-headline text-on-background mb-3">لماذا تختار زارز؟</h2>
            <p className="text-outline text-base md:text-lg max-w-xl mx-auto leading-relaxed">نقدّم تجربة متكاملة تجمع بين السرعة والأمان والدعم المستمر</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
            {whyChooseItems.map((item) => (
              <React.Fragment key={item.id}>
                <WhyChooseCard item={item} />
              </React.Fragment>
            ))}
          </div>
        </ScrollReveal>
      </Section>

      {/* Unified Marquee & Stats Section */}
      <Section data-snap-section="true" className="perf-mobile-section relative overflow-hidden px-6 py-16 md:py-20 md:px-12 lg:flex lg:flex-col lg:justify-center lg:min-h-[100vh]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {isDesktopViewport && <>
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[120px]" />
          </>}
        </div>

        <ScrollReveal enabled={isDesktopViewport} type="blurIn" delay={0.1} className="z-20 w-full max-w-6xl mx-auto mb-16 md:mb-24 relative">
          <div className="relative z-10 mb-10 flex flex-col items-center justify-center text-center md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-bold mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(208,188,255,0.1)]">
              <span className="relative flex h-2 w-2 mb-0.5">
                <span className="home-mobile-ping animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              شركاء النجاح
            </div>
            <h2 className="max-w-none whitespace-nowrap text-[1.55rem] font-black font-headline leading-none tracking-[-0.03em] sm:text-3xl md:text-5xl md:tracking-tighter">
              <span className="inline text-on-background">شركات ملهمة</span>
              <span className="mr-2 inline text-transparent bg-clip-text bg-gradient-to-l from-primary to-[#8b5cf6] drop-shadow-[0_0_20px_rgba(208,188,255,0.4)] md:mt-0">
                وثقت بنا
              </span>
            </h2>
          </div>
          {!isDesktopViewport ? (
            <div
              className="pointer-events-none select-none px-1 py-2"
              dir="ltr"
            >
              <div className="flex items-center justify-center opacity-80 grayscale [mask-image:linear-gradient(to_right,transparent_0,black_8%,black_92%,transparent_100%)]">
                {mobileTechLogos}
              </div>
            </div>
          ) : (
            <div
              className="group flex w-full flex-nowrap overflow-hidden no-scrollbar md:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] opacity-70 grayscale hover:grayscale-0 transition-all duration-700 bg-surface/0"
              dir="ltr"
            >
              <style>{`
                @keyframes infinite-scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                @media (min-width: 768px) {
                  .animate-infinite-scroll {
                    animation: infinite-scroll 30s linear infinite;
                  }
                  .group:hover .animate-infinite-scroll {
                    animation-play-state: paused;
                  }
                }
              `}</style>
              <div className="flex items-center justify-start [&>div]:mx-6 md:[&>div]:mx-10 w-max animate-infinite-scroll">
                {desktopTechLogos}
                {desktopTechLogos}
              </div>
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal enabled={isDesktopViewport} type="scaleUp" className="max-w-7xl mx-auto relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">

          <div className="perf-card group relative p-5 md:p-10 rounded-[2rem] bg-surface-container-low border border-outline-variant/10 transition-all duration-500 md:hover:border-primary/30 md:hover:-translate-y-3 md:hover:shadow-[0_20px_60px_rgba(86,0,202,0.15)] overflow-hidden flex flex-col justify-center">
            <div className="home-mobile-glow absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl transition-all duration-500 md:group-hover:bg-primary/20"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 md:mb-6 transition-transform duration-500 md:group-hover:scale-110">
                <SiteIcon name="groups" className="text-2xl md:text-3xl text-primary drop-shadow-[0_0_10px_rgba(208,188,255,0.5)]" />
              </div>
              <div className="text-3xl md:text-5xl font-black text-on-surface mb-1 md:mb-2 tracking-tight transition-colors md:group-hover:text-primary">+10k</div>
              <div className="text-outline text-xs md:text-base font-bold">عميل سعيد</div>
            </div>
          </div>

          <div className="perf-card group relative p-5 md:p-10 rounded-[2rem] bg-surface-container-low border border-outline-variant/10 transition-all duration-500 md:hover:border-[#3b82f6]/30 md:hover:-translate-y-3 md:hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col justify-center">
            <div className="home-mobile-glow absolute top-0 left-0 w-32 h-32 bg-[#3b82f6]/10 rounded-full blur-3xl transition-all duration-500 md:group-hover:bg-[#3b82f6]/20"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mb-4 md:mb-6 transition-transform duration-500 md:group-hover:scale-110">
                <SiteIcon name="verified" className="text-2xl md:text-3xl text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
              <div className="text-3xl md:text-5xl font-black text-on-surface mb-1 md:mb-2 tracking-tight transition-colors md:group-hover:text-[#3b82f6]">99%</div>
              <div className="text-outline text-xs md:text-base font-bold">رضا المستخدمين</div>
            </div>
          </div>

          <div className="perf-card group relative p-5 md:p-10 rounded-[2rem] bg-surface-container-low border border-outline-variant/10 transition-all duration-500 md:hover:border-[#f59e0b]/30 md:hover:-translate-y-3 md:hover:shadow-[0_20px_60px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col justify-center">
            <div className="home-mobile-glow absolute bottom-0 right-0 w-32 h-32 bg-[#f59e0b]/10 rounded-full blur-3xl transition-all duration-500 md:group-hover:bg-[#f59e0b]/20"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mb-4 md:mb-6 transition-transform duration-500 md:group-hover:scale-110">
                <SiteIcon name="rocket_launch" className="text-2xl md:text-3xl text-[#f59e0b] drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              </div>
              <div className="text-3xl md:text-5xl font-black text-on-surface mb-1 md:mb-2 tracking-tight transition-colors md:group-hover:text-[#f59e0b]">+250</div>
              <div className="text-outline text-xs md:text-base font-bold">مشروع منجز</div>
            </div>
          </div>

          <div className="perf-card group relative p-5 md:p-10 rounded-[2rem] bg-surface-container-low border border-outline-variant/10 transition-all duration-500 md:hover:border-[#10b981]/30 md:hover:-translate-y-3 md:hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col justify-center">
            <div className="home-mobile-glow absolute bottom-0 left-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-3xl transition-all duration-500 md:group-hover:bg-[#10b981]/20"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4 md:mb-6 transition-transform duration-500 md:group-hover:scale-110">
                <SiteIcon name="support_agent" className="text-2xl md:text-3xl text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <div className="text-3xl md:text-5xl font-black text-on-surface mb-1 md:mb-2 tracking-tight transition-colors md:group-hover:text-[#10b981]">24/7</div>
              <div className="text-outline text-xs md:text-base font-bold">دعم فني متواصل</div>
            </div>
          </div>
        </ScrollReveal>
      </Section>


      {/* FAQ Section */}
      <Section data-snap-section="true" id="faq" className="perf-mobile-section relative overflow-hidden bg-background px-6 py-16 md:py-20 md:px-12 lg:flex lg:flex-col lg:justify-center lg:min-h-[100vh]">
        <div className="faq-mobile-glow home-mobile-glow absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
        <ScrollReveal enabled={isDesktopViewport} type="fadeLeft" delay={0.1} className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-headline text-on-background mb-4">أسئلة شائعة</h2>
            <p className="text-lg text-outline">إجابات سريعة قبل بدء الطلب.</p>
          </div>

          <FaqAccordion
            faqs={[
              {
                question: "كم يستغرق تنفيذ الطلب؟",
                answer: "يعتمد الوقت على نوع الخدمة، لكن أغلب الطلبات يبدأ تنفيذها خلال دقائق إلى ساعات قليلة بعد التأكيد."
              },
              {
                question: "كيف يتم التواصل بعد الطلب؟",
                answer: "عبر الواتساب بشكل مباشر على الرقم الخاص بالمتجر، وسيتم تزويدك بكل التحديثات الخاصة بطلبك."
              },
              {
                question: "هل الخدمات آمنة على الحسابات؟",
                answer: "نعم، جميع خدماتنا نعتمد فيها على أفضل معايير الأمان ولا نطلب أي أرقام سرية قد تضر بحسابك إطلاقاً."
              },
              {
                question: "هل يمكن طلب خدمة مخصصة؟",
                answer: "بالتأكيد، يمكنك التواصل معنا عبر الواتساب لشرح متطلباتك وسيقوم فريقنا بتقديم حل يناسب احتياجاتك الخاصة بأسعار منافسة."
              }
            ]}
          />
        </ScrollReveal>
      </Section>

      {/* CTA Section */}
      <Section data-snap-section="true" className="perf-mobile-section px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center">
        <ScrollReveal enabled={isDesktopViewport} type="fadeUp" className="perf-panel relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-[2rem] border border-outline-variant/15 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:max-w-7xl sm:rounded-[2.5rem] sm:p-8 md:p-14 lg:shadow-2xl cyber-glass-card group">
          <div className="mesh-gradient-bg opacity-25 sm:opacity-30"></div>
          <div className="home-mobile-glow absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl sm:h-64 sm:w-64 sm:translate-x-1/2 sm:-translate-y-1/2"></div>
          <div className="home-mobile-glow absolute bottom-0 left-0 h-40 w-40 -translate-x-1/3 translate-y-1/3 rounded-full bg-tertiary/10 blur-3xl sm:h-64 sm:w-64 sm:-translate-x-1/2 sm:translate-y-1/2"></div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-7 text-center sm:gap-10 xl:flex-row xl:items-end xl:gap-20 xl:text-start">
            {/* Text Content */}
            <div className="w-full max-w-[18.5rem] flex-1 sm:max-w-3xl">
              <span className="mb-5 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.78rem] font-bold text-outline backdrop-blur-md sm:mb-8 sm:px-5 sm:py-2 sm:text-sm">
                جاهز تبدأ الآن؟
              </span>
              <h2 className="mb-4 font-headline text-[2.05rem] font-black leading-[1.08] text-on-background sm:mb-6 sm:text-4xl md:text-5xl xl:text-start">
                خلنا نحول طلبك إلى تنفيذ سريع ومرتب
              </h2>
              <p className="mx-auto max-w-[16rem] text-[1rem] leading-7 text-[#cbc3d9] sm:mx-0 sm:max-w-2xl sm:text-lg md:text-xl">
                سواء كنت تحتاج شحن ألعاب، نمو لحساباتك، أو متجر احترافي، البداية من هنا.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex w-full max-w-[15.5rem] shrink-0 flex-col gap-3 pb-0 sm:max-w-none sm:flex-row sm:gap-4 xl:w-auto xl:pb-2">
              <a href="https://wa.me/201500007300" target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2.5 rounded-[1.15rem] border border-outline-variant/25 bg-surface/45 px-5 py-3.5 text-center text-[0.98rem] font-bold text-on-background backdrop-blur-md transition-all sm:w-auto sm:gap-3 sm:px-8 sm:py-5 sm:text-lg md:hover:bg-white/10">
                <SiteIcon name="forum" className="text-[1.05rem] sm:text-xl" />
                تواصل عبر واتساب
              </a>
              <Link to="/products" className="primary-gradient flex w-full items-center justify-center gap-2.5 rounded-[1.15rem] px-5 py-3.5 text-center text-[0.98rem] font-bold text-on-primary transition-all active:scale-95 sm:w-auto sm:gap-3 sm:px-8 sm:py-5 sm:text-lg md:hover:shadow-[0_0_30px_rgba(208,188,255,0.4)]">
                استعرض المنتجات
                <SiteIcon name="arrow_back" className="text-[1.05rem] sm:text-xl" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </Section>
    </div>
  );
}
