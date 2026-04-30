import { Link, useLocation } from "react-router-dom";
import {
  ORDER_CONFIRMATION_STORAGE_KEY,
  type OrderConfirmationData,
} from "../lib/order-utils";
import { SiteIcon } from "../components/SiteIcon";

function readStoredConfirmation() {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.sessionStorage.getItem(ORDER_CONFIRMATION_STORAGE_KEY);
    if (!rawValue) return null;
    return JSON.parse(rawValue) as OrderConfirmationData;
  } catch {
    return null;
  }
}

function getLocationState(value: unknown) {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<OrderConfirmationData>;
  if (!candidate.orderNumber || !candidate.whatsappLink || !Array.isArray(candidate.items)) {
    return null;
  }

  return candidate as OrderConfirmationData;
}

function formatConfirmationDate(value: string) {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function OrderConfirmation() {
  const location = useLocation();
  const order = getLocationState(location.state) ?? readStoredConfirmation();
  const confirmationDate = order ? formatConfirmationDate(order.createdAt) : "";

  if (!order) {
    return (
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-5xl mx-auto min-h-screen">
        <div className="perf-panel bg-surface-container-low rounded-[2rem] p-8 md:p-12 border border-outline-variant/10 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <SiteIcon name="shopping_basket" className="text-4xl text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-on-surface mb-4">
            لا توجد تفاصيل طلب حالية
          </h1>
          <p className="text-outline leading-relaxed mb-8">
            يمكنك الرجوع إلى السلة وإكمال الطلب من جديد.
          </p>
          <Link
            to="/cart"
            className="inline-flex items-center justify-center gap-2 rounded-full primary-gradient px-8 py-4 font-bold text-on-primary transition-all hover:shadow-[0_10px_30px_rgba(125,60,255,0.4)]"
          >
            <SiteIcon name="arrow_back" />
            الرجوع للسلة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-center mb-14 gap-2 sm:gap-4 rtl">
        {[
          { label: "السلة", icon: "shopping_basket" as const },
          { label: "التفاصيل", icon: "person" as const },
          { label: "الدفع", icon: "payments" as const },
          { label: "التأكيد", icon: "check_circle" as const },
        ].map((step, index, steps) => (
          <div key={step.label} className="contents">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center primary-gradient shadow-[0_0_20px_rgba(208,188,255,0.3)]">
                <SiteIcon name={step.icon} className="text-on-primary" />
              </div>
              <span className="text-xs font-bold text-primary">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 sm:w-14 h-[2px] bg-primary shadow-[0_0_10px_rgba(208,188,255,0.3)]" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <section className="lg:col-span-8 space-y-8">
          <div className="perf-panel bg-surface-container-low rounded-[2rem] p-8 md:p-12 border border-outline-variant/10">
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <SiteIcon name="check_circle" className="text-5xl text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary mb-2">تم استلام طلبك</p>
                <h1 className="text-3xl md:text-5xl font-black font-headline text-on-surface leading-tight mb-4">
                  شكرًا لك، طلبك قيد المراجعة
                </h1>
                <p className="text-outline leading-relaxed">
                  سنراجع تفاصيل الطلب ونبدأ المعالجة حسب طريقة الدفع المختارة.
                </p>
              </div>
            </div>
          </div>

          <div className="perf-panel bg-surface-container-low rounded-3xl p-6 md:p-8 border border-outline-variant/5">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold font-headline text-on-surface">تفاصيل الطلب</h2>
              <span
                data-testid="order-confirmation-number"
                className="rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-bold text-primary"
              >
                #{order.orderNumber}
              </span>
            </div>

            <div className="space-y-5">
              {order.items.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="perf-card bg-background/35 border border-white/5 rounded-2xl p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-on-surface text-lg mb-2">{item.title}</h3>
                      {item.details.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.details.map((detail) => (
                            <span
                              key={`${item.title}-${detail}`}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground"
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-start sm:text-left shrink-0">
                      <p className="text-sm text-outline">الكمية: {item.qty}</p>
                      <p className="font-black text-tertiary">{item.totalPrice.toFixed(2)} ج.س</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            <div className="perf-panel bg-surface-container-high rounded-3xl p-8 border border-outline-variant/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <h2 className="text-xl font-bold font-headline mb-6 text-on-surface">ملخص التأكيد</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4 text-outline">
                  <span>الاسم</span>
                  <span className="text-on-surface font-bold text-left">{order.customerName}</span>
                </div>
                <div className="flex justify-between gap-4 text-outline">
                  <span>رقم الجوال</span>
                  <span dir="ltr" className="text-on-surface font-bold text-left">
                    {order.customerPhone}
                  </span>
                </div>
                {order.customerEmail && (
                  <div className="flex justify-between gap-4 text-outline">
                    <span>البريد</span>
                    <span dir="ltr" className="text-on-surface font-bold text-left break-all">
                      {order.customerEmail}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-4 text-outline">
                  <span>طريقة الدفع</span>
                  <span className="text-on-surface font-bold text-left">{order.paymentMethodLabel}</span>
                </div>
                {order.paymentReference && (
                  <div className="flex justify-between gap-4 text-outline">
                    <span>رقم الإشعار</span>
                    <span dir="ltr" className="text-on-surface font-bold text-left">
                      {order.paymentReference}
                    </span>
                  </div>
                )}
                {confirmationDate && (
                  <div className="flex justify-between gap-4 text-outline">
                    <span>التاريخ</span>
                    <span className="text-on-surface font-bold text-left">{confirmationDate}</span>
                  </div>
                )}
                <div className="h-[1px] bg-outline-variant/20 my-2" />
                <div className="flex justify-between items-center text-on-surface">
                  <span className="text-lg font-bold">الإجمالي</span>
                  <span className="text-2xl font-black text-tertiary">{order.totalText}</span>
                </div>
              </div>

              <a
                data-testid="order-confirmation-whatsapp"
                href={order.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-8 py-4 rounded-full bg-[#25D366] text-white font-bold text-lg transition-all flex items-center justify-center gap-3 hover:shadow-[0_10px_30px_rgba(37,211,102,0.35)] active:scale-[0.98]"
              >
                <SiteIcon name="forum" />
                إرسال طلبك واتساب
              </a>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <Link
                  to="/account"
                  className="w-full py-3 rounded-full bg-surface-container-highest text-primary font-bold text-center hover:bg-white/5 transition-all"
                >
                  تتبع الطلب
                </Link>
                <Link
                  to="/products"
                  className="w-full py-3 rounded-full border border-outline-variant/10 text-outline font-bold text-center hover:text-on-surface hover:bg-white/5 transition-all"
                >
                  متابعة التسوق
                </Link>
              </div>
            </div>

            <div className="perf-card bg-primary/5 rounded-3xl p-6 border border-primary/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <SiteIcon name="verified_user" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">طلبك محفوظ</p>
                <p className="text-[10px] text-outline">ستظهر حالته في صفحة حسابك بعد تسجيل الدخول أو الدخول كزائر.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
