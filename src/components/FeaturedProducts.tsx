import { Link } from "react-router-dom";
import React, { useRef } from "react";
import { products } from "../data/products";
import { formatSudanesePrice, getDiscountPercent, getLegacyOriginalPrice } from "../lib/pricing";
import { SiteIcon } from "./SiteIcon";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";

const categoryMap: Record<string, { label: string; color: string }> = {
  ai: { label: "الذكاء الاصطناعي", color: "#8b5cf6" },
  web: { label: "تطوير ويب", color: "#10b981" },
  social: { label: "تواصل اجتماعي", color: "#e11d48" },
  gaming: { label: "ألعاب الفيديو", color: "#3b82f6" },
};

export function FeaturedProducts() {
  const featuredIds = [
    "شات-جي-بي-تي-بلس",
    "جيميني-برو",
    "إنشاء-متاجر-إلكترونية",
    "متابعين-إنستغرام",
    "شدات-ببجي",
    "جواهر-فري-فاير",
  ];

  const featured = featuredIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean) as typeof products;

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollContainerRef });
  const indicatorX = useTransform(scrollXProgress, [0, 1], [0, -192]);

  const [isAtStart, setIsAtStart] = React.useState(true);
  const [isAtEnd, setIsAtEnd] = React.useState(false);

  useMotionValueEvent(scrollXProgress, "change", (latest) => {
    setIsAtStart(latest <= 0.02);
    setIsAtEnd(latest >= 0.98);
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

  return (
    <section className="perf-mobile-section relative overflow-hidden bg-background px-6 pt-4 pb-4 md:px-12 md:py-28" data-perf-size="medium">
      <div className="pointer-events-none absolute top-0 right-1/4 h-[260px] w-[260px] rounded-full bg-primary/5 blur-[36px] md:h-[500px] md:w-[500px] md:blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[220px] w-[220px] rounded-full bg-tertiary/5 blur-[32px] md:h-[400px] md:w-[400px] md:blur-[100px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-start w-full md:w-auto">
            <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-primary sm:backdrop-blur-md">
              الأكثر طلبًا
            </span>
            <h2 className="mb-4 font-headline text-3xl font-black text-on-background md:text-5xl">منتجات مميزة</h2>
            <p className="max-w-md text-base font-medium text-outline md:text-lg">اكتشف أكثر الخدمات طلبًا لدينا</p>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="perf-mobile-horizontal-cards flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none no-scrollbar pb-8 pt-4 px-4 -mx-4 md:px-0 md:-mx-0"
          dir="rtl"
        >
          {featured.map((product) => {
            const category = categoryMap[product.category] || { label: product.category, color: "#d0bcff" };
            const discountPercent = getDiscountPercent();
            const originalPrice = getLegacyOriginalPrice(product.basePrice);

            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className={`shrink-0 snap-center w-[290px] md:w-auto group relative flex flex-col overflow-hidden rounded-[1.4rem] border border-outline-variant/10 shadow-[0_10px_24px_rgba(8,6,18,0.16)] sm:min-h-[390px] sm:rounded-[1.5rem] sm:shadow-sm md:shadow-lg md:transition-all md:duration-300 md:hover:-translate-y-1 md:hover:border-primary/30 md:hover:shadow-[0_18px_40px_rgba(208,188,255,0.08)] ${
                  product.outOfStock ? "bg-surface-container-low/40 grayscale-[80%]" : "bg-surface-container-low/80"
                }`}
              >
                {!product.outOfStock && (
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 hidden h-32 w-32 rounded-full opacity-0 blur-[42px] transition-opacity duration-500 lg:block lg:group-hover:opacity-100"
                    style={{ backgroundColor: `${category.color}15` }}
                  ></div>
                )}

                <div className="relative min-h-0 aspect-[4/3] w-full overflow-hidden bg-[#0c0a10] sm:aspect-square">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-[#0c0a10] to-transparent sm:h-16"></div>

                  {product.outOfStock && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                      <span className="rounded-full border border-destructive/50 bg-destructive/10 px-5 py-2 font-headline text-lg font-black text-destructive shadow-[0_0_14px_rgba(255,0,0,0.16)] sm:px-6 sm:text-xl sm:shadow-[0_0_20px_rgba(255,0,0,0.2)]">
                        نفدت الكمية
                      </span>
                    </div>
                  )}

                  <img
                    src={product.image}
                    alt={product.title}
                    className={`h-full w-full object-cover transition-transform duration-300 md:group-hover:scale-[1.03] ${
                      product.outOfStock ? "opacity-50" : ""
                    }`}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 639px) 88vw, (max-width: 1023px) 44vw, 30vw"
                    draggable={false}
                    width={634}
                    height={634}
                  />

                  <div className="absolute top-3 left-3 z-20">
                    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2.5 py-1">
                      <span className="text-xs text-[#fbbf24]">★</span>
                      <span className="text-xs font-bold text-white">{product.rating}</span>
                    </div>
                  </div>

                  {discountPercent && !product.outOfStock && (
                    <div className="absolute top-3 right-3 z-20">
                      <span className="rounded-full bg-[#ff3b30] px-3 py-1 text-xs font-bold tracking-wider text-white shadow-[0_6px_16px_rgba(255,59,48,0.18)] sm:shadow-sm">
                        {`خصم ${discountPercent}%`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-3.5 text-right sm:p-5" dir="rtl">
                  <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                    <span
                      className="rounded-full border px-2.5 py-1 text-[10px] font-bold sm:px-3 sm:text-xs"
                      style={{
                        color: category.color,
                        borderColor: `${category.color}30`,
                        backgroundColor: `${category.color}10`,
                      }}
                    >
                      {category.label}
                    </span>
                    <span className="text-[11px] font-medium text-outline/60 sm:text-xs">{product.reviewCount || 100} تقييم</span>
                  </div>

                  <h3
                    className={`mb-1.5 line-clamp-2 text-[14px] font-black leading-snug transition-colors sm:mb-2.5 sm:text-[15px] md:text-base ${
                      product.outOfStock ? "text-outline" : "text-on-surface md:group-hover:text-primary"
                    }`}
                  >
                    {product.title}
                  </h3>

                  <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-outline sm:mb-4 sm:text-xs">{product.desc}</p>

                  <div className="mt-auto flex min-h-[56px] items-end justify-between border-t border-outline-variant/10 pt-2.5 sm:min-h-[66px] sm:pt-3">
                    {!product.outOfStock ? (
                      <div className="flex flex-col items-start gap-1.5" dir="rtl">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[1.6rem] font-black leading-none text-white sm:text-2xl md:text-[1.95rem]">
                            {formatSudanesePrice(product.basePrice)}
                          </span>
                          <span className="text-[10px] font-bold text-primary/75 sm:text-[11px]">ج.س</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="flex items-baseline gap-1 text-[10px] text-outline/60 line-through sm:text-[11px]">
                            <span>{formatSudanesePrice(originalPrice)}</span>
                            <span>ج.س</span>
                          </span>
                          <span className="flex items-center gap-1 rounded-full border border-[#ff857d]/20 bg-[#ff3b30]/12 px-2 py-0.5 text-[9px] font-bold text-[#ff857d] sm:text-[10px]">
                            <span>وفر</span>
                            <span dir="ltr">{discountPercent}%</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-outline/50">غير متوفر</span>
                    )}

                    <span
                      className={`flex items-center gap-1 text-[10px] font-bold transition-colors sm:text-xs ${
                        product.outOfStock ? "text-outline/40" : "text-primary/70 md:group-hover:text-primary"
                      }`}
                    >
                      تفاصيل
                      <SiteIcon
                        name="arrow_back"
                        className="text-sm transition-transform md:group-hover:-translate-x-1"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
        <div className="flex gap-3 justify-center mt-6 md:hidden" dir="ltr">
          <button 
            onClick={scrollLeft}
            disabled={isAtEnd}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
              !isAtEnd 
                ? "bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(208,188,255,0.4)]" 
                : "border border-primary/20 bg-surface-container/50 backdrop-blur-md text-primary opacity-40 cursor-not-allowed"
            }`}
          >
            <SiteIcon name="chevron_left" className="text-2xl" />
          </button>
          <button 
            onClick={scrollRight}
            disabled={isAtStart}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
              !isAtStart 
                ? "bg-primary text-white hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(208,188,255,0.4)]" 
                : "border border-primary/20 bg-surface-container/50 backdrop-blur-md text-primary opacity-40 cursor-not-allowed"
            }`}
          >
            <SiteIcon name="chevron_right" className="text-2xl" />
          </button>
        </div>
    </section>
  );
}
