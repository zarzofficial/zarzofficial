import { useMemo, useState } from "react";
import { TrustedCompanies } from "../components/TrustedCompanies";
import { SiteIcon, type SiteIconName } from "../components/SiteIcon";
import { formatSudanesePrice } from "../lib/pricing";

const WHATSAPP_NUMBER = "201500007300";
const PAGE_PRICE = 225000;
const DOMAIN_PRICE = 530000;
const PAYMENT_GATEWAY_PRICE = 620000;
const BRAND_PRICE = 125000;

type InfoCard = {
  icon: SiteIconName;
  title: string;
  description: string;
};

const needItems: InfoCard[] = [
  {
    icon: "trending_up",
    title: "توسع أسرع",
    description: "موقعك يفتح قناة بيع وتسويق تعمل طوال اليوم وتساعد العملاء يفهمون عرضك قبل التواصل.",
  },
  {
    icon: "verified_user",
    title: "ثقة أعلى",
    description: "الواجهة المنظمة والصفحات الواضحة تجعل علامتك أكثر جدية وتقلل تردد العميل قبل الشراء.",
  },
  {
    icon: "payments",
    title: "طلبات أسهل",
    description: "المتجر أو نموذج الطلب يختصر المحادثات الطويلة ويجمع بيانات العميل بشكل مرتب.",
  },
];

const serviceItems: InfoCard[] = [
  {
    icon: "code",
    title: "تصميم وتطوير كامل",
    description: "ننفذ صفحات عصرية وسريعة، متوافقة مع الهواتف، ومبنية حول هدف واضح: طلب، حجز، بيع، أو تعريف بالخدمة.",
  },
  {
    icon: "storefront",
    title: "متاجر إلكترونية",
    description: "كتالوج منتجات، صفحات تفاصيل، سلة، وربط طلبات واتساب أو بوابة دفع حسب احتياج المشروع.",
  },
  {
    icon: "terminal",
    title: "إطلاق وتجهيز",
    description: "نجهز الدومين، الربط، أساسيات السيو، ونراجع التجربة قبل التسليم حتى يكون الموقع جاهزاً للنشر.",
  },
];

const featureItems: InfoCard[] = [
  {
    icon: "phone_iphone",
    title: "متجاوب بالكامل",
    description: "تصميم واضح على الموبايل والتابلت والديسكتوب بدون تشويه أو تداخل.",
  },
  {
    icon: "bolt",
    title: "أداء سريع",
    description: "صفحات خفيفة ومنظمة حتى يشعر العميل بسرعة التصفح من أول زيارة.",
  },
  {
    icon: "shield",
    title: "بناء قابل للتطوير",
    description: "نترك لك أساساً نظيفاً يمكن إضافة صفحات، منتجات، أو خصائص جديدة عليه لاحقاً.",
  },
  {
    icon: "support_agent",
    title: "متابعة بعد التسليم",
    description: "نوضح طريقة الاستخدام ونبقى معك في التعديلات الأساسية بعد الإطلاق.",
  },
];

const workSteps = [
  "نفهم فكرة المشروع والجمهور والصفحات المطلوبة.",
  "نحدد الهيكل والسعر والمدة بشكل واضح قبل البدء.",
  "نصمم الواجهة ونراجعها معك قبل التطوير النهائي.",
  "نطور الموقع ونختبره على الهاتف والديسكتوب.",
  "نسلم المشروع ونساعد في الإطلاق والربط.",
];

const siteTypes = [
  "موقع شركة أو مؤسسة",
  "متجر إلكتروني",
  "صفحة هبوط لحملة إعلانية",
  "موقع خدمات وحجوزات",
  "بورتفوليو شخصي أو معرض أعمال",
  "كتالوج منتجات مع طلب عبر واتساب",
];

const faqs = [
  {
    question: "كم يستغرق تنفيذ الموقع؟",
    answer: "يعتمد على عدد الصفحات والخصائص، لكن المشاريع الصغيرة تبدأ عادة من عدة أيام بعد اعتماد التفاصيل والمحتوى.",
  },
  {
    question: "هل يمكن ربط المتجر بواتساب؟",
    answer: "نعم، يمكن تجهيز أزرار طلب ورسائل واتساب جاهزة تجمع بيانات العميل والمنتجات أو تفاصيل الخدمة.",
  },
  {
    question: "هل السعر في الحاسبة نهائي؟",
    answer: "الحاسبة تعطي تقديراً واضحاً حسب الخيارات الأساسية، وقد يتغير السعر إذا احتاج المشروع خصائص خاصة أو تكاملات إضافية.",
  },
  {
    question: "هل تساعدون في الدومين وبوابة الدفع؟",
    answer: "نعم، يمكن إضافة الدومين وبوابة الدفع ضمن الطلب، وسنوضح المتطلبات والخطوات المناسبة قبل التنفيذ.",
  },
];

function yesNo(value: boolean) {
  return value ? "نعم" : "لا";
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-9 max-w-3xl text-center md:mb-12">
      <span className="mb-3 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary md:text-sm">
        {eyebrow}
      </span>
      <h2 className="font-headline text-3xl font-black leading-tight text-on-background md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-outline md:text-lg md:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}

function InfoGrid({ items }: { items: InfoCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="perf-card rounded-[1.15rem] border border-outline-variant/12 bg-surface-container-low/70 p-5 shadow-[0_12px_34px_rgba(0,0,0,0.18)] md:p-6"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <SiteIcon name={item.icon} className="text-2xl" />
          </div>
          <h3 className="mb-3 font-headline text-xl font-black text-on-background">{item.title}</h3>
          <p className="text-sm leading-7 text-outline">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export function WebDevelopment() {
  const [pageCount, setPageCount] = useState(5);
  const [includeDomain, setIncludeDomain] = useState(false);
  const [includePaymentGateway, setIncludePaymentGateway] = useState(false);
  const [includeBrand, setIncludeBrand] = useState(false);
  const [details, setDetails] = useState("");

  const totalPrice = useMemo(() => {
    return (
      pageCount * PAGE_PRICE +
      (includeDomain ? DOMAIN_PRICE : 0) +
      (includePaymentGateway ? PAYMENT_GATEWAY_PRICE : 0) +
      (includeBrand ? BRAND_PRICE : 0)
    );
  }, [includeBrand, includeDomain, includePaymentGateway, pageCount]);

  const handlePageCountChange = (value: string) => {
    const nextValue = Math.max(1, Math.floor(Number(value) || 1));
    setPageCount(nextValue);
  };

  const handleWhatsappSubmit = () => {
    const message = [
      "طلب تطوير موقع أو متجر إلكتروني",
      "",
      `عدد الصفحات: ${pageCount}`,
      `إضافة دومين: ${yesNo(includeDomain)}`,
      `إضافة بوابة دفع: ${yesNo(includePaymentGateway)}`,
      `تصميم شعار أو براند: ${yesNo(includeBrand)}`,
      `السعر الإجمالي التقريبي: ${formatSudanesePrice(totalPrice)} ج.س`,
      "",
      "تفاصيل المشروع:",
      details.trim() || "لم يتم كتابة تفاصيل إضافية.",
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background text-on-background" dir="rtl">
      <section className="relative overflow-hidden px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-36">
        <div className="absolute inset-0 z-0">
          <img
            src="/store-header.png"
            alt=""
            className="h-full w-full object-cover opacity-35"
            loading="eager"
            decoding="async"
            width={1024}
            height={1024}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,7,27,0.68),rgba(29,12,38,0.95))]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-bold text-primary md:text-sm">
            <SiteIcon name="code" className="text-lg" />
            تطوير مواقع ومتاجر إلكترونية
          </span>
          <h1 className="mx-auto max-w-4xl font-headline text-[2.45rem] font-black leading-[1.15] text-white md:text-6xl">
            طوّر موقعك أو متجرك الإلكتروني باحتراف
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#d8d0e8] md:text-xl md:leading-9">
            نقدم تصميم وتطوير مواقع ومتاجر إلكترونية بشكل عصري وسريع ومتجاوب، مبنية لتعرض خدماتك بوضوح وتحول الزائر إلى عميل.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#website-order"
              className="primary-gradient inline-flex h-14 w-full max-w-[17rem] items-center justify-center gap-2 rounded-full px-7 text-base font-black text-on-primary shadow-[0_16px_36px_rgba(125,60,255,0.32)] transition-transform active:scale-[0.98] sm:w-auto"
            >
              اطلب موقعك الآن
              <SiteIcon name="arrow_back" className="text-lg" />
            </a>
            <a
              href="#website-calculator"
              className="inline-flex h-14 w-full max-w-[17rem] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/6 px-7 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              احسب التكلفة
              <SiteIcon name="payments" className="text-lg" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="لماذا الآن؟"
            title="لماذا تحتاج موقع أو متجر إلكتروني؟"
            description="وجودك الرقمي لا يكتمل بصفحة تواصل فقط؛ الموقع المنظم يجعل عرضك واضحاً، ويختصر وقت البيع، ويعطي العميل تجربة أكثر احترافاً."
          />
          <InfoGrid items={needItems} />
        </div>
      </section>

      <TrustedCompanies className="bg-surface/25" />

      <section className="bg-surface/35 px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="ماذا نقدم؟"
            title="من الفكرة إلى موقع جاهز للإطلاق"
            description="نرتب المحتوى، نصمم الواجهة، نطور الصفحات، ونجهز أساسيات الإطلاق حتى تبدأ بموقع واضح وقابل للنمو."
          />
          <InfoGrid items={serviceItems} />
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="مميزات الخدمة"
            title="تجربة واضحة لعميلك وسهلة لإدارتك"
          />
          <InfoGrid items={featureItems} />
        </div>
      </section>

      <section className="bg-surface/35 px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="mb-3 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary md:text-sm">
              خطوات العمل
            </span>
            <h2 className="font-headline text-3xl font-black leading-tight md:text-5xl">
              مسار واضح من أول رسالة حتى الإطلاق
            </h2>
            <p className="mt-4 text-sm leading-7 text-outline md:text-lg md:leading-8">
              كل خطوة لها هدف محدد حتى تعرف ماذا سيتم تنفيذه، ومتى ترى النسخة الأولى، وكيف يتم التسليم.
            </p>
          </div>
          <div className="space-y-4">
            {workSteps.map((step, index) => (
              <div key={step} className="perf-card flex gap-4 rounded-[1.15rem] border border-outline-variant/12 bg-surface-container-low/70 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-7 text-[#d8d0e8] md:text-base">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="أنواع المواقع"
            title="ننفذ أكثر من نوع حسب هدف مشروعك"
            description="سواء كان المطلوب حضوراً تعريفياً بسيطاً أو متجر منتجات، نختار الهيكل المناسب للفكرة والسوق."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siteTypes.map((type) => (
              <div key={type} className="flex items-center gap-3 rounded-[1rem] border border-outline-variant/12 bg-surface-container-low/70 px-5 py-4">
                <SiteIcon name="check_circle" className="text-xl text-primary" />
                <span className="font-bold text-on-background">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="website-calculator" className="px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionTitle
            eyebrow="حاسبة تطوير الموقع"
            title="احسب تكلفة مشروعك مباشرة"
            description="اختر عدد الصفحات والإضافات المطلوبة، وسيظهر السعر الإجمالي فوراً."
          />

          <div id="website-order" className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div className="perf-card rounded-[1.5rem] border border-primary/15 bg-surface-container-low p-5 shadow-[0_18px_48px_rgba(0,0,0,0.25)] md:p-7">
              <div className="mb-6">
                <label htmlFor="page-count" className="mb-3 block text-sm font-bold text-[#d8d0e8]">
                  عدد الصفحات
                </label>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <input
                    id="page-count"
                    type="number"
                    min={1}
                    step={1}
                    value={pageCount}
                    onChange={(event) => handlePageCountChange(event.target.value)}
                    className="h-14 w-full rounded-2xl border border-outline-variant/25 bg-background/55 px-4 text-lg font-black text-white outline-none ring-primary/40 transition focus:border-primary/50 focus:ring-2"
                  />
                  <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-outline">
                    الصفحة = {formatSudanesePrice(PAGE_PRICE)} ج.س
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "domain",
                    label: "إضافة دومين",
                    price: DOMAIN_PRICE,
                    checked: includeDomain,
                    onChange: setIncludeDomain,
                  },
                  {
                    id: "payment",
                    label: "إضافة بوابة دفع",
                    price: PAYMENT_GATEWAY_PRICE,
                    checked: includePaymentGateway,
                    onChange: setIncludePaymentGateway,
                  },
                  {
                    id: "brand",
                    label: "تصميم شعار أو براند",
                    price: BRAND_PRICE,
                    checked: includeBrand,
                    onChange: setIncludeBrand,
                  },
                ].map((option) => (
                  <label
                    key={option.id}
                    htmlFor={option.id}
                    className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-outline-variant/15 bg-background/35 px-4 py-4 transition-colors hover:border-primary/30"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        id={option.id}
                        type="checkbox"
                        checked={option.checked}
                        onChange={(event) => option.onChange(event.target.checked)}
                        className="h-5 w-5 accent-primary"
                      />
                      <span className="font-bold text-on-background">{option.label}</span>
                    </span>
                    <span className="shrink-0 text-sm font-black text-primary">
                      +{formatSudanesePrice(option.price)}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 rounded-[1.25rem] border border-primary/20 bg-primary/10 p-5 text-center">
                <span className="block text-sm font-bold text-outline">السعر الإجمالي التقريبي</span>
                <strong className="mt-2 block font-headline text-4xl font-black text-white md:text-5xl">
                  {formatSudanesePrice(totalPrice)}
                  <span className="mr-2 text-sm text-primary/85">ج.س</span>
                </strong>
              </div>
            </div>

            <div className="perf-card rounded-[1.5rem] border border-outline-variant/12 bg-surface-container-low p-5 shadow-[0_18px_48px_rgba(0,0,0,0.25)] md:p-7">
              <label htmlFor="project-details" className="mb-3 block text-sm font-bold text-[#d8d0e8]">
                نموذج طلب تطوير موقع
              </label>
              <textarea
                id="project-details"
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                rows={10}
                placeholder="اكتب فكرة المشروع، نوع الموقع المطلوب، تفاصيل المتجر، رابط موقع مشابه، أو أي ملاحظات إضافية..."
                className="min-h-[260px] w-full resize-y rounded-2xl border border-outline-variant/25 bg-background/55 px-4 py-4 text-sm leading-7 text-white outline-none ring-primary/40 transition placeholder:text-outline/70 focus:border-primary/50 focus:ring-2"
              />
              <button
                type="button"
                onClick={handleWhatsappSubmit}
                className="primary-gradient mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 text-base font-black text-on-primary shadow-[0_16px_36px_rgba(125,60,255,0.3)] transition-transform active:scale-[0.98]"
              >
                إرسال الطلب عبر واتساب
                <SiteIcon name="send" className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface/35 px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          <SectionTitle
            eyebrow="أسئلة شائعة"
            title="إجابات سريعة قبل بدء المشروع"
          />
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="perf-card rounded-[1rem] border border-outline-variant/12 bg-surface-container-low/70 p-5">
                <summary className="cursor-pointer list-none font-headline text-lg font-black text-on-background">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-outline">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
