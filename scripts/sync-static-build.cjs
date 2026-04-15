const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const distDir = path.join(rootDir, "dist");
const docsIndexPath = path.join(docsDir, "index.html");

const productSlugs = [
  "شات-جي-بي-تي-بلس",
  "جيميني-برو",
  "إنشاء-متاجر-إلكترونية",
  "تأجير-موقع",
  "تطوير-مواقع",
  "متابعين-إنستغرام",
  "متابعين-تيك-توك",
  "متابعين-فيسبوك",
  "شدات-ببجي",
  "جواهر-فري-فاير",
];

const legacyProductSlugs = [
  "شات-جي-بي-تي-بلس-شهر",
  "جيميني-برو-شهر",
  "انشاء-متجر-الكتروني",
  "تاجير-موقع-او-متجر-الكتروني",
  "تعديل-المواقع",
  "شدات-ببجي-موبايل",
  "متابعين-انستجرام",
  "متابعين-تيك-توك",
  "متابعين-فيسبوك",
  "جواهر-فري-فاير",
];

const routeDirectories = [
  "account",
  "cart",
  "checkout",
  "contact",
  "terms",
  "products",
  "products/cart",
  "products/checkout",
  ...productSlugs.map((slug) => `products/${slug}`),
  ...legacyProductSlugs.map((slug) => `products/${slug}`),
];

const legacyHtmlFiles = ["404.html", "account.html", "contact.html", "terms.html", "store.html"];
const supportFiles = ["CNAME", "robots.txt", "sitemap.xml", "_headers"];
const titlePrefix = "زارز | ZARZ | ";
const defaultTitle = `${titlePrefix}الرئيسية`;

const routeTitles = new Map([
  ["account", `${titlePrefix}حسابي`],
  ["contact", `${titlePrefix}تواصل معنا`],
  ["terms", `${titlePrefix}الشروط والأحكام`],
  ["products", `${titlePrefix}المنتجات`],
  ["products/cart", `${titlePrefix}سلة المشتريات`],
  ["products/checkout", `${titlePrefix}إتمام الطلب`],
  ["404.html", `${titlePrefix}الصفحة غير موجودة`],
  ["account.html", `${titlePrefix}حسابي`],
  ["contact.html", `${titlePrefix}تواصل معنا`],
  ["terms.html", `${titlePrefix}الشروط والأحكام`],
  ["store.html", `${titlePrefix}المنتجات`],
]);

routeTitles.set("cart", routeTitles.get("products/cart"));
routeTitles.set("checkout", routeTitles.get("products/checkout"));

const productTitles = [
  [productSlugs[0], "شات جي بي تي بلس (ChatGPT Plus) - شهر واحد"],
  [productSlugs[1], "جيميني برو (Gemini Pro)"],
  [productSlugs[2], "إنشاء متاجر إلكترونية"],
  [productSlugs[3], "تأجير موقع إلكتروني"],
  [productSlugs[4], "تعديل وتطوير المواقع"],
  [productSlugs[5], "زيادة متابعين إنستغرام"],
  [productSlugs[6], "زيادة متابعين تيك توك"],
  [productSlugs[7], "زيادة متابعين فيسبوك"],
  [productSlugs[8], "شحن شدات UC ببجي موبايل"],
  [productSlugs[9], "شحن مجوهرات فري فاير"],
];

for (const [slug, title] of productTitles) {
  routeTitles.set(`products/${slug}`, `${titlePrefix}${title}`);
}

for (let index = 0; index < legacyProductSlugs.length; index += 1) {
  const legacySlug = legacyProductSlugs[index];
  const productTitle = productTitles[index]?.[1];
  if (!legacySlug || !productTitle) continue;
  routeTitles.set(`products/${legacySlug}`, `${titlePrefix}${productTitle}`);
}

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function writeFile(targetPath, contents) {
  ensureDirectory(path.dirname(targetPath));
  fs.writeFileSync(targetPath, contents);
}

function withTitle(html, title) {
  return html.replace(/<title>.*?<\/title>/, `<title>${title || defaultTitle}</title>`);
}

if (!fs.existsSync(docsIndexPath)) {
  throw new Error(`Missing build output: ${docsIndexPath}`);
}

const shellHtml = fs.readFileSync(docsIndexPath, "utf8");
const rootHtml = withTitle(shellHtml, defaultTitle);

writeFile(docsIndexPath, rootHtml);

for (const relativeDir of routeDirectories) {
  writeFile(
    path.join(docsDir, relativeDir, "index.html"),
    withTitle(shellHtml, routeTitles.get(relativeDir) || defaultTitle),
  );
}

for (const filename of legacyHtmlFiles) {
  writeFile(path.join(docsDir, filename), withTitle(shellHtml, routeTitles.get(filename) || defaultTitle));
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
