import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { products } from "../data/products";
import { formatSudanesePrice, getDiscountPercent, getLegacyOriginalPrice } from "../lib/pricing";
import { getResponsiveProductImage, handleResponsiveImageError } from "../lib/responsiveImage";
import { SiteIcon } from "./SiteIcon";

const categoryMap: Record<string, { label: string; color: string }> = {
  ai: { label: "الذكاء الاصطناعي", color: "#8b5cf6" },
  web: { label: "تطوير ويب", color: "#10b981" },
  social: { label: "تواصل اجتماعي", color: "#e11d48" },
  gaming: { label: "ألعاب الفيديو", color: "#3b82f6" },
};

function FeaturedProductImage({
  alt,
  image,
  outOfStock,
}: {
  alt: string;
  image: ReturnType<typeof getResponsiveProductImage>;
  outOfStock: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0">
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-white/[0.1] to-white/[0.03]"
        >
          <div className="absolute inset-x-5 top-5 h-5 rounded-full bg-white/[0.08]" />
          <div className="absolute inset-x-10 bottom-10 h-24 rounded-[1.25rem] bg-white/[0.04]" />
        </div>
      )}

      <img
        src={image.src}
        srcSet={image.srcSet}
        alt={alt}
        className={`h-full w-full object-cover ${
          isLoaded ? (outOfStock ? "opacity-50" : "opacity-100") : "opacity-0"
        }`}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onLoad={() => setIsLoaded(true)}
        onError={(event) => {
          handleResponsiveImageError(event, image.src);
          setIsLoaded(false);
        }}
        referrerPolicy="no-referrer"
        sizes="(max-width: 639px) 290px, (max-width: 1023px) 44vw, 30vw"
        draggable={false}
        width={634}
        height={634}
      />
    </div>
  );
}

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

  // Desktop scroll refs kept for arrow buttons (desktop only)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: "auto" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: "auto" });
    }
  };

  const discountPercent = getDiscountPercent();

  return (
    <section
      className="perf-mobile-section relative overflow-hidden bg-background px-6 pb-4 pt-4 md:px-12 md:py-28"
      data-perf-size="medium"
    >
      <div className="pointer-events-none absolute top-0 right-1/4 h-[260px] w-[260px] rounded-full bg-primary/5 blur-[36px] md:h-[500px] md:w-[500px] md:blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[220px] w-[220px] rounded-full bg-tertiary/5 blur-[32px] md:h-[400px] md:w-[400px] md:blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="flex w-full flex-col items-center text-center md:w-auto md:items-start md:text-start">
            <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-primary sm:backdrop-blur-md">
              الأكثر طلبًا
            </span>
            <h2 className="mb-4 font-headline text-3xl font-black text-on-background md:text-5xl">
              منتجات مميزة
            </h2>
            <p className="max-w-md text-base font-medium text-outline md:text-lg">
              اكتشف أكثر الخدمات طلبًا لدينا
            </p>
          </div>
        </div>

        {/* Mobile: Swiper */}
        <div className="md:hidden -mx-6">
          <Swiper
            modules={[FreeMode]}
            slidesPerView="auto"
            spaceBetween={12}
            freeMode={true}
            speed={300}
            resistanceRatio={0.85}
            dir="rtl"
            className="w-full !px-6 !pb-6 !pt-2"
          >
            {featured.map((product) => {
              const category = categoryMap[product.category] || {
                label: product.category,
                color: "#d0bcff",
              };
              const originalPrice = getLegacyOriginalPrice(product.basePrice);
              const responsiveImage = getResponsiveProductImage(product.image);

              return (
                <SwiperSlide key={product.id} style={{ width: 290 }}>
                  <Link
                    to={`/products/${product.id}`}
                    className={`product-card group relative flex flex-col overflow-hidden rounded-[1.4rem] border border-outline-variant/10 shadow-[0_10px_24px_rgba(8,6,18,0.16)] ${
                      product.outOfStock ? "bg-surface-container-low/40 grayscale-[80%]" : "bg-surface-container-low/80"
                    }`}
                    style={{ width: 290 }}
                  >
                    <div className="relative min-h-0 aspect-[4/3] w-full overflow-hidden bg-[#0c0a10]">
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-[#0c0a10] to-transparent" />

                      <FeaturedProductImage
                        alt={product.title}
                        image={responsiveImage}
                        outOfStock={product.outOfStock}
                      />

                      {product.outOfStock && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                          <span className="rounded-full border border-destructive/50 bg-destructive/10 px-5 py-2 font-headline text-lg font-black text-destructive shadow-[0_0_14px_rgba(255,0,0,0.16)]">
                            نفدت الكمية
                          </span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 z-20">
                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2.5 py-1">
                          <span className="text-xs text-[#fbbf24]">★</span>
                          <span className="text-xs font-bold text-white">{product.rating}</span>
                        </div>
                      </div>

                      {discountPercent && !product.outOfStock && (
                        <div className="absolute top-3 right-3 z-20">
                          <span className="rounded-full bg-[#ff3b30] px-3 py-1 text-xs font-bold tracking-wider text-white shadow-[0_6px_16px_rgba(255,59,48,0.18)]">
                            {`خصم ${discountPercent}%`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col p-3.5 text-right" dir="rtl">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span
                          className="rounded-full border px-2.5 py-1 text-[10px] font-bold"
                          style={{
                            color: category.color,
                            borderColor: `${category.color}30`,
                            backgroundColor: `${category.color}10`,
                          }}
                        >
                          {category.label}
                        </span>
                        <span className="text-[11px] font-medium text-outline/60">
                          {product.reviewCount || 100} تقييم
                        </span>
                      </div>

                      <h3
                        className={`mb-1.5 line-clamp-2 text-[14px] font-black leading-snug ${
                          product.outOfStock ? "text-outline" : "text-on-surface"
                        }`}
                      >
                        {product.title}
                      </h3>

                      <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-outline">
                        {product.desc}
                      </p>

                      <div className="mt-auto flex min-h-[56px] items-end justify-between border-t border-outline-variant/10 pt-2.5">
                        {!product.outOfStock ? (
                          <div className="flex flex-col items-start gap-1.5" dir="rtl">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-[1.6rem] font-black leading-none text-white">
                                {formatSudanesePrice(product.basePrice)}
                              </span>
                              <span className="text-[10px] font-bold text-primary/75">ج.س</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-baseline gap-1 text-[10px] text-outline/60 line-through">
                                <span>{formatSudanesePrice(originalPrice)}</span>
                                <span>ج.س</span>
                              </span>
                              <span className="flex items-center gap-1 rounded-full border border-[#ff857d]/20 bg-[#ff3b30]/12 px-2 py-0.5 text-[9px] font-bold text-[#ff857d]">
                                <span>وفر</span>
                                <span dir="ltr">{discountPercent}%</span>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-outline/50">غير متوفر</span>
                        )}

                        <span className={`flex items-center gap-1 text-[10px] font-bold ${
                          product.outOfStock ? "text-outline/40" : "text-primary/70"
                        }`}>
                          تفاصيل
                          <SiteIcon name="arrow_back" className="text-sm" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Desktop: grid layout */}
        <div
          ref={scrollContainerRef}
          className="hidden md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {featured.map((product) => {
            const category = categoryMap[product.category] || {
              label: product.category,
              color: "#d0bcff",
            };
            const originalPrice = getLegacyOriginalPrice(product.basePrice);
            const responsiveImage = getResponsiveProductImage(product.image);

            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className={`group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-outline-variant/10 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_40px_rgba(208,188,255,0.08)] ${
                  product.outOfStock ? "bg-surface-container-low/40 grayscale-[80%]" : "bg-surface-container-low/80"
                }`}
              >
                {!product.outOfStock && (
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 hidden h-32 w-32 rounded-full opacity-0 blur-[42px] transition-opacity duration-500 lg:block lg:group-hover:opacity-100"
                    style={{ backgroundColor: `${category.color}15` }}
                  />
                )}

                <div className="relative min-h-0 aspect-square w-full overflow-hidden bg-[#0c0a10]">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#0c0a10] to-transparent" />

                  <FeaturedProductImage
                    alt={product.title}
                    image={responsiveImage}
                    outOfStock={product.outOfStock}
                  />

                  {product.outOfStock && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                      <span className="rounded-full border border-destructive/50 bg-destructive/10 px-6 py-2 font-headline text-xl font-black text-destructive shadow-[0_0_20px_rgba(255,0,0,0.2)]">
                        نفدت الكمية
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 z-20">
                    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2.5 py-1">
                      <span className="text-xs text-[#fbbf24]">★</span>
                      <span className="text-xs font-bold text-white">{product.rating}</span>
                    </div>
                  </div>

                  {discountPercent && !product.outOfStock && (
                    <div className="absolute top-3 right-3 z-20">
                      <span className="rounded-full bg-[#ff3b30] px-3 py-1 text-xs font-bold tracking-wider text-white shadow-sm">
                        {`خصم ${discountPercent}%`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-5 text-right" dir="rtl">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className="rounded-full border px-3 py-1 text-xs font-bold"
                      style={{
                        color: category.color,
                        borderColor: `${category.color}30`,
                        backgroundColor: `${category.color}10`,
                      }}
                    >
                      {category.label}
                    </span>
                    <span className="text-xs font-medium text-outline/60">
                      {product.reviewCount || 100} تقييم
                    </span>
                  </div>

                  <h3
                    className={`mb-2.5 line-clamp-2 text-base font-black leading-snug transition-colors ${
                      product.outOfStock ? "text-outline" : "text-on-surface group-hover:text-primary"
                    }`}
                  >
                    {product.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-outline">
                    {product.desc}
                  </p>

                  <div className="mt-auto flex min-h-[66px] items-end justify-between border-t border-outline-variant/10 pt-3">
                    {!product.outOfStock ? (
                      <div className="flex flex-col items-start gap-1.5" dir="rtl">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black leading-none text-white md:text-[1.95rem]">
                            {formatSudanesePrice(product.basePrice)}
                          </span>
                          <span className="text-[11px] font-bold text-primary/75">ج.س</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-baseline gap-1 text-[11px] text-outline/60 line-through">
                            <span>{formatSudanesePrice(originalPrice)}</span>
                            <span>ج.س</span>
                          </span>
                          <span className="flex items-center gap-1 rounded-full border border-[#ff857d]/20 bg-[#ff3b30]/12 px-2 py-0.5 text-[10px] font-bold text-[#ff857d]">
                            <span>وفر</span>
                            <span dir="ltr">{discountPercent}%</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-outline/50">غير متوفر</span>
                    )}

                    <span className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                      product.outOfStock ? "text-outline/40" : "text-primary/70 group-hover:text-primary"
                    }`}>
                      تفاصيل
                      <SiteIcon name="arrow_back" className="text-sm transition-transform group-hover:-translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Arrow buttons (desktop only, hidden on mobile since Swiper handles touch) */}
      <div className="mt-6 hidden justify-center gap-3 md:flex" dir="ltr">
        <button
          onClick={scrollLeft}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_20px_rgba(208,188,255,0.4)] hover:scale-105 hover:bg-primary/90 active:scale-95 transition-all"
        >
          <SiteIcon name="chevron_left" className="text-2xl" />
        </button>
        <button
          onClick={scrollRight}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_20px_rgba(208,188,255,0.4)] hover:scale-105 hover:bg-primary/90 active:scale-95 transition-all"
        >
          <SiteIcon name="chevron_right" className="text-2xl" />
        </button>
      </div>
    </section>
  );
}
