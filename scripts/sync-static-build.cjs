const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const distDir = path.join(rootDir, "dist");
const docsIndexPath = path.join(docsDir, "index.html");

const productEntries = [
  {
    slug: "شات-جي-بي-تي-بلس",
    legacySlug: "شات-جي-بي-تي-بلس-شهر",
    title: "شات جي بي تي بلس (ChatGPT Plus) - شهر واحد",
    description:
      "اشترك في ChatGPT Plus عبر زارز مع تسليم سريع ودعم مباشر للاستفادة من مزايا الذكاء الاصطناعي المتقدمة.",
  },
  {
    slug: "جيميني-برو",
    legacySlug: "جيميني-برو-شهر",
    title: "جيميني برو (Gemini Pro)",
    description:
      "احصل على اشتراك Gemini Pro عبر زارز مع تفعيل سريع ودعم مباشر للوصول إلى أدوات الذكاء الاصطناعي المتقدمة.",
  },
  {
    slug: "إنشاء-متاجر-إلكترونية",
    legacySlug: "انشاء-متجر-الكتروني",
    title: "إنشاء متاجر إلكترونية",
    description:
      "اطلب إنشاء متجر إلكتروني احترافي عبر زارز مع تصميم متوافق مع الجوال وبنية سريعة وخدمة تطوير مخصصة.",
  },
  {
    slug: "تأجير-موقع",
    legacySlug: "تاجير-موقع-او-متجر-الكتروني",
    title: "تأجير موقع إلكتروني",
    description:
      "استأجر موقعًا إلكترونيًا جاهزًا عبر زارز مع إعداد سريع وتجربة مناسبة للأنشطة الرقمية والمتاجر.",
  },
  {
    slug: "تطوير-مواقع",
    legacySlug: "تعديل-المواقع",
    title: "تعديل وتطوير المواقع",
    description:
      "اطلب تعديل وتطوير موقعك عبر زارز لتحسين الأداء والواجهة وتجربة المستخدم دون تغيير غير ضروري في البنية.",
  },
  {
    slug: "متابعين-إنستغرام",
    legacySlug: "متابعين-انستجرام",
    title: "زيادة متابعين إنستغرام",
    description:
      "اشترِ خدمة زيادة متابعين إنستغرام عبر زارز مع باقات واضحة وتنفيذ سريع ودعم مباشر.",
  },
  {
    slug: "متابعين-تيك-توك",
    legacySlug: "متابعين-تيك-توك",
    title: "زيادة متابعين تيك توك",
    description:
      "اشترِ خدمة زيادة متابعين تيك توك عبر زارز مع باقات جاهزة وتنفيذ سريع لدعم نمو حسابك.",
  },
  {
    slug: "متابعين-فيسبوك",
    legacySlug: "متابعين-فيسبوك",
    title: "زيادة متابعين فيسبوك",
    description:
      "اشترِ خدمة زيادة متابعين فيسبوك عبر زارز مع تنفيذ سريع وخيارات مناسبة للنمو والتفاعل.",
  },
  {
    slug: "شدات-ببجي",
    legacySlug: "شدات-ببجي-موبايل",
    title: "شحن شدات UC ببجي موبايل",
    description:
      "اشحن شدات PUBG Mobile عبر زارز بسرعة وموثوقية مع متابعة مباشرة بعد الطلب.",
  },
  {
    slug: "جواهر-فري-فاير",
    legacySlug: "جواهر-فري-فاير",
    title: "شحن مجوهرات فري فاير",
    description:
      "اشحن جواهر Free Fire عبر زارز بسرعة وبخطوات واضحة مع متابعة مباشرة للطلب.",
  },
];

const productSlugs = productEntries.map((entry) => entry.slug);
const legacyProductSlugs = productEntries
  .map((entry) => entry.legacySlug)
  .filter(Boolean);

const catalogRouteDirectories = [
  "products/catalog/social",
  "products/catalog/ai",
  "products/catalog/web",
  "products/catalog/gaming",
];

const routeDirectories = [
  "account",
  "cart",
  "checkout",
  "contact",
  "terms",
  "products",
  "products/catalog",
  ...catalogRouteDirectories,
  "products/cart",
  "products/checkout",
  ...productSlugs.map((slug) => `products/${slug}`),
  ...legacyProductSlugs.map((slug) => `products/${slug}`),
];

const legacyHtmlFiles = ["404.html", "account.html", "contact.html", "terms.html", "store.html"];
const supportFiles = ["CNAME", "robots.txt", "sitemap.xml", "_headers"];
const titlePrefix = "زارز | ZARZ | ";
const defaultTitle = `${titlePrefix}الرئيسية`;
const defaultDescription =
  "زارز متجر رقمي للخدمات والمنتجات الرقمية يشمل اشتراكات الذكاء الاصطناعي، تطوير المواقع والمتاجر، شحن الألعاب، وخدمات السوشيال ميديا بسرعة ودعم مباشر.";

const routeTitles = new Map([
  ["/", defaultTitle],
  ["account", `${titlePrefix}حسابي`],
  ["cart", `${titlePrefix}سلة المشتريات`],
  ["checkout", `${titlePrefix}إتمام الطلب`],
  ["contact", `${titlePrefix}تواصل معنا`],
  ["terms", `${titlePrefix}الشروط والأحكام`],
  ["products", `${titlePrefix}المنتجات`],
  ["products/catalog", `${titlePrefix}المنتجات`],
  ["products/catalog/social", `${titlePrefix}المنتجات | التواصل الاجتماعي`],
  ["products/catalog/ai", `${titlePrefix}المنتجات | الذكاء الاصطناعي`],
  ["products/catalog/web", `${titlePrefix}المنتجات | المواقع والمتاجر`],
  ["products/catalog/gaming", `${titlePrefix}المنتجات | الألعاب`],
  ["products/cart", `${titlePrefix}سلة المشتريات`],
  ["products/checkout", `${titlePrefix}إتمام الطلب`],
  ["404.html", `${titlePrefix}الصفحة غير موجودة`],
  ["account.html", `${titlePrefix}حسابي`],
  ["contact.html", `${titlePrefix}تواصل معنا`],
  ["terms.html", `${titlePrefix}الشروط والأحكام`],
  ["store.html", `${titlePrefix}المنتجات`],
]);

const routeDescriptions = new Map([
  ["/", defaultDescription],
  [
    "account",
    "سجّل الدخول إلى حسابك في زارز لمتابعة الطلبات، إدارة بياناتك، والوصول إلى سجل مشترياتك الرقمية.",
  ],
  [
    "cart",
    "راجع سلة مشترياتك في زارز، أكمل بيانات الطلب، واختر طريقة الدفع المناسبة لإتمام طلبك الرقمي بسرعة.",
  ],
  [
    "checkout",
    "أكمل طلبك في زارز بخطوات واضحة وسريعة مع مراجعة المنتجات وبيانات التواصل وطريقة الدفع.",
  ],
  [
    "contact",
    "تواصل مع فريق زارز للاستفسارات والطلبات الخاصة وخدمات الدعم المتعلقة بالمنتجات والخدمات الرقمية.",
  ],
  [
    "terms",
    "اطلع على الشروط والأحكام وسياسات الطلب والدفع والتسليم الخاصة بمتجر زارز للخدمات الرقمية.",
  ],
  [
    "products",
    "تصفح منتجات زارز الرقمية من اشتراكات الذكاء الاصطناعي، خدمات الويب، شحن الألعاب، وحلول السوشيال ميديا.",
  ],
  [
    "products/catalog",
    "تصفح أقسام منتجات زارز الرقمية حسب الفئة للوصول السريع إلى خدمات الذكاء الاصطناعي والألعاب والويب والسوشيال ميديا.",
  ],
  [
    "products/catalog/social",
    "استكشف خدمات التواصل الاجتماعي في زارز، بما يشمل زيادة المتابعين والتفاعل على المنصات المختلفة.",
  ],
  [
    "products/catalog/ai",
    "استكشف منتجات الذكاء الاصطناعي في زارز مثل اشتراكات ChatGPT Plus وGemini Pro وخدمات رقمية متقدمة.",
  ],
  [
    "products/catalog/web",
    "استكشف خدمات الويب في زارز مثل إنشاء المتاجر وتطوير المواقع والتعديلات البرمجية المخصصة.",
  ],
  [
    "products/catalog/gaming",
    "استكشف خدمات الألعاب في زارز مثل شحن PUBG وFree Fire والمنتجات الرقمية الموجهة للاعبين.",
  ],
  [
    "products/cart",
    "راجع سلة مشترياتك في زارز، أكمل بيانات الطلب، واختر طريقة الدفع المناسبة لإتمام طلبك الرقمي بسرعة.",
  ],
  [
    "products/checkout",
    "أكمل طلبك في زارز بخطوات واضحة وسريعة مع مراجعة المنتجات وبيانات التواصل وطريقة الدفع.",
  ],
  [
    "404.html",
    "الصفحة المطلوبة غير موجودة حاليًا على موقع زارز. يمكنك العودة إلى الصفحة الرئيسية أو تصفح المنتجات المتاحة.",
  ],
  [
    "account.html",
    "سجّل الدخول إلى حسابك في زارز لمتابعة الطلبات، إدارة بياناتك، والوصول إلى سجل مشترياتك الرقمية.",
  ],
  [
    "contact.html",
    "تواصل مع فريق زارز للاستفسارات والطلبات الخاصة وخدمات الدعم المتعلقة بالمنتجات والخدمات الرقمية.",
  ],
  [
    "terms.html",
    "اطلع على الشروط والأحكام وسياسات الطلب والدفع والتسليم الخاصة بمتجر زارز للخدمات الرقمية.",
  ],
  [
    "store.html",
    "تصفح منتجات زارز الرقمية من اشتراكات الذكاء الاصطناعي، خدمات الويب، شحن الألعاب، وحلول السوشيال ميديا.",
  ],
]);

for (const entry of productEntries) {
  routeTitles.set(`products/${entry.slug}`, `${titlePrefix}${entry.title}`);
  routeDescriptions.set(`products/${entry.slug}`, entry.description);

  if (entry.legacySlug) {
    routeTitles.set(`products/${entry.legacySlug}`, `${titlePrefix}${entry.title}`);
    routeDescriptions.set(`products/${entry.legacySlug}`, entry.description);
  }
}

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function writeFile(targetPath, contents) {
  ensureDirectory(path.dirname(targetPath));
  fs.writeFileSync(targetPath, contents);
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function withTitle(html, title) {
  return html.replace(/<title>.*?<\/title>/, `<title>${title || defaultTitle}</title>`);
}

function withMetaDescription(html, description) {
  const metaTag = `<meta name="description" content="${escapeHtmlAttribute(
    description || defaultDescription,
  )}" />`;

  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    return html.replace(/<meta\s+name=["']description["'][^>]*>/i, metaTag);
  }

  return html.replace("</head>", `  ${metaTag}\n  </head>`);
}

function buildRouteHtml(html, routeKey) {
  const title = routeTitles.get(routeKey) || defaultTitle;
  const description = routeDescriptions.get(routeKey) || defaultDescription;
  return withMetaDescription(withTitle(html, title), description);
}

if (!fs.existsSync(docsIndexPath)) {
  throw new Error(`Missing build output: ${docsIndexPath}`);
}

const shellHtml = fs.readFileSync(docsIndexPath, "utf8");

writeFile(docsIndexPath, buildRouteHtml(shellHtml, "/"));

for (const relativeDir of routeDirectories) {
  writeFile(path.join(docsDir, relativeDir, "index.html"), buildRouteHtml(shellHtml, relativeDir));
}

for (const filename of legacyHtmlFiles) {
  writeFile(path.join(docsDir, filename), buildRouteHtml(shellHtml, filename));
}

for (const filename of supportFiles) {
  const sourcePath = path.join(rootDir, filename);
  if (!fs.existsSync(sourcePath)) continue;

  fs.copyFileSync(sourcePath, path.join(docsDir, filename));

  if (fs.existsSync(distDir)) {
    fs.copyFileSync(sourcePath, path.join(distDir, filename));
  }
}

writeFile(path.join(docsDir, ".nojekyll"), "");
