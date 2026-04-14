import { Link } from "react-router-dom";
import { products } from "../data/products";
import { formatSudanesePrice, getDiscountPercent, getLegacyOriginalPrice } from "../lib/pricing";

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

  return (
    <section className="relative overflow-hidden bg-background px-6 pt-4 pb-20 md:px-12 md:py-28">
      <div className="pointer-events-none absolute top-0 right-1/4 h-[260px] w-[260px] rounded-full bg-primary/5 blur-[36px] md:h-[500px] md:w-[500px] md:blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[220px] w-[220px] rounded-full bg-tertiary/5 blur-[32px] md:h-[400px] md:w-[400px] md:blur-[100px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-primary sm:backdrop-blur-md">
            الأكثر طلبًا
          </span>
          <h2 className="mb-4 font-headline text-3xl font-black text-on-background md:text-5xl">منتجات مميزة</h2>
          <p className="mx-auto max-w-md text-base font-medium text-outline md:text-lg">اكتشف أكثر الخدمات طلبًا لدينا</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {featured.map((product) => {
            const category = categoryMap[product.category] || { label: product.category, color: "#d0bcff" };
            const discountPercent = getDiscountPercent();
            const originalPrice = getLegacyOriginalPrice(product.basePrice);

            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className={`perf-card group relative flex min-h-[390px] flex-col overflow-hidden rounded-[1.5rem] border border-outline-variant/10 shadow-sm md:shadow-lg md:transition-all md:duration-300 md:hover:-translate-y-1 md:hover:border-primary/30 md:hover:shadow-[0_18px_40px_rgba(208,188,255,0.08)] ${
                  product.outOfStock ? "bg-surface-container-low/40 grayscale-[80%]" : "bg-surface-container-low/80"
                }`}
              >
                {!product.outOfStock && (
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 hidden h-40 w-40 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 md:block md:group-hover:opacity-100"
                    style={{ backgroundColor: `${category.color}15` }}
                  ></div>
                )}

                <div className="relative h-56 w-full overflow-hidden bg-[#0c0a10] md:h-60">
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#0c0a10] to-transparent"></div>

                  {product.outOfStock && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                      <span className="rounded-full border border-destructive/50 bg-destructive/10 px-6 py-2 font-headline text-xl font-black text-destructive shadow-[0_0_20px_rgba(255,0,0,0.2)]">
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
                  />

                  <div className="absolute top-3 left-3 z-20">
                    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 sm:backdrop-blur-sm">
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

                <div className="flex flex-1 flex-col p-5 text-right" dir="rtl">
                  <div className="mb-3 flex items-center justify-between">
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
                    <span className="text-xs font-medium text-outline/60">{product.reviewCount || 100} تقييم</span>
                  </div>

                  <h3
                    className={`mb-2.5 line-clamp-2 text-[15px] font-black leading-snug transition-colors md:text-base ${
                      product.outOfStock ? "text-outline" : "text-on-surface md:group-hover:text-primary"
                    }`}
                  >
                    {product.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-outline">{product.desc}</p>

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

                    <span
                      className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                        product.outOfStock ? "text-outline/40" : "text-primary/70 md:group-hover:text-primary"
                      }`}
                    >
                      تفاصيل
                      <span className="material-symbols-outlined text-sm transition-transform md:group-hover:-translate-x-1">
                        arrow_back
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
