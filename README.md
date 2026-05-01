# ZARZ Official

موقع ومتجر ZARZ للخدمات الرقمية. المشروع مبني باستخدام Vite و React و TypeScript، مع توليد صور متجاوبة ونسخة static داخل مجلد `docs` للنشر.

## المتطلبات

- Node.js 20 أو أحدث
- npm
- مشروع Firebase مضبوط للقواعد والفهارس الموجودة في الجذر

## التشغيل المحلي

```bash
npm install
npm run dev
```

يفتح Vite الخادم المحلي على:

```txt
http://localhost:3000
```

## أوامر مهمة

```bash
npm run lint
```

يفحص TypeScript بدون إخراج ملفات.

```bash
npm run images:responsive
```

يعيد توليد نسخ AVIF المتجاوبة داخل `public/assets` ويحدث `src/generated/responsiveImages.ts`.

```bash
npm run build
```

ينفذ سلسلة البناء الكاملة:

1. توليد الصور المتجاوبة.
2. بناء Vite إلى `docs`.
3. مزامنة ملفات static المطلوبة.
4. prerender لملفات HTML داخل `docs`.

```bash
npm run preview
```

يعرض نسخة البناء محلياً بعد تشغيل `npm run build`.

## النشر

- GitHub Pages ينشر من مجلد `docs` على الفرع الرئيسي.
- Vercel مضبوط لاستخدام `npm run build` وإخراج `docs`.
- Cloudflare Workers/Pages مضبوط عبر `wrangler.jsonc` لاستخدام `docs` كأصول static.

## Firebase

الملفات المرتبطة بـ Firebase:

- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `src/lib/firebase.ts`

قبل تغيير قواعد Firestore، شغّل الفحص المحلي ثم راجع تأثير القواعد على تسجيل الدخول، الطلبات، وحساب المدير.

## بنية المشروع

```txt
src/
  app/          إطار التطبيق ونسخة prerender
  components/   مكونات مشتركة ومكونات واجهة ui
  data/         بيانات المنتجات
  generated/    ملفات مولدة من السكربتات
  lib/          Firebase، السلة، الصور، التسعير، ومساعدات عامة
  pages/        صفحات الموقع
  routes/       راوتات lazy للصفحات الثقيلة
scripts/        سكربتات البناء والصور و prerender
public/         الأصول العامة والصور والخطوط
docs/           ناتج البناء المستخدم للنشر
```

## ملاحظات صيانة

- لا تعدل `src/generated/responsiveImages.ts` يدوياً؛ شغل `npm run images:responsive`.
- لا تحفظ ملفات القياس أو اللوجات في الجذر. استخدم `reports/` محلياً عند الحاجة.
- الصفحات الكبيرة مثل `Home`, `Store`, `Cart`, و `Account` مرشحة للتقسيم إلى مكونات أصغر عند أي تعديل كبير قادم.
