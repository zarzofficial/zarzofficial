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

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function writeFile(targetPath, contents) {
  ensureDirectory(path.dirname(targetPath));
  fs.writeFileSync(targetPath, contents);
}

if (!fs.existsSync(docsIndexPath)) {
  throw new Error(`Missing build output: ${docsIndexPath}`);
}

const shellHtml = fs.readFileSync(docsIndexPath, "utf8");

for (const relativeDir of routeDirectories) {
  writeFile(path.join(docsDir, relativeDir, "index.html"), shellHtml);
}

for (const filename of legacyHtmlFiles) {
  writeFile(path.join(docsDir, filename), shellHtml);
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
