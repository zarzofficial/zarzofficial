import { useEffect, useLayoutEffect, useMemo, useRef, useState, type Attributes } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { products, type Category, type Product } from "../data/products";
import { SiteIcon } from "../components/SiteIcon";
import { useCart } from "../lib/CartContext";
import { formatSudanesePrice, getDiscountPercent, getLegacyOriginalPrice } from "../lib/pricing";

const categories = [
  { id: "all", name: "الكل", desktopOnly: true },
  { id: "social", name: "التواصل الاجتماعي" },
  { id: "ai", name: "الذكاء الاصطناعي" },
  { id: "web", name: "المواقع والمتاجر" },
  { id: "gaming", name: "الألعاب" },
] as const;

type VisibleCategory = Category | "all";

type VirtualStoreItem =
  | {
      key: string;
      kind: "header";
      title: string;
      withTopSpacing: boolean;
    }
  | {
      key: string;
      kind: "row";
      products: Product[];
      isLastRow: boolean;
    };

type StoreViewportMetrics = {
  cardHeight: number;
  imageHeight: number;
  rowGap: number;
  rowHeight: number;
  overscan: number;
  headerHeight: number;
  spacedHeaderHeight: number;
  reduceEffects: boolean;
};

const viewportMetricsByColumns: Record<1 | 2 | 3 | 4, StoreViewportMetrics> = {
  1: {
    cardHeight: 500,
    imageHeight: 284,
    rowGap: 16,
    rowHeight: 516,
    overscan: 15,
    headerHeight: 88,
    spacedHeaderHeight: 184,
    reduceEffects: true,
  },
  2: {
    cardHeight: 516,
    imageHeight: 224,
    rowGap: 28,
    rowHeight: 544,
    overscan: 6,
    headerHeight: 88,
    spacedHeaderHeight: 184,
    reduceEffects: false,
  },
  3: {
    cardHeight: 484,
    imageHeight: 200,
    rowGap: 32,
    rowHeight: 516,
    overscan: 5,
    headerHeight: 88,
    spacedHeaderHeight: 184,
    reduceEffects: false,
  },
  4: {
    cardHeight: 468,
    imageHeight: 184,
    rowGap: 32,
    rowHeight: 500,
    overscan: 4,
    headerHeight: 88,
    spacedHeaderHeight: 184,
    reduceEffects: false,
  },
};

function getColumnCount(width: number) {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

function getViewportMetrics(columns: number) {
  if (columns >= 4) return viewportMetricsByColumns[4];
  if (columns === 3) return viewportMetricsByColumns[3];
  if (columns === 2) return viewportMetricsByColumns[2];
  return viewportMetricsByColumns[1];
}

function chunkProducts(items: Product[], chunkSize: number) {
  const chunks: Product[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

function getCategoryName(categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? categoryId;
}

function isVisibleCategory(value: string | null): value is VisibleCategory {
  return value === "all" || categories.some((category) => category.id === value);
}

function getRequestedCategory(searchParams: URLSearchParams) {
  const requestedCategory = searchParams.get("category");
  return isVisibleCategory(requestedCategory) ? requestedCategory : "all";
}

function buildVirtualItems(groupedProducts: Record<string, Product[]>, columns: number) {
  const items: VirtualStoreItem[] = [];

  Object.entries(groupedProducts).forEach(([categoryId, categoryProducts], sectionIndex) => {
    items.push({
      key: `header-${categoryId}`,
      kind: "header",
      title: getCategoryName(categoryId),
      withTopSpacing: sectionIndex > 0,
    });

    const rows = chunkProducts(categoryProducts, columns);
    rows.forEach((rowProducts, rowIndex) => {
      items.push({
        key: `row-${categoryId}-${rowIndex}`,
        kind: "row",
        products: rowProducts,
        isLastRow: rowIndex === rows.length - 1,
      });
    });
  });

  return items;
}

function getVirtualItemSize(item: VirtualStoreItem | undefined, metrics: StoreViewportMetrics) {
  if (!item) return metrics.rowHeight;

  if (item.kind === "header") {
    return item.withTopSpacing ? metrics.spacedHeaderHeight : metrics.headerHeight;
  }

  return item.isLastRow ? metrics.cardHeight : metrics.rowHeight;
}

function StoreProductCard({
  product,
  onOrderNow,
  onAddToCart,
  metrics,
  staticLayout = false,
  deferContent = false,
}: {
  product: Product;
  onOrderNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  metrics: StoreViewportMetrics;
  staticLayout?: boolean;
  deferContent?: boolean;
} & Attributes) {
  const discountPercent = getDiscountPercent();
  const originalPrice = getLegacyOriginalPrice(product.basePrice);

  return (
    <div
      className={`perf-card group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-outline-variant/10 bg-surface-container-low sm:rounded-2xl ${
        metrics.reduceEffects
          ? "shadow-sm"
          : "shadow-md transition-transform duration-300 md:hover:-translate-y-1 md:hover:shadow-[0_18px_38px_rgba(86,0,202,0.14)]"
      } ${product.outOfStock ? "bg-surface-container-low/40 grayscale-[80%]" : ""}`}
      style={
        deferContent
          ? { contentVisibility: "auto", containIntrinsicSize: `1px ${metrics.cardHeight}px` }
          : undefined
      }
    >
      <Link
        to={`/products/${product.id}`}
        className="block relative w-full overflow-hidden bg-surface-container-highest"
        style={staticLayout ? undefined : { height: metrics.imageHeight }}
      >
        {staticLayout && <div className="h-[284px] sm:h-[224px] lg:h-[200px] xl:h-[184px]" aria-hidden="true" />}
        {product.outOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <span className="rounded-full border border-destructive/50 bg-destructive/10 px-6 py-2 font-headline text-xl font-black text-destructive shadow-[0_0_20px_rgba(255,0,0,0.2)]">
              نفدت الكمية
            </span>
          </div>
        )}
        <img
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-[1.03] ${product.outOfStock ? "opacity-50" : ""}`}
          src={product.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          referrerPolicy="no-referrer"
          width={634}
          height={634}
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-b from-black/60 via-transparent to-black/20 p-3 pointer-events-none sm:p-4">
          <div className="flex justify-end w-full">
            {discountPercent && !product.outOfStock && (
              <span
                className="ml-auto rounded-full bg-[#ff3b30] px-2.5 py-1 text-[11px] font-bold tracking-wider text-white shadow-sm sm:px-3 sm:text-xs"
                style={{ marginRight: "auto", marginLeft: "0" }}
              >
                {`-${discountPercent}%`}
              </span>
            )}
          </div>
          <div className="mt-auto flex items-end">
            <span
              className={`rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[11px] font-bold text-white sm:text-xs ${
                metrics.reduceEffects ? "" : "sm:backdrop-blur-sm"
              }`}
            >
              {product.rating} ★
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className={`mb-2 line-clamp-1 text-[1.05rem] font-bold sm:text-xl ${product.outOfStock ? "text-outline" : ""}`}>
          {product.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-[13px] text-outline sm:mb-4 sm:text-sm">{product.desc}</p>

        <div className="mt-auto flex flex-col gap-3 border-t border-outline-variant/10 pt-3 sm:gap-4 sm:pt-4">
          <div className="flex w-full min-h-[66px] items-end justify-between">
            {!product.outOfStock ? (
              <div className="flex flex-col items-start gap-1.5" dir="rtl">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-[1.7rem] font-black leading-none text-white sm:text-[1.9rem] ${metrics.reduceEffects ? "" : "drop-shadow-sm"}`}>
                    {formatSudanesePrice(product.basePrice)}
                  </span>
                  <span className="text-[10px] font-bold text-primary/75 sm:text-[11px]">ج.س</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="flex items-baseline gap-1 text-[11px] text-outline/60 line-through sm:text-xs">
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
          </div>

          <div className="flex w-full items-center gap-2 sm:gap-3">
            <button
              disabled={product.outOfStock}
              onClick={() => onOrderNow(product)}
              className="flex-1 rounded-full primary-gradient py-2.5 text-center text-[12px] font-bold text-on-primary shadow-sm transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale sm:py-3 sm:text-[13px] md:text-base md:hover:scale-[1.02]"
            >
              اطلب الآن
            </button>
            <button
              disabled={product.outOfStock}
              onClick={() => onAddToCart(product)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-highest text-primary shadow-sm transition-colors active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-transparent sm:h-12 sm:w-12 md:hover:bg-primary/10"
            >
              <SiteIcon name="add_shopping_cart" className="text-base sm:text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreStaticSections({
  groupedProducts,
  onOrderNow,
  onAddToCart,
  metrics,
}: {
  groupedProducts: Record<string, Product[]>;
  onOrderNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  metrics: StoreViewportMetrics;
}) {
  return (
    <main className="mx-auto max-w-screen-2xl px-6 md:px-12">
      {Object.entries(groupedProducts).map(([categoryId, categoryProducts]) => (
        <section key={categoryId} className="perf-mobile-section pb-12 first:pt-0" data-perf-size="tall">
          <div className="flex h-full items-end pb-8">
            <div className="flex w-full items-center justify-between">
              <h2 className="border-r-4 border-primary pr-4 font-headline text-3xl font-bold">
                {getCategoryName(categoryId)}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {categoryProducts.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                onOrderNow={onOrderNow}
                onAddToCart={onAddToCart}
                metrics={metrics}
                staticLayout
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

function StoreVirtualizedSections({
  activeCategory,
  virtualItems,
  viewportMetrics,
  onOrderNow,
  onAddToCart,
}: {
  key?: string | number;
  activeCategory: VisibleCategory;
  virtualItems: VirtualStoreItem[];
  viewportMetrics: StoreViewportMetrics;
  onOrderNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}) {
  const [scrollMargin, setScrollMargin] = useState(0);
  const listRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const updateScrollMargin = () => {
      if (!listRef.current) return;
      setScrollMargin(listRef.current.getBoundingClientRect().top + window.scrollY);
    };

    updateScrollMargin();
    window.addEventListener("resize", updateScrollMargin, { passive: true });

    return () => window.removeEventListener("resize", updateScrollMargin);
  }, [activeCategory, virtualItems.length]);

  const rowVirtualizer = useWindowVirtualizer({
    count: virtualItems.length,
    estimateSize: (index) => getVirtualItemSize(virtualItems[index], viewportMetrics),
    overscan: viewportMetrics.overscan,
    scrollMargin,
    getItemKey: (index) => virtualItems[index]?.key ?? index,
  });

  return (
    <main ref={listRef} className="mx-auto max-w-screen-2xl px-6 md:px-12">
      <div className="relative w-full" style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = virtualItems[virtualRow.index];

          if (!item) return null;

          const itemHeight = getVirtualItemSize(item, viewportMetrics);

          return (
            <div
              key={item.key}
              data-index={virtualRow.index}
              className="absolute top-0 left-0 w-full"
              style={{
                height: itemHeight,
                transform: `translate3d(0, ${virtualRow.start - scrollMargin}px, 0)`,
              }}
            >
              {item.kind === "header" ? (
                <div className="flex h-full items-end pb-8">
                  <div className="flex w-full items-center justify-between">
                    <h2 className="border-r-4 border-primary pr-4 font-headline text-3xl font-bold">{item.title}</h2>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col" style={{ paddingBottom: item.isLastRow ? 0 : viewportMetrics.rowGap }}>
                  <div className="grid h-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
                    {item.products.map((product) => (
                      <StoreProductCard
                        key={product.id}
                        product={product}
                        onOrderNow={onOrderNow}
                        onAddToCart={onAddToCart}
                        metrics={viewportMetrics}
                        deferContent
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
function MobileCategorySlider({
  category,
  products,
  onOrderNow,
  onAddToCart,
  metrics,
}: {
  category: { id: string; name: string };
  products: Product[];
  onOrderNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  metrics: StoreViewportMetrics;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const currentScroll = Math.abs(scrollLeft);
      setIsAtStart(currentScroll <= 10);
      setIsAtEnd(currentScroll >= scrollWidth - clientWidth - 10);
    }
  };

  useLayoutEffect(() => {
    checkScroll();
  }, [products]);

  const scrollLeftBtn = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRightBtn = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  if (!products.length) return null;

  return (
    <div id={`category-${category.id}`} className="mb-14">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-12 flex items-center justify-between mb-8">
        <h2 className="border-r-4 border-primary pr-4 font-headline text-2xl font-bold">{category.name}</h2>
        <div className="flex gap-2" dir="ltr">
          <button
            onClick={scrollLeftBtn}
            disabled={isAtEnd}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              !isAtEnd
                ? "bg-primary text-white shadow-[0_0_15px_rgba(208,188,255,0.3)] hover:scale-105 active:scale-95"
                : "border border-primary/20 bg-surface-container/50 opacity-40 cursor-not-allowed"
            }`}
          >
            <SiteIcon name="chevron_left" className="text-2xl" />
          </button>
          <button
            onClick={scrollRightBtn}
            disabled={isAtStart}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              !isAtStart
                ? "bg-primary text-white shadow-[0_0_15px_rgba(208,188,255,0.3)] hover:scale-105 active:scale-95"
                : "border border-primary/20 bg-surface-container/50 opacity-40 cursor-not-allowed"
            }`}
          >
            <SiteIcon name="chevron_right" className="text-2xl" />
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="perf-horizontal-cards flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 md:px-12 w-full pb-4"
        dir="rtl"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product) => (
          <div key={product.id} className="shrink-0 snap-center w-[290px] h-full">
            <StoreProductCard 
              product={product} 
              onOrderNow={onOrderNow} 
              onAddToCart={onAddToCart} 
              metrics={metrics} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Store() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const initialCategory = getRequestedCategory(searchParams);
  const [activeCategory, setActiveCategory] = useState<VisibleCategory>(initialCategory);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [columns, setColumns] = useState(1);
  const [enableVirtualLayout, setEnableVirtualLayout] = useState(false);
  const toastTimeoutRef = useRef<number | undefined>(undefined);

  const viewportMetrics = getViewportMetrics(columns);
  const staticMetrics = getViewportMetrics(columns);
  const effectiveCategory = enableVirtualLayout && columns === 1 && activeCategory === "all" ? "social" : activeCategory;
  const shouldUseVirtualLayout = enableVirtualLayout && columns > 1;

  useEffect(() => {
    const handleResize = () => {
      const nextColumns = getColumnCount(window.innerWidth);
      setColumns((currentColumns) => (currentColumns === nextColumns ? currentColumns : nextColumns));
    };

    handleResize();
    setEnableVirtualLayout(true);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const categoryQuery = getRequestedCategory(searchParams);
    if (categoryQuery !== activeCategory) {
      setActiveCategory(categoryQuery);
    }
  }, [activeCategory, searchParams]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (effectiveCategory === "all") return products;
    return products.filter((product) => product.category === effectiveCategory);
  }, [effectiveCategory]);

  const groupedProducts = useMemo(
    () =>
      filteredProducts.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {} as Record<string, Product[]>),
    [filteredProducts],
  );

  const virtualItems = useMemo(() => buildVirtualItems(groupedProducts, columns), [columns, groupedProducts]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId as VisibleCategory);
    setSearchParams(
      { category: categoryId }, 
      { replace: true, preventScrollReset: true }
    );
  };

  const handleOrderNow = (product: Product) => {
    addToCart({ ...product, qty: 1, price: product.basePrice });
    navigate("/cart");
  };

  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, qty: 1, price: product.basePrice });
    setToastMessage(`تم إضافة ${product.title} إلى السلة بنجاح`);

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-24 text-on-background">
      <header className="mx-auto max-w-screen-2xl px-6 pb-16 pt-16 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="font-headline text-5xl font-black leading-tight tracking-tight text-primary md:text-6xl">
              عالم من <br />
              <span className="royal-gradient-text">التميز الرقمي</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-outline">
              اكتشف مجموعة واسعة من الخدمات المتميزة المصممة لتعزيز حضورك الرقمي، من الذكاء الاصطناعي إلى تطوير المواقع وأكثر.
            </p>
            <div className="flex gap-4">
              <div className="h-1 w-20 rounded-full bg-primary/80"></div>
              <div className="h-1 w-8 rounded-full bg-surface-container-highest"></div>
            </div>
          </div>
          <div className="relative hidden h-64 lg:block">
            <div className="absolute inset-0 overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-low opacity-80">
              <img
                alt="digital abstract"
                className="h-full w-full object-cover mix-blend-screen"
                src="/store-header.png"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-full bg-primary/10 blur-3xl"></div>
          </div>
        </div>
      </header>

      <section className="perf-scroll-strip mx-auto mb-16 max-w-screen-2xl overflow-x-auto px-6 no-scrollbar md:px-12">
        <div className="flex gap-4 pb-4">
          {categories
            .filter((cat) => columns > 1 || !("desktopOnly" in cat && cat.desktopOnly))
            .map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`whitespace-nowrap rounded-full px-8 py-3 font-bold transition-colors ${
                effectiveCategory === category.id
                  ? "primary-gradient text-on-primary shadow-lg shadow-primary/20"
                  : "bg-surface-container text-outline hover:text-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {filteredProducts.length === 0 ? (
        <main className="mx-auto max-w-screen-2xl px-6 md:px-12">
          <div className="py-20 text-center text-outline">لا توجد منتجات متاحة في هذا القسم حالياً.</div>
        </main>
      ) : shouldUseVirtualLayout ? (
        <StoreVirtualizedSections
          key={effectiveCategory}
          activeCategory={effectiveCategory}
          virtualItems={virtualItems}
          viewportMetrics={viewportMetrics}
          onOrderNow={handleOrderNow}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <StoreStaticSections
          groupedProducts={groupedProducts}
          onOrderNow={handleOrderNow}
          onAddToCart={handleAddToCart}
          metrics={staticMetrics}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 z-[100] flex w-[90%] max-w-sm -translate-x-1/2 items-center gap-3 rounded-full bg-[#25D366] px-6 py-4 font-bold text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] md:w-auto">
          <SiteIcon name="check_circle" className="text-[24px]" />
          <span className="text-sm md:text-base">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
