import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingCart, ShieldCheck, HeadphonesIcon, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { getCategoryLabel, getProductBySlugOrId, type ProductVariationGroup } from "../data/products";
import { useCart, type CartVariationSelection } from "../lib/CartContext";
import { formatSudanesePrice, getDiscountPercent, getLegacyOriginalPrice } from "../lib/pricing";

function buildVariationDefaults(groups: ProductVariationGroup[]) {
  return Object.fromEntries(
    groups.map((group) => [group.id, group.options[0]?.id || group.options[0]?.label || ""]),
  );
}

export function ProductDetails() {
  const { id } = useParams();
  const product = getProductBySlugOrId(id);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [targetLink, setTargetLink] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [server, setServer] = useState("global");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [requirements, setRequirements] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const visibleVariationGroups = (product?.variationGroups || []).filter(
    (group) => group.id !== "support" && group.label !== "الدعم",
  );

  useEffect(() => {
    if (!product) return;

    setQuantity(1);
    setSelectedPackageIndex(0);
    setTargetLink("");
    setPlayerId("");
    setServer("global");
    setRecipientPhone("");
    setRequirements("");
    setReferenceLink("");
    setFeedback("");
    setSelectedVariations(buildVariationDefaults(visibleVariationGroups));
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-4 font-heading text-3xl font-black">المنتج غير موجود</h1>
        <p className="mb-8 text-muted-foreground">الرابط المطلوب غير مطابق لأي خدمة حالية داخل المتجر.</p>
        <Button render={<Link to="/products" />}>العودة إلى المتجر</Button>
      </div>
    );
  }

  const packageOptions = product.details.options || [];
  const selectedPackage = packageOptions[selectedPackageIndex] || null;
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const unitPrice = selectedPackage?.price ?? product.basePrice;
  const totalPrice = unitPrice * safeQuantity;
  const totalOriginalPrice = getLegacyOriginalPrice(totalPrice);
  const discountPercent = getDiscountPercent();

  function setVariation(groupId: string, value: string) {
    setSelectedVariations((currentValue) => ({ ...currentValue, [groupId]: value }));
  }

  function collectVariationSelections() {
    return visibleVariationGroups
      .map<CartVariationSelection | null>((group) => {
        const selectedValue = selectedVariations[group.id] || group.options[0]?.id || group.options[0]?.label;
        const option = group.options.find((entry) => (entry.id || entry.label) === selectedValue) || group.options[0];
        if (!option) return null;

        return {
          groupId: group.id,
          groupLabel: group.label,
          optionId: option.id,
          optionLabel: option.label,
        };
      })
      .filter((entry): entry is CartVariationSelection => entry !== null);
  }

  function validateBeforeCart() {
    if (product.category === "social" && !targetLink.trim()) {
      return "أدخل رابط الحساب أو اسم المستخدم قبل المتابعة.";
    }

    if (product.category === "gaming" && product.details.requiresId && !playerId.trim()) {
      return "أدخل رقم اللاعب (الآيدي) قبل المتابعة.";
    }

    if (product.category === "ai" && !recipientPhone.trim()) {
      return "أدخل رقم المستلم أو رقم التواصل قبل المتابعة.";
    }

    if (product.category === "web" && !requirements.trim()) {
      return "اشرح متطلباتك باختصار قبل إضافة الخدمة إلى السلة.";
    }

    return "";
  }

  function createCartItem() {
    const validationError = validateBeforeCart();
    if (validationError) {
      setFeedback(validationError);
      return false;
    }

    addItem({
      productId: product.id,
      productSlug: product.slug,
      title: product.title,
      category: product.category,
      image: product.image,
      qty: safeQuantity,
      unitPrice,
      customData: {
        packageLabel: selectedPackage?.label,
        targetLink: targetLink.trim() || undefined,
        playerId: playerId.trim() || undefined,
        server: product.category === "gaming" ? server : undefined,
        recipientPhone: recipientPhone.trim() || undefined,
        requirements: requirements.trim() || undefined,
        referenceLink: referenceLink.trim() || undefined,
        variations: collectVariationSelections(),
      },
    });

    setFeedback("تمت إضافة الخدمة إلى السلة بنجاح.");
    return true;
  }

  function handleAddToCart() {
    void createCartItem();
  }

  function handleBuyNow() {
    if (!createCartItem()) return;
    navigate("/cart");
  }

  return (
    <div className="container mx-auto cursor-default px-4 pb-12 pt-24 md:py-20">
      <button
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/products"))}
        className="mb-6 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-card/70 px-4 py-2 text-sm font-bold text-on-background shadow-[0_10px_25px_rgba(0,0,0,0.22)] backdrop-blur-md transition-colors hover:border-primary/30 hover:text-primary md:mb-8"
      >
        <ArrowRight className="h-4 w-4" />
        رجوع
      </button>

      <div className="perf-panel relative grid grid-cols-1 gap-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-card/40 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:grid-cols-2 md:gap-12 md:rounded-[2rem] md:p-10 md:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/5 blur-3xl"></div>

        <div
          className="relative z-10 mx-auto aspect-square w-full max-w-[28rem] overflow-hidden rounded-[1.5rem] border border-white/5 bg-background/50 shadow-inner lg:max-w-none lg:rounded-2xl"
          style={{ contain: "content" }}
        >
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
            width={634}
            height={634}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            referrerPolicy="no-referrer"
            sizes="(max-width: 1023px) calc(100vw - 2rem), 46vw"
            draggable={false}
          />
        </div>

        <div className="z-10 flex flex-col">
          <div className="mb-4 inline-block w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-bold text-primary shadow-[0_0_10px_rgba(255,0,122,0.1)]">
            {getCategoryLabel(product.category)}
          </div>

          <h1 className="mb-4 font-heading text-3xl font-black md:text-4xl">{product.title}</h1>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground font-sans">{product.desc}</p>

          <div className="mb-8 space-y-4">
            {packageOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground font-sans">اختر الباقة</label>
                <select
                  value={selectedPackageIndex}
                  onChange={(event) => setSelectedPackageIndex(Number(event.target.value))}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-background/50 px-4 py-3 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.outOfStock}
                >
                  {packageOptions.map((option, index) => (
                    <option key={option.label} value={index} className="bg-background">
                      {option.label} {!product.outOfStock && `- ${formatSudanesePrice(option.price)} ج.س`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {visibleVariationGroups.map((group) => (
              <div key={group.id} className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground font-sans">{group.label}</label>
                <select
                  value={selectedVariations[group.id] || group.options[0]?.id || group.options[0]?.label}
                  onChange={(event) => setVariation(group.id, event.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-background/50 px-4 py-3 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.outOfStock}
                >
                  {group.options.map((option) => (
                    <option key={option.id || option.label} value={option.id || option.label} className="bg-background">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {product.category === "social" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground font-sans">رابط الحساب أو اسم المستخدم</label>
                  <input
                    data-testid="product-target-link"
                    type="text"
                    value={targetLink}
                    onChange={(event) => setTargetLink(event.target.value)}
                    placeholder="https://... أو @username"
                    className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.outOfStock}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground font-sans">الكمية</label>
                  <input
                    data-testid="product-quantity-input"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.outOfStock}
                  />
                </div>
              </>
            )}

            {product.category === "gaming" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground font-sans">السيرفر أو الدولة</label>
                  <select
                    value={server}
                    onChange={(event) => setServer(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-background/50 px-4 py-3 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.outOfStock}
                  >
                    <option value="global" className="bg-background">عالمي</option>
                    <option value="mena" className="bg-background">الشرق الأوسط</option>
                    <option value="asia" className="bg-background">آسيا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground font-sans">رقم اللاعب (الآيدي)</label>
                  <input
                    type="text"
                    value={playerId}
                    onChange={(event) => setPlayerId(event.target.value)}
                    placeholder="مثال: 512345678"
                    className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.outOfStock}
                  />
                </div>
              </>
            )}

            {product.category === "ai" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground font-sans">رقم المستلم أو التواصل</label>
                <input
                  data-testid="product-recipient-phone"
                  type="tel"
                  value={recipientPhone}
                  onChange={(event) => setRecipientPhone(event.target.value.replace(/[^\d+]/g, ""))}
                  placeholder="مثال: 249..."
                  className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.outOfStock}
                />
              </div>
            )}

            {product.category === "web" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground font-sans">وصف الخدمة أو المتطلبات</label>
                  <textarea
                    rows={4}
                    value={requirements}
                    onChange={(event) => setRequirements(event.target.value)}
                    placeholder="اشرح ما تحتاجه بالتفصيل..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-background/50 px-4 py-3 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.outOfStock}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground font-sans">رابط مرجعي (اختياري)</label>
                  <input
                    type="url"
                    value={referenceLink}
                    onChange={(event) => setReferenceLink(event.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.outOfStock}
                  />
                </div>
              </>
            )}
          </div>

          {product.features && product.features.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 font-heading text-xl font-black">مميزات الخدمة</h3>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.features.map((feature, index) => (
                  <li key={`${feature}-${index}`} className="flex items-center gap-2 text-muted-foreground font-sans">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-success drop-shadow-[0_0_5px_rgba(0,230,118,0.5)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="perf-card flex items-center gap-3 rounded-xl border border-white/5 bg-background/50 p-4 backdrop-blur-sm">
              <Zap className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(255,0,122,0.5)]" />
              <div>
                <strong className="block text-sm font-heading">بدء سريع</strong>
                <span className="text-xs text-muted-foreground font-sans">تنفيذ فوري للطلب</span>
              </div>
            </div>
            <div className="perf-card flex items-center gap-3 rounded-xl border border-white/5 bg-background/50 p-4 backdrop-blur-sm">
              <ShieldCheck className="h-6 w-6 text-secondary drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
              <div>
                <strong className="block text-sm font-heading">دفع آمن</strong>
                <span className="text-xs text-muted-foreground font-sans">بوابات موثوقة</span>
              </div>
            </div>
            <div className="perf-card flex items-center gap-3 rounded-xl border border-white/5 bg-background/50 p-4 backdrop-blur-sm">
              <HeadphonesIcon className="h-6 w-6 text-success drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]" />
              <div>
                <strong className="block text-sm font-heading">دعم 24/7</strong>
                <span className="text-xs text-muted-foreground font-sans">متابعة مستمرة</span>
              </div>
            </div>
          </div>

          <div className="perf-card mt-auto rounded-2xl border border-white/5 bg-background/40 p-6 backdrop-blur-md">
            <div className="mb-6 border-b border-white/5 pb-5 text-right" dir="rtl">
              <span className="mb-3 block text-sm font-bold text-muted-foreground font-sans">السعر الإجمالي</span>
              <div className="flex flex-wrap items-end justify-between gap-4">
                {!product.outOfStock ? (
                  <div className="flex flex-col items-start gap-2 text-left" dir="ltr">
                    <div className="flex items-end gap-2">
                      <span className="font-heading text-4xl font-black leading-none text-white md:text-5xl">
                        {formatSudanesePrice(totalPrice)}
                      </span>
                      <span className="pb-1 text-sm font-bold text-primary/80">ج.س</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm text-muted-foreground/80 line-through">
                        {formatSudanesePrice(totalOriginalPrice)} ج.س
                      </span>
                      <span className="rounded-full border border-[#ff857d]/20 bg-[#ff3b30]/12 px-2.5 py-1 text-[10px] font-bold text-[#ff857d]">
                        {`وفر ${discountPercent}%`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-center py-4">
                    <span className="text-xl font-bold tracking-widest text-[#e11d48]/70">غیر متوفر حالياً</span>
                  </div>
                )}
              </div>
            </div>

            {feedback && (
              <div
                data-testid="product-feedback"
                className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                  feedback.includes("تمت")
                    ? "border border-success/20 bg-green-500/10 text-green-400"
                    : "border border-destructive/20 bg-destructive/10 text-destructive"
                }`}
              >
                {feedback}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                data-testid="add-to-cart-button"
                onClick={handleAddToCart}
                size="lg"
                variant="outline"
                className="h-14 flex-1 rounded-xl border-white/10 text-lg transition-all hover:bg-white/5 hover:text-primary backdrop-blur-md"
                disabled={product.outOfStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                أضف للسلة
              </Button>
              <Button
                data-testid="buy-now-button"
                onClick={handleBuyNow}
                size="lg"
                className="h-14 flex-1 rounded-xl text-lg shadow-[0_0_20px_rgba(255,0,122,0.4)] transition-all hover:shadow-[0_0_30px_rgba(255,0,122,0.6)]"
                disabled={product.outOfStock}
              >
                <Zap className="mr-2 h-5 w-5" />
                {product.outOfStock ? "غير متوفر" : "اطلب الآن"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
