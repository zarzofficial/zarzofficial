const fs = require('fs');
const path = require('path');
const { productPages, siteMeta } = require('./product-seo-data');

const rootDir = path.join(__dirname, '..');
const productsDir = path.join(rootDir, 'products');
const accountDir = path.join(rootDir, 'account');
const contactDir = path.join(rootDir, 'contact');
const termsDir = path.join(rootDir, 'terms');
const sitemapPath = path.join(rootDir, 'sitemap.xml');

const templates = {
    home: fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8'),
    store: fs.readFileSync(path.join(rootDir, 'store.html'), 'utf8'),
    account: fs.readFileSync(path.join(rootDir, 'account.html'), 'utf8'),
    contact: fs.readFileSync(path.join(rootDir, 'contact.html'), 'utf8')
};

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function resetDir(dirPath) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    fs.mkdirSync(dirPath, { recursive: true });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeJson(value) {
    return JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
}

function publicUrl(routePath) {
    return `${siteMeta.domain}${routePath}`;
}

function replaceTag(html, pattern, replacement) {
    return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

function setTitle(html, title) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function setMetaName(html, name, content) {
    const pattern = new RegExp(`<meta\\s+name="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s+content="[^"]*"\\s*/?>`, 'i');
    return replaceTag(html, pattern, `<meta name="${name}" content="${escapeHtml(content)}">`);
}

function setMetaProperty(html, property, content) {
    const safeProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`<meta\\s+property="${safeProperty}"\\s+content="[^"]*"\\s*/?>`, 'i');
    return replaceTag(html, pattern, `<meta property="${property}" content="${escapeHtml(content)}">`);
}

function setCanonical(html, url) {
    const pattern = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
    return replaceTag(html, pattern, `<link rel="canonical" href="${escapeHtml(url)}">`);
}

function setRobots(html, content) {
    return setMetaName(html, 'robots', content);
}

function injectBeforeHeadClose(html, extra) {
    if (!extra) return html;
    return html.replace('</head>', `${extra}\n</head>`);
}

function injectBeforeBodyClose(html, extra) {
    if (!extra) return html;
    return html.replace('</body>', `${extra}\n</body>`);
}

function setHead(html, meta) {
    let next = html;
    next = setTitle(next, meta.title);
    next = setMetaName(next, 'description', meta.description);
    next = setCanonical(next, meta.canonicalUrl);
    next = setMetaProperty(next, 'og:title', meta.ogTitle || meta.title);
    next = setMetaProperty(next, 'og:description', meta.ogDescription || meta.description);
    next = setMetaProperty(next, 'og:url', meta.ogUrl || meta.canonicalUrl);
    next = setMetaProperty(next, 'og:type', meta.ogType || 'website');
    next = setMetaName(next, 'twitter:title', meta.twitterTitle || meta.title);
    next = setMetaName(next, 'twitter:description', meta.twitterDescription || meta.description);

    if (meta.imageUrl) {
        next = setMetaProperty(next, 'og:image', meta.imageUrl);
        next = setMetaName(next, 'twitter:image', meta.imageUrl);
    }

    if (meta.imageAlt) {
        next = setMetaProperty(next, 'og:image:alt', meta.imageAlt);
    }

    if (meta.robots) {
        next = setRobots(next, meta.robots);
    }

    if (meta.extraHead) {
        next = injectBeforeHeadClose(next, meta.extraHead);
    }

    return next;
}

function buildSchemaBlock(schema) {
    return `<script type="application/ld+json">\n${escapeJson(schema)}\n</script>`;
}

function buildProductSchemas(page) {
    const productUrl = publicUrl(`/products/${page.slug}/`);
    const imageUrl = publicUrl(`/${page.imageFile}`);

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: page.title,
        description: page.description.join(' '),
        image: [imageUrl],
        sku: page.id,
        category: page.category,
        url: productUrl,
        brand: {
            '@type': 'Brand',
            name: siteMeta.name
        },
        offers: {
            '@type': 'Offer',
            availability: page.availability === 'OutOfStock'
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
            priceCurrency: 'SDG',
            url: productUrl
        }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'الرئيسية',
                item: publicUrl('/')
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'المنتجات',
                item: publicUrl('/products/')
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: page.title,
                item: productUrl
            }
        ]
    };

    return [buildSchemaBlock(productSchema), buildSchemaBlock(breadcrumbSchema)].join('\n');
}

function buildStorePage(meta) {
    return setHead(templates.store, meta);
}

function buildAccountPage(meta) {
    return setHead(templates.account, meta);
}

function buildContactPage(meta) {
    return setHead(templates.contact, meta);
}

function buildTermsPage(meta) {
    const freshHomeTemplate = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    return setHead(freshHomeTemplate, meta);
}

function writeFile(targetPath, contents) {
    ensureDir(path.dirname(targetPath));
    fs.writeFileSync(targetPath, contents, 'utf8');
}

function buildSitemapEntries() {
    const entries = [
        {
            loc: publicUrl('/'),
            changefreq: 'weekly',
            priority: '1.0'
        },
        {
            loc: publicUrl('/products/'),
            changefreq: 'weekly',
            priority: '0.95'
        },
        {
            loc: publicUrl('/contact/'),
            changefreq: 'monthly',
            priority: '0.7'
        },
        {
            loc: publicUrl('/terms/'),
            changefreq: 'yearly',
            priority: '0.4'
        },
        ...productPages.map((page) => ({
            loc: publicUrl(`/products/${page.slug}/`),
            changefreq: 'weekly',
            priority: '0.8'
        }))
    ];

    const seen = new Set();

    entries.forEach((entry) => {
        if (seen.has(entry.loc)) {
            throw new Error(`Duplicate sitemap URL detected: ${entry.loc}`);
        }

        seen.add(entry.loc);
    });

    return entries;
}

function renderSitemap() {
    const urls = buildSitemapEntries();
    const lastmod = /^\d{4}-\d{2}-\d{2}$/.test(siteMeta.lastmod)
        ? siteMeta.lastmod
        : new Date().toISOString().slice(0, 10);

    const lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ];

    urls.forEach((entry) => {
        lines.push('  <url>');
        lines.push(`    <loc>${entry.loc}</loc>`);
        lines.push(`    <lastmod>${lastmod}</lastmod>`);
        lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
        lines.push(`    <priority>${entry.priority}</priority>`);
        lines.push('  </url>');
    });

    lines.push('</urlset>');
    lines.push('');
    return lines.join('\n');
}

function main() {
    resetDir(productsDir);
    resetDir(accountDir);
    resetDir(contactDir);
    resetDir(termsDir);

    writeFile(
        path.join(productsDir, 'index.html'),
        buildStorePage({
            title: 'المنتجات | زارز أوفشال | ZARZ',
            description: 'تصفح جميع منتجات وخدمات زارز أوفشال عبر صفحة منتجات حقيقية قابلة للأرشفة والفهرسة.',
            canonicalUrl: publicUrl('/products/'),
            ogUrl: publicUrl('/products/'),
            twitterTitle: 'المنتجات | زارز أوفشال | ZARZ',
            robots: 'index, follow'
        })
    );

    writeFile(
        path.join(productsDir, 'cart', 'index.html'),
        buildStorePage({
            title: 'السلة | زارز أوفشال | ZARZ',
            description: 'راجع منتجاتك المختارة داخل سلة زارز أوفشال وأكمل الطلب بسهولة.',
            canonicalUrl: publicUrl('/products/cart/'),
            ogUrl: publicUrl('/products/cart/'),
            twitterTitle: 'السلة | زارز أوفشال | ZARZ',
            robots: 'noindex, nofollow'
        })
    );

    writeFile(
        path.join(productsDir, 'checkout', 'index.html'),
        buildStorePage({
            title: 'إتمام الطلب | زارز أوفشال | ZARZ',
            description: 'أكمل طلبك في زارز أوفشال عبر صفحة دفع ومتابعة واضحة.',
            canonicalUrl: publicUrl('/products/checkout/'),
            ogUrl: publicUrl('/products/checkout/'),
            twitterTitle: 'إتمام الطلب | زارز أوفشال | ZARZ',
            robots: 'noindex, nofollow'
        })
    );

    productPages.forEach((page) => {
        writeFile(
            path.join(productsDir, page.slug, 'index.html'),
            buildStorePage({
                title: `${page.title} | زارز أوفشال | ZARZ`,
                description: page.metaDescription,
                canonicalUrl: publicUrl(`/products/${page.slug}/`),
                ogUrl: publicUrl(`/products/${page.slug}/`),
                ogType: 'product',
                imageUrl: publicUrl(`/${page.imageFile}`),
                imageAlt: page.imageAlt,
                robots: 'index, follow',
                extraHead: buildProductSchemas(page)
            })
        );
    });

    writeFile(
        path.join(accountDir, 'index.html'),
        buildAccountPage({
            title: 'طلباتي | زارز أوفشال | ZARZ',
            description: 'تابع طلباتك الأخيرة في زارز أوفشال من صفحة مستقلة وسهلة التصفح.',
            canonicalUrl: publicUrl('/account/'),
            ogUrl: publicUrl('/account/'),
            robots: 'noindex, nofollow'
        })
    );

    writeFile(
        path.join(contactDir, 'index.html'),
        buildContactPage({
            title: 'تواصل معنا | زارز أوفشال | ZARZ',
            description: 'تواصل مع فريق زارز أوفشال عبر صفحة مستقلة تحتوي على وسائل التواصل والنموذج المباشر.',
            canonicalUrl: publicUrl('/contact/'),
            ogUrl: publicUrl('/contact/'),
            robots: 'index, follow'
        })
    );

    writeFile(
        path.join(termsDir, 'index.html'),
        buildTermsPage({
            title: 'شروط الاستخدام | زارز أوفشال | ZARZ',
            description: 'اطلع على شروط الاستخدام وسياسات الطلب والدفع في زارز أوفشال.',
            canonicalUrl: publicUrl('/terms/'),
            ogUrl: publicUrl('/terms/'),
            robots: 'index, follow'
        })
    );

    writeFile(sitemapPath, renderSitemap());
}

main();
