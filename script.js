// Products Database
const products = [
    {
        id: 'sub1', title: 'شات جي بي تي بلس - ChatGPT Plus', category: 'subscriptions',
        desc: 'استمتع بأقوى نسخة من شات جي بي تي مع سرعة وأداء متقدم. يمنحك هذا الاشتراك وصولاً لأحدث نماذج الذكاء الاصطناعي، إنشاء الصور، تحليل الملفات، والمساعدة السلسة في المهام اليومية.<br> • استجابات أسرع وأكثر دقة<br> • استخدام مكثف بدون حدود مزعجة<br> • دعم رفع وتحليل الملفات<br> • إنشاء الصور وقدرات ذكاء اصطناعي متقدمة<br> • تجربة مخصصة مع أحدث الميزات.', basePrice: 9999 / 940,
        icon: '<img src="./assets/chatgpt-plus-v4.webp" alt="ChatGPT Plus" class="full-cover-img">',
        rating: '5.0', details: { type: 'حساب خاص', duration: 'شهر واحد', delivery: 'واتساب', options: [{ label: 'اشتراك شهر واحد', price: 9999 / 940 }] }
    },
    {
        id: 'sub2', title: 'جيميني برو - Gemini Pro', category: 'subscriptions',
        desc: 'وصول لنسخة Gemini Advanced المتميزة. يُسلّم عبر الواتساب.', basePrice: 10,
        icon: '<img src="./assets/gemini-pro-v3.webp" alt="Gemini Pro" class="full-cover-img">',
        rating: '4.9', details: { type: 'حساب خاص', duration: 'شهر واحد', delivery: 'واتساب', options: [{ label: 'اشتراك شهر واحد', price: 10 }] }
    },
    {
        id: 'web1', title: 'إنشاء متجر إلكتروني', category: 'webdev',
        desc: 'إنشاء شامل لمتجر إلكتروني متميز ومتجاوب بتصميم عصري احترافي.', basePrice: 130000 / 940,
        icon: '<img src="./assets/ecommerce-store-v4.webp" alt="E-commerce Store" class="full-cover-img">',
        rating: '5.0', details: { type: 'خدمة', includes: ['تصميم مخصص', 'ربط بوابات الدفع', 'لوحة تحكم'], hasForm: true }
    },
    {
        id: 'sm2', title: 'متابعين تيك توك', category: 'social',
        desc: 'زيادة فورية لحضورك على تيك توك. ابدأ برؤية النتائج في دقائق معدودة.', basePrice: 0.01,
        icon: '<img src="./assets/tiktok-followers-v4.webp" alt="TikTok Followers" class="full-cover-img">',
        rating: '4.9', details: { type: 'حسابات عالية الجودة', delivery: '5-30 دقيقة', batch: 1 }
    },
    {
        id: 'sm3', title: 'متابعين فيسبوك', category: 'social',
        desc: 'تنمية صفحتك أو حسابك على فيسبوك بشكل طبيعي مع خدمتنا السريعة والآمنة.', basePrice: 0.01,
        icon: '<img src="./assets/facebook-followers-v4.webp" alt="Facebook Followers" class="full-cover-img">',
        rating: '4.7', details: { type: 'حسابات ذات مظهر حقيقي', delivery: '1-3 ساعات', batch: 1 }
    },
    {
        id: 'sm1', title: 'متابعين انستقرام', category: 'social',
        desc: 'متابعين انستقرام بجودة عالية. تسليم فوري خلال 1-2 ساعة.', basePrice: 0.01,
        icon: '<img src="./assets/instagram-followers-v4.webp" alt="Instagram Followers" class="full-cover-img">',
        rating: '4.8', details: { type: 'مختلط (حقيقي وروبوتات عالية الجودة)', delivery: '1-2 ساعة', batch: 1 }
    },
    {
        id: 'g1', title: 'شدات ببجي موبايل', category: 'gaming', outOfStock: true,
        desc: 'شحن فوري لشدات ببجي موبايل. آمن وموثوق مباشرة عبر رقم اللاعب (ID).', basePrice: 5,
        icon: '<img src="./assets/pubg-uc-v4.webp" alt="PUBG Mobile UC" class="full-cover-img">',
        rating: '5.0', details: { type: 'شحن', requiresId: true, requiresCountry: true, options: [
            { label: '60 شدة', price: 5 }, { label: '325 شدة', price: 20 }, { label: '660 شدة', price: 40 }
        ]}
    },
    {
        id: 'g2', title: 'جواهر فري فاير', category: 'gaming', outOfStock: true,
        desc: 'احصل على جواهر فري فاير فوراً وبكل أمان عبر رقم اللاعب (ID).', basePrice: 4,
        icon: '<img src="./assets/freefire-diamonds-v4.webp" alt="Free Fire Diamonds" class="full-cover-img">',
        rating: '4.9', details: { type: 'شحن', requiresId: true, requiresCountry: true, options: [
            { label: '100 جوهرة', price: 4 }, { label: '520 جوهرة', price: 20 }, { label: '1060 جوهرة', price: 40 }
        ]}
    },
    {
        id: 'web2', title: 'تعديل مواقع إلكترونية', category: 'webdev',
        desc: 'إصلاح الأخطاء، إعادة تصميم الأقسام، أو إضافة ميزات جديدة لموقعك الحالي بكل احترافية.', basePrice: 85000 / 940,
        icon: '<img src="./assets/web-modification-v4.webp" alt="Website Modification" class="full-cover-img">',
        rating: '4.8', details: { type: 'خدمة', includes: ['تعديلات واجهة المستخدم', 'تحسين الأكواد', 'إصلاح الأخطاء'], hasForm: true }
    },
    {
        id: 'web3', title: 'تأجير موقع أو متجر إلكتروني', category: 'webdev',
        desc: 'خدمة تأجير شهري لموقع أو متجر إلكتروني جاهز للاستخدام، مع أداء سلس على الموبايل والكمبيوتر، والاستضافة وربط الدومين مشمولان.', basePrice: 30000 / 940,
        icon: '<img src="./assets/webstore-rental-v1.webp" alt="Website or Online Store Rental" class="full-cover-img">',
        rating: '4.9', details: { type: 'خدمة شهرية', includes: ['موقع أو متجر احترافي جاهز للاستخدام', 'تصميم متجاوب بالكامل للموبايل والكمبيوتر', 'دعم وسائل الدفع والتحويل والدفع عند الاستلام', 'صفحة تواصل تشمل الهاتف وواتساب والبريد', 'قاعدة بيانات منظمة للعملاء والطلبات', 'لوحة تحكم بسيطة لإدارة الطلبات وتحديثها', 'أداء سريع وسلس بدون تهنيج', 'الاستضافة وربط الدومين مشمولان'], hasForm: true }
    }
];

function withOptimizedImageAttrs(html) {
    if (typeof html !== 'string' || !html.includes('<img')) return html;

    return html.includes('loading=')
        ? html
        : html.replace('<img ', '<img loading="lazy" decoding="async" ');
}

function getLocalizedProductImage(product) {
    const { title } = getProductCopy(product);
    const localizedAlt = String(title || '').replace(/"/g, '&quot;');
    return withOptimizedImageAttrs(product.icon).replace(/alt="[^"]*"/i, `alt="${localizedAlt}"`);
}

const productDisplayMeta = {
    sm1: {
        reviewCount: 286,
        stock: 84,
        imagePosition: {
            card: 'center 42%',
            quickView: 'center 42%',
            details: 'center 42%'
        },
        variationGroups: [
            {
                id: 'quality',
                label: { ar: 'الجودة', en: 'Quality' },
                options: [
                    { label: { ar: 'ثابت', en: 'Steady' } },
                    { label: { ar: 'سريع', en: 'Fast Start' } },
                    { label: { ar: 'مختلط', en: 'Mixed' } }
                ]
            }
        ]
    },
    sm2: {
        reviewCount: 342,
        stock: 91,
        imagePosition: {
            card: 'center 41%',
            quickView: 'center 41%',
            details: 'center 41%'
        },
        variationGroups: [
            {
                id: 'campaign',
                label: { ar: 'نوع الحملة', en: 'Campaign' },
                options: [
                    { label: { ar: 'بداية', en: 'Starter' } },
                    { label: { ar: 'نمو', en: 'Growth' } },
                    { label: { ar: 'دفعة قوية', en: 'Boost' } }
                ]
            }
        ]
    },
    sm3: {
        reviewCount: 168,
        stock: 47,
        imagePosition: {
            card: 'center 42%',
            quickView: 'center 42%',
            details: 'center 42%'
        },
        variationGroups: [
            {
                id: 'delivery',
                label: { ar: 'الوتيرة', en: 'Delivery Pace' },
                options: [
                    { label: { ar: 'طبيعي', en: 'Natural' } },
                    { label: { ar: 'متوازن', en: 'Balanced' } }
                ]
            }
        ]
    },
    g1: {
        reviewCount: 504,
        stock: 0,
        imagePosition: {
            card: 'center 39%',
            quickView: 'center 39%',
            details: 'center 39%'
        }
    },
    g2: {
        reviewCount: 391,
        stock: 0,
        imagePosition: {
            card: 'center 38%',
            quickView: 'center 38%',
            details: 'center 38%'
        }
    },
    sub1: {
        reviewCount: 222,
        stock: 0,
        imagePosition: {
            card: 'center 43%',
            quickView: 'center 43%',
            details: 'center 43%'
        },
        variationGroups: [
            {
                id: 'support',
                label: { ar: 'الدعم', en: 'Support' },
                options: [
                    { label: { ar: 'قياسي', en: 'Standard' } },
                    { label: { ar: 'مميز', en: 'Priority' } }
                ]
            }
        ]
    },
    sub2: {
        reviewCount: 154,
        stock: 18,
        imagePosition: {
            card: 'center 42%',
            quickView: 'center 42%',
            details: 'center 42%'
        },
        variationGroups: [
            {
                id: 'delivery',
                label: { ar: 'التسليم', en: 'Delivery' },
                options: [
                    { label: { ar: 'واتساب', en: 'WhatsApp' } },
                    { label: { ar: 'تأكيد مباشر', en: 'Direct Confirmation' } }
                ]
            }
        ]
    },
    web1: {
        reviewCount: 61,
        stock: 7,
        imagePosition: {
            card: 'center 40%',
            quickView: 'center 40%',
            details: 'center 40%'
        },
        variationGroups: [
            {
                id: 'scope',
                label: { ar: 'النطاق', en: 'Scope' },
                options: [
                    { label: { ar: 'صفحة هبوط', en: 'Landing' } },
                    { label: { ar: 'متجر كامل', en: 'Full Store' } }
                ]
            },
            {
                id: 'style',
                label: { ar: 'الطابع', en: 'Style' },
                options: [
                    { label: { ar: 'نظيف', en: 'Clean' } },
                    { label: { ar: 'جريء', en: 'Bold' } }
                ]
            }
        ]
    },
    web2: {
        reviewCount: 45,
        stock: 12,
        imagePosition: {
            card: 'center 39%',
            quickView: 'center 39%',
            details: 'center 39%'
        },
        variationGroups: [
            {
                id: 'priority',
                label: { ar: 'الأولوية', en: 'Priority' },
                options: [
                    { label: { ar: 'عادية', en: 'Standard' } },
                    { label: { ar: 'مستعجلة', en: 'Rush' } }
                ]
            }
        ]
    },
    web3: {
        reviewCount: 73,
        stock: 9,
        imagePosition: {
            card: 'center 40%',
            quickView: 'center 40%',
            details: 'center 40%'
        }
    }
};

let currentProductList = products;
const FEATURED_PRODUCT_IDS = ['sm2', 'sm1', 'sub2', 'web1', 'web2'];

const scheduleIdleWork = (() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        return {
            schedule(callback) {
                return window.requestIdleCallback(callback, { timeout: 300 });
            },
            cancel(handle) {
                window.cancelIdleCallback(handle);
            }
        };
    }

    return {
        schedule(callback) {
            return window.setTimeout(callback, 80);
        },
        cancel(handle) {
            window.clearTimeout(handle);
        }
    };
})();

function createBufferedTask(task, delay = 140) {
    let timeoutId = null;
    let idleHandle = null;

    return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
        if (idleHandle) {
            scheduleIdleWork.cancel(idleHandle);
            idleHandle = null;
        }

        timeoutId = window.setTimeout(() => {
            timeoutId = null;
            idleHandle = scheduleIdleWork.schedule(() => {
                idleHandle = null;
                task();
            });
        }, delay);
    };
}

function debounce(fn, delay = 100) {
    let timeoutId = null;

    return (...args) => {
        if (timeoutId) window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            timeoutId = null;
            fn(...args);
        }, delay);
    };
}

function getActiveStoreFilter() {
    return document.querySelector('.category-filter li.active')?.dataset.filter || 'all';
}

function getStoreSearchQuery() {
    return document.getElementById('service-search')?.value.trim().toLowerCase() || '';
}

function getFilteredProducts(filter = getActiveStoreFilter(), query = getStoreSearchQuery()) {
    let filtered = products;

    if (filter !== 'all') {
        filtered = filtered.filter(product => product.category === filter);
    }

    if (!query) return filtered;

    return filtered.filter(product => {
        const { title, desc } = getProductCopy(product);
        return title.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
    });
}

// Helper to safely parse local storage
function safeJsonParse(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
}

// App State
let appState = {
    cart: safeJsonParse('zarz_cart', []),
    orders: safeJsonParse('zarz_orders', []),
    wishlist: safeJsonParse('zarz_wishlist', []),
    currency: 'SDG',
    lang: 'ar',
    exchangeRates: { SAR: 1, USD: 0.266, AED: 0.979, SDG: 159.6, EGP: 12.6 }, // Default fallback (overridden below)
    currencySymbols: { SAR: 'SAR', USD: '$', AED: 'AED', SDG: 'ج.س', EGP: 'EGP' }
};

const GOOGLE_SHEETS_WEB_APP_URL = window.ZARZ_GOOGLE_SHEETS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbztXloVNsu4_yyK05l-C7b-ggazOpj3Vb2zb42ODJOLcZfwObBYkvSLXYiO8IFYMaG8ug/exec';

function t(en, ar) {
    return appState.lang === 'ar' ? ar : en;
}

function localizeChoice(value) {
    if (value && typeof value === 'object') {
        return appState.lang === 'ar' ? (value.ar || value.en || '') : (value.en || value.ar || '');
    }
    return value || '';
}

function getProductCopy(product) {
    let title = product.title;
    let desc = product.desc;
    if (translations && appState.lang && translations[appState.lang][`prod_${product.id}_title`]) {
        title = translations[appState.lang][`prod_${product.id}_title`];
        desc = translations[appState.lang][`prod_${product.id}_desc`];
    }
    return { title, desc };
}

function getProductMeta(product) {
    const meta = productDisplayMeta[product.id] || {};
    return {
        reviewCount: meta.reviewCount || Math.max(24, Math.round(Number(product.rating || 4.8) * 32)),
        stock: product.outOfStock ? 0 : (meta.stock || 18),
        variationGroups: meta.variationGroups || [],
        imagePosition: meta.imagePosition || {}
    };
}

function getProductImageStyleAttr(product, context = 'card') {
    const meta = getProductMeta(product);
    const position = meta.imagePosition[context];

    if (!position) return '';

    const cssVarName = context === 'quickView'
        ? '--quick-view-image-position'
        : context === 'details'
            ? '--details-image-position'
            : '--product-image-position';

    return ` style="${cssVarName}: ${position};"`;
}

function getProductVariationGroups(product) {
    const meta = getProductMeta(product);
    const groups = [...meta.variationGroups];

    if (product.details && Array.isArray(product.details.options) && product.details.options.length > 0) {
        groups.unshift({
            id: 'package',
            label: { ar: 'الباقة', en: 'Package' },
            options: product.details.options.map((opt, index) => ({
                id: `package-${index}`,
                label: opt.label,
                price: opt.price
            }))
        });
    }

    return groups;
}

function getStockText(product, meta) {
    return product.outOfStock
        ? t('Out of Stock', 'نفذت الكمية')
        : t(`${meta.stock} in stock`, `متوفر ${meta.stock}`);
}

function getPaymentMethodLabel(method) {
    if (method === 'bankak') return t('Bankak transfer', 'تحويل بنكك');
    if (method === 'whatsapp') return t('WhatsApp follow-up', 'متابعة عبر واتساب');
    return method || '';
}

function isWishlisted(productId) {
    return appState.wishlist.includes(productId);
}

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    // Apply persisted language settings to document
    localStorage.setItem('zarz_lang', 'ar');
    document.documentElement.lang = appState.lang;
    document.documentElement.dir = 'rtl';
    const langBtnText = document.getElementById('lang-btn-text');
    if(langBtnText && typeof translations !== 'undefined' && translations[appState.lang]) {
        langBtnText.textContent = translations[appState.lang].lang_switch;
    }

    applyTranslations();
    fetchExchangeRates();
    renderFeaturedProducts();
    initRouter();
    updateCartCount(false);
    renderOrders();
    
    // Mobile Menu
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if(mobileBtn && navLinks) {
        const setMobileMenuState = (isOpen) => {
            navLinks.classList.toggle('show-mobile-menu', isOpen);
            mobileBtn.classList.toggle('active', isOpen);
            document.body.classList.toggle('nav-open', isOpen && window.innerWidth <= 768);
        };

        mobileBtn.addEventListener('click', () => {
            setMobileMenuState(!navLinks.classList.contains('show-mobile-menu'));
        });
        
        // Close menu on link click
        navLinks.addEventListener('click', (e) => {
             if (e.target.closest('a') || e.target.closest('button')) {
                 setMobileMenuState(false);
             }
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.classList.contains('show-mobile-menu')) return;
            if (e.target.closest('.navbar')) return;
            setMobileMenuState(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                setMobileMenuState(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setMobileMenuState(false);
            }
        });
    }

// Currency dropdown removed

    // Search & Filter
    const serviceSearch = document.getElementById('service-search');
    const runStoreSearch = debounce(() => {
        renderProducts(getFilteredProducts());
    }, 90);

    serviceSearch.addEventListener('input', runStoreSearch);

    document.querySelectorAll('.category-filter li').forEach(li => {
        li.addEventListener('click', (e) => {
            const targetLi = e.target.closest('li');
            if(!targetLi) return;
            document.querySelectorAll('.category-filter li').forEach(el => el.classList.remove('active'));
            targetLi.classList.add('active');
            const filter = targetLi.dataset.filter;
            serviceSearch.value = '';

            renderProducts(getFilteredProducts(filter, ''));
        });
    });

    // -- Form Persistence Setup --
    const restoreCheckout = () => {
        const savedCheckout = safeJsonParse('zarz_checkout', {});
        if(savedCheckout.name) document.getElementById('checkout-name').value = savedCheckout.name;
        if(savedCheckout.phone) document.getElementById('checkout-phone').value = savedCheckout.phone;
        if(savedCheckout.paymentMethod) document.getElementById('checkout-payment-method').value = savedCheckout.paymentMethod;
        if(savedCheckout.transactionLast4) document.getElementById('checkout-transaction-last4').value = savedCheckout.transactionLast4;
    };
    
    restoreCheckout();

    const updateCheckoutPaymentUI = () => {
        const methodSelect = document.getElementById('checkout-payment-method');
        const bankPanel = document.getElementById('bank-transfer-panel');
        const last4Input = document.getElementById('checkout-transaction-last4');
        const submitBtn = document.getElementById('checkout-submit-btn') || document.querySelector('#checkoutForm button[type="submit"]');
        const selectedMethod = methodSelect ? methodSelect.value : '';

        if (bankPanel) bankPanel.hidden = selectedMethod !== 'bankak';
        if (last4Input) {
            last4Input.required = selectedMethod === 'bankak';
            if (selectedMethod !== 'bankak') last4Input.value = '';
        }
        if (submitBtn) {
            const label = submitBtn.querySelector('[data-i18n="checkout_submit_btn"], [data-i18n="checkout_wa_btn"]');
            const icon = submitBtn.querySelector('i');
            if (selectedMethod === 'bankak') {
                submitBtn.style.background = '#0ea5e9';
                submitBtn.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.28)';
                if (icon) icon.className = 'fa-solid fa-building-columns';
                if (label) label.textContent = t('Confirm Bank Transfer Order', 'تأكيد طلب التحويل البنكي');
            } else {
                submitBtn.style.background = '#25D366';
                submitBtn.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
                if (icon) icon.className = 'fa-solid fa-paper-plane';
                if (label) label.textContent = t('Confirm and Send Order', 'تأكيد الطلب وإرساله');
            }
        }
    };

    const saveCheckout = createBufferedTask(() => {
        const nameInput = document.getElementById('checkout-name');
        const phoneInput = document.getElementById('checkout-phone');
        const paymentMethodInput = document.getElementById('checkout-payment-method');
        const transactionLast4Input = document.getElementById('checkout-transaction-last4');
        const name = nameInput ? nameInput.value : '';
        const phone = phoneInput ? phoneInput.value : '';
        const paymentMethod = paymentMethodInput ? paymentMethodInput.value : '';
        const transactionLast4 = transactionLast4Input ? transactionLast4Input.value : '';
        localStorage.setItem('zarz_checkout', JSON.stringify({ name, phone, paymentMethod, transactionLast4 }));
    }, 160);

    const checkoutForm = document.getElementById('checkoutForm');
    if(checkoutForm) {
        checkoutForm.addEventListener('input', saveCheckout);
        checkoutForm.addEventListener('change', saveCheckout);
    }
    updateCheckoutPaymentUI();
    const paymentMethodSelect = document.getElementById('checkout-payment-method');
    if(paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', updateCheckoutPaymentUI);
    }

    const detailsContainer = document.getElementById('details-container');
    const scheduleDetailsSave = createBufferedTask(() => {
        if(window.saveDetailsState) window.saveDetailsState();
    }, 160);

    detailsContainer.addEventListener('input', scheduleDetailsSave);
    detailsContainer.addEventListener('change', scheduleDetailsSave);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeQuickView();
    });
});

window.saveDetailsState = function() {
    let state = {};
    const extract = (id) => { const el = document.getElementById(id); if(el) state[id] = el.value; };
    ['target-link', 'detail-qty', 'game-country', 'player-id', 'game-package', 'target-email', 'web-req', 'ref-link'].forEach(extract);
    localStorage.setItem('zarz_details_form', JSON.stringify(state));
};

window.restoreDetailsState = function() {
    let state = safeJsonParse('zarz_details_form', {});
    let trigPkg = null;
    let trigQty = false;
    Object.keys(state).forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.value = state[id];
            if(id === 'detail-qty') trigQty = true;
            if(id === 'game-package') trigPkg = el;
        }
    });
    if(trigPkg) trigPkg.dispatchEvent(new Event('change', {bubbles: true}));
    else if(trigQty) updateDetailQty(0);
};


// Exchange Rates setup
function fetchExchangeRates() {
    appState.exchangeRates = {
        SAR: 1,
        SDG: 940,
        USD: 940 / 3500,
        EGP: 940 / 73,
        AED: 940 / 942
    };
    appState.currency = 'SDG'; // Enforce SDG securely
    localStorage.setItem('zarz_currency', 'SDG');
    refreshPrices();
}

// Pricing formatting
function formatPrice(sarPrice) {
    const rate = appState.exchangeRates[appState.currency] || 1;
    const converted = sarPrice * rate;
    const symbol = appState.currencySymbols[appState.currency];
    return `${converted.toFixed(2)} ${symbol}`;
}

function refreshPrices() {
    document.querySelectorAll('[data-price-sar]').forEach(el => {
        const sarValue = parseFloat(el.getAttribute('data-price-sar'));
        el.textContent = formatPrice(sarValue);
    });
}

function updateSeoMeta(viewId) {
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
    const twitterDescriptionMeta = document.querySelector('meta[name="twitter:description"]');
    const seoBaseUrl = 'https://zarzofficial.com/';

    const seoByView = {
        home: {
            title: 'زارز | zarz | خدمات رقمية وشحن ألعاب واشتراكات',
            description: 'زارز أوفشال يقدم خدمات رقمية احترافية تشمل شحن الألعاب، تنمية حسابات التواصل الاجتماعي، الاشتراكات الرقمية، وتطوير المتاجر والمواقع بسرعة ودعم مباشر.'
        },
        store: {
            title: 'المتجر | زارز | zarz',
            description: 'تصفح خدمات زارز أوفشال في شحن الألعاب، الاشتراكات الرقمية، خدمات السوشيال ميديا، وتطوير المواقع والمتاجر بواجهة عربية واضحة.'
        },
        cart: {
            title: 'السلة | زارز | zarz',
            description: 'راجع طلباتك في سلة زارز أوفشال وأكمل تفاصيل الخدمة والدفع بخطوات عربية سهلة وواضحة.'
        },
        checkout: {
            title: 'إتمام الطلب | زارز | zarz',
            description: 'أكمل طلبك في زارز أوفشال بسرعة عبر نموذج عربي واضح مع متابعة مباشرة عبر واتساب أو الهاتف.'
        },
        contact: {
            title: 'تواصل معنا | زارز | zarz',
            description: 'تواصل مع فريق زارز أوفشال للاستفسارات، الطلبات المخصصة، أو المتابعة على خدمات الألعاب والاشتراكات والمواقع.'
        },
        account: {
            title: 'طلباتي | زارز | zarz',
            description: 'تابع طلباتك الأخيرة في زارز أوفشال وراجع حالة الخدمات الرقمية التي قمت بطلبها.'
        },
        terms: {
            title: 'شروط الاستخدام | زارز | zarz',
            description: 'اطلع على شروط استخدام زارز أوفشال وسياسات الخدمات الرقمية والشحن والاشتراكات قبل إتمام الطلب.'
        }
    };

    let seo = seoByView[viewId] || seoByView.home;

    if (viewId === 'details') {
        const activeProductId = localStorage.getItem('zarz_active_product');
        const product = products.find(p => p.id === activeProductId);
        if (product) {
            const { title, desc } = getProductCopy(product);
            seo = {
                title: `${title} | زارز | zarz`,
                description: desc
            };
        }
    }

    const seoUrl = viewId && viewId !== 'home'
        ? `${seoBaseUrl}#${viewId}`
        : seoBaseUrl;

    document.title = seo.title;
    if (descriptionMeta) descriptionMeta.setAttribute('content', seo.description);
    if (canonicalLink) canonicalLink.setAttribute('href', seoUrl);
    if (ogTitleMeta) ogTitleMeta.setAttribute('content', seo.title);
    if (ogDescriptionMeta) ogDescriptionMeta.setAttribute('content', seo.description);
    if (ogUrlMeta) ogUrlMeta.setAttribute('content', seoUrl);
    if (twitterTitleMeta) twitterTitleMeta.setAttribute('content', seo.title);
    if (twitterDescriptionMeta) twitterDescriptionMeta.setAttribute('content', seo.description);
}

// Navigation / Router
function navigateTo(viewId) {
    localStorage.setItem('zarz_view', viewId);
    
    if (window.location.hash !== '#' + viewId) {
        window.history.pushState(null, null, '#' + viewId);
    }
    
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    const targetView = document.getElementById(`view-${viewId}`);
    if(targetView) {
        targetView.classList.add('active');
        
        // Prevent smooth scrolling animation when changing pages
        const originalScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
        
        // Update nav active state
        const navLink = document.querySelector(`.nav-link[data-view="${viewId === 'details' ? 'store' : viewId}"]`);
        if(navLink) navLink.classList.add('active');

        // Specific view renders
        if(viewId === 'store') renderProducts(getFilteredProducts());
        if(viewId === 'cart' || viewId === 'checkout') renderCart();
    }

    updateSeoMeta(viewId);
}

// To use from hero buttons
function filterStore(cat) {
    const searchInput = document.getElementById('service-search');
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('.category-filter li').forEach(el => el.classList.remove('active'));
    const targetLi = document.querySelector(`.category-filter li[data-filter="${cat}"]`);
    if(targetLi) targetLi.classList.add('active');
    navigateTo('store');
}

function initRouter(isHashChange = false) {
    let hash = window.location.hash.replace('#', '');
    let viewToLoad = hash;
    
    if (!viewToLoad) {
        viewToLoad = isHashChange ? 'home' : (localStorage.getItem('zarz_view') || 'home');
    }
    
    if(viewToLoad === 'details') {
        const prodId = localStorage.getItem('zarz_active_product');
        if(prodId && products.find(p => p.id === prodId)) {
            viewDetails(prodId);
            return;
        } else {
            viewToLoad = 'store';
        }
    }
    navigateTo(viewToLoad);
}

window.addEventListener('hashchange', () => {
    initRouter(true);
});

// Render Products
function renderVariationPreview(product) {
    const labels = [];
    getProductVariationGroups(product).slice(0, 2).forEach(group => {
        group.options.slice(0, 2).forEach(option => {
            labels.push(localizeChoice(option.label));
        });
    });

    if (!labels.length) return '';

    return `
        <div class="product-variation-preview" aria-label="${t('Available options', 'الخيارات المتاحة')}">
            ${labels.slice(0, 4).map(label => `<span class="variation-chip">${label}</span>`).join('')}
        </div>
    `;
}

function renderServiceAssurance(product) {
    const items = [
        {
            icon: 'fa-bolt',
            title: t('Fast kickoff', 'بدء سريع'),
            text: t('Your request is reviewed quickly so execution can start without delay.', 'تتم مراجعة طلبك بسرعة حتى يبدأ التنفيذ بدون تأخير.')
        },
        {
            icon: 'fa-shield-heart',
            title: t('Checked details', 'تفاصيل مؤكدة'),
            text: t('Important information is confirmed with you before the service is launched.', 'يتم تأكيد المعلومات المهمة معك قبل تشغيل الخدمة.')
        },
        {
            icon: 'fa-headset',
            title: t('Direct follow-up', 'متابعة مباشرة'),
            text: t('WhatsApp and phone support stay available during the whole order.', 'يبقى الواتساب والدعم الهاتفي متاحين طوال الطلب.')
        }
    ];

    if (product.category === 'webdev') {
        items[0].text = t('We align on scope and requirements first, then begin implementation in a clean workflow.', 'نحدد النطاق والمتطلبات أولاً ثم نبدأ التنفيذ ضمن مسار واضح.');
        items[1].text = t('Links, notes, and priorities are reviewed before work starts.', 'تتم مراجعة الروابط والملاحظات والأولوية قبل بدء العمل.');
    }

    return `
        <div class="service-order-panel">
            <div class="service-order-heading">
                <strong>${t('Ordering service', 'خدمة الطلب')}</strong>
                <span>${t('A clearer path from request to delivery.', 'مسار أوضح من الطلب حتى التسليم.')}</span>
            </div>
            <div class="service-order-grid">
                ${items.map(item => `
                    <div class="service-order-card">
                        <i class="fa-solid ${item.icon}"></i>
                        <div>
                            <strong>${item.title}</strong>
                            <p>${item.text}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateProductCardHTML(p) {
    const { title, desc } = getProductCopy(p);
    const meta = getProductMeta(p);
    const oldPrice = p.basePrice * 1.25;
    const isSoldOut = p.outOfStock;
    const reviewText = t(`${meta.reviewCount} reviews`, `${meta.reviewCount} تقييم`);
    const ratingAria = t(
        `${p.rating} stars from ${meta.reviewCount} reviews`,
        `${p.rating} نجوم من ${meta.reviewCount} تقييم`
    );
    const wishlistActive = isWishlisted(p.id);
    const wishlistLabel = wishlistActive ? t('Remove from wishlist', 'إزالة من المفضلة') : t('Add to wishlist', 'أضف للمفضلة');
    const quickViewText = t('Quick View', 'معاينة سريعة');
    const buyNowText = t('Buy Now', 'اطلب الآن');
    const stockText = getStockText(p, meta);
    const priceHtml = isSoldOut
        ? `<div class="product-price-stack"><span class="product-soldout-text">${stockText}</span></div>`
        : `<div class="product-price-stack">
               <span class="product-old-price" data-price-sar="${oldPrice}">${formatPrice(oldPrice)}</span>
               <span class="product-price" data-price-sar="${p.basePrice}">${formatPrice(p.basePrice)}</span>
           </div>`;

    return `
    <article class="product-card" aria-labelledby="product-title-${p.id}">
        <div class="product-image${isSoldOut ? ' is-soldout' : ''}"${getProductImageStyleAttr(p, 'card')}>
            <div class="product-card-top">
                ${isSoldOut ? `<span class="product-status-badge out">${stockText}</span>` : `<span class="product-status-badge sale"><span class="product-status-badge-mark"><i class="fa-solid fa-percent"></i></span><span class="product-status-badge-text">${t('20% OFF', 'خصم 20%')}</span></span>`}
                <div class="product-overlay-actions">
                    <button type="button" class="product-overlay-btn${wishlistActive ? ' active' : ''}" data-wishlist-id="${p.id}" aria-label="${wishlistLabel}" aria-pressed="${wishlistActive}" onclick="toggleWishlist('${p.id}')">
                        <i class="fa-${wishlistActive ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                    <button type="button" class="product-overlay-btn" aria-label="${t('Add to cart', 'أضف إلى السلة')}" onclick="addProductCardToCart('${p.id}')">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            </div>
            <div class="product-image-footer">
                <span class="product-badge"><i class="fa-solid fa-star"></i> ${p.rating}</span>
            </div>
            ${getLocalizedProductImage(p)}
        </div>
        <div class="product-info${isSoldOut ? ' is-muted' : ''}">
            <div class="product-meta-row">
                <div class="product-cat">${formatCategory(p.category)}</div>
                <span class="product-review-count">${reviewText}</span>
            </div>
            <h3 class="product-title" id="product-title-${p.id}">${title}</h3>
            <p class="product-desc">${desc}</p>
            <div class="product-rating-row" aria-label="${ratingAria}">
                <span class="review-stars" aria-hidden="true"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span>
                <span class="review-text">${p.rating} · ${reviewText}</span>
            </div>
            ${renderVariationPreview(p)}
            <div class="product-status-line">
                <span class="product-availability${isSoldOut ? ' out' : ''}">
                    <i class="fa-solid ${isSoldOut ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
                    <span>${stockText}</span>
                </span>
            </div>
            <div class="product-price-row">
                ${priceHtml}
            </div>
            <div class="product-actions">
                <button type="button" class="btn btn-secondary" onclick="openQuickView('${p.id}')">${quickViewText}</button>
                <button type="button" class="btn btn-primary" onclick="${isSoldOut ? '' : `viewDetails('${p.id}')`}" ${isSoldOut ? 'disabled aria-disabled="true"' : ''}>${buyNowText}</button>
            </div>
        </div>
    </article>
    `;
}

function renderProducts(items) {
    currentProductList = items;
    const container = document.getElementById('products-container');
    if(container) {
        container.innerHTML = items.map(generateProductCardHTML).join('');
    }

    refreshPrices();
}

function renderFeaturedProducts() {
    const featContainer = document.getElementById('featured-container');
    if(featContainer) {
        const featuredItems = FEATURED_PRODUCT_IDS
            .map(id => products.find(p => p.id === id && !p.outOfStock))
            .filter(Boolean)
            .slice(0, 4);
        featContainer.innerHTML = featuredItems.map(generateProductCardHTML).join('');
    }

    refreshPrices();
}

function formatCategory(cat) {
    if(appState.lang === 'ar') {
        const map = { social: 'تواصل اجتماعي', gaming: 'ألعاب', subscriptions: 'اشتراكات الذكاء الاصطناعي', webdev: 'تطوير ويب' };
        return map[cat] || cat;
    }
    const map = { social: 'Social Media', gaming: 'Gaming', subscriptions: 'Subscriptions', webdev: 'Web Development' };
    return map[cat] || cat;
}

function syncWishlistButtons(productId) {
    const active = isWishlisted(productId);
    const label = active ? t('Remove from wishlist', 'إزالة من المفضلة') : t('Add to wishlist', 'أضف للمفضلة');

    document.querySelectorAll(`[data-wishlist-id="${productId}"]`).forEach(button => {
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
        button.setAttribute('aria-label', label);

        const icon = button.querySelector('i');
        if (icon) {
            icon.className = `fa-${active ? 'solid' : 'regular'} fa-heart`;
        }
    });
}

function persistCartState() {
    localStorage.setItem('zarz_cart', JSON.stringify(appState.cart));
    updateCartCount();
}

function pushCartItem({ product, qty = 1, unitPriceSar = product.basePrice, customData = {} }) {
    const safeQty = Math.max(1, Number(qty) || 1);
    const safeUnitPrice = Number(unitPriceSar) || product.basePrice;

    appState.cart.push({
        cartId: Date.now().toString() + Math.random().toString(36).slice(2, 7),
        product,
        qty: safeQty,
        unitPriceSar: safeUnitPrice,
        totalPriceSar: safeUnitPrice * safeQty,
        customData
    });

    persistCartState();
}

window.addProductCardToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.outOfStock) {
        showToast(t('This product is currently out of stock', 'هذا المنتج غير متوفر حالياً'), 'error');
        return;
    }

    const customData = {};
    const variationGroups = getProductVariationGroups(product);
    variationGroups.forEach(group => {
        if (!group.options || !group.options.length) return;
        customData[group.id] = group.options[0].label;
    });

    pushCartItem({
        product,
        qty: 1,
        unitPriceSar: product.basePrice,
        customData
    });

    showToast(t('Added to cart. You can complete the details later.', 'تمت الإضافة إلى السلة ويمكنك إكمال التفاصيل لاحقاً.'), 'success');
}

window.toggleWishlist = function(productId) {
    if (isWishlisted(productId)) {
        appState.wishlist = appState.wishlist.filter(id => id !== productId);
        showToast(t('Removed from wishlist', 'تمت الإزالة من المفضلة'), 'success');
    } else {
        appState.wishlist = [...new Set([...appState.wishlist, productId])];
        showToast(t('Saved to wishlist', 'تم الحفظ في المفضلة'), 'success');
    }

    localStorage.setItem('zarz_wishlist', JSON.stringify(appState.wishlist));
    syncWishlistButtons(productId);
};

function renderQuickViewVariationGroups(product) {
    const groups = getProductVariationGroups(product);
    if (!groups.length) return '';

    return `
        <div class="quick-view-variations">
            ${groups.map(group => `
                <div class="variation-group">
                    <span class="variation-label">${localizeChoice(group.label)}</span>
                    <div class="variation-options">
                        ${group.options.map((option, index) => `
                            <button
                                type="button"
                                class="variation-option${index === 0 ? ' active' : ''}"
                                data-group="${group.id}"
                                ${option.price ? `data-price="${option.price}"` : ''}
                                onclick="selectQuickViewOption(this)"
                            >${localizeChoice(option.label)}</button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

window.selectQuickViewOption = function(button) {
    const wrapper = button.closest('.variation-options');
    if (!wrapper) return;

    wrapper.querySelectorAll('.variation-option').forEach(option => option.classList.remove('active'));
    button.classList.add('active');
    updateQuickViewPrice();
};

window.updateQuickViewPrice = function() {
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;

    const productId = modal.getAttribute('data-product-id');
    const product = products.find(item => item.id === productId);
    if (!product) return;

    let selectedPrice = product.basePrice;
    modal.querySelectorAll('.variation-option.active[data-price]').forEach(option => {
        const optionPrice = parseFloat(option.getAttribute('data-price'));
        if (!Number.isNaN(optionPrice)) selectedPrice = optionPrice;
    });

    const priceElement = document.getElementById('quick-view-price');
    const oldPriceElement = document.getElementById('quick-view-old-price');
    if (!priceElement || !oldPriceElement) return;

    priceElement.setAttribute('data-price-sar', selectedPrice);
    priceElement.textContent = formatPrice(selectedPrice);

    oldPriceElement.setAttribute('data-price-sar', selectedPrice * 1.25);
    oldPriceElement.textContent = formatPrice(selectedPrice * 1.25);
};

window.closeQuickView = function() {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.innerHTML = '';
    document.body.style.overflow = '';
};

window.openQuickView = function(productId) {
    const product = products.find(item => item.id === productId);
    const modalRoot = document.getElementById('modal-root');
    if (!product || !modalRoot) return;

    const { title, desc } = getProductCopy(product);
    const meta = getProductMeta(product);
    const groups = getProductVariationGroups(product);
    const startingPrice = groups.find(group => group.options.some(option => option.price))
        ?.options.find(option => option.price)?.price || product.basePrice;
    const wishlistActive = isWishlisted(product.id);

    modalRoot.innerHTML = `
        <div class="modal-overlay quick-view-overlay" id="quick-view-modal" data-product-id="${product.id}" onclick="if (event.target.id === 'quick-view-modal') closeQuickView()">
            <div class="modal-content quick-view-content" role="dialog" aria-modal="true" aria-labelledby="quick-view-title-${product.id}">
                <button type="button" class="quick-view-close" aria-label="${t('Close quick view', 'إغلاق المعاينة السريعة')}" onclick="closeQuickView()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="quick-view-layout">
                    <div class="quick-view-image${product.outOfStock ? ' is-soldout' : ''}"${getProductImageStyleAttr(product, 'quickView')}>
                        ${getLocalizedProductImage(product)}
                        ${product.outOfStock ? `<div class="product-out-overlay">${t('Out of Stock', 'نفذت الكمية')}</div>` : ''}
                    </div>
                    <div class="quick-view-body">
                        <div class="quick-view-body-scroll">
                            <div class="quick-view-mini-meta">
                                <span class="product-cat">${formatCategory(product.category)}</span>
                                <button type="button" class="product-overlay-btn${wishlistActive ? ' active' : ''}" data-wishlist-id="${product.id}" aria-label="${wishlistActive ? t('Remove from wishlist', 'إزالة من المفضلة') : t('Add to wishlist', 'أضف للمفضلة')}" aria-pressed="${wishlistActive}" onclick="toggleWishlist('${product.id}')">
                                    <i class="fa-${wishlistActive ? 'solid' : 'regular'} fa-heart"></i>
                                </button>
                            </div>
                            <h2 id="quick-view-title-${product.id}">${title}</h2>
                            <p class="quick-view-desc">${desc}</p>
                            <div class="product-rating-row" aria-label="${t(`${product.rating} stars from ${meta.reviewCount} reviews`, `${product.rating} نجوم من ${meta.reviewCount} تقييم`)}">
                                <span class="review-stars" aria-hidden="true"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span>
                                <span class="review-text">${product.rating} · ${t(`${meta.reviewCount} reviews`, `${meta.reviewCount} تقييم`)}</span>
                            </div>
                            <div class="quick-view-stock${product.outOfStock ? ' out' : ''}">${getStockText(product, meta)}</div>
                            ${renderQuickViewVariationGroups(product)}
                            <div class="quick-view-price-box">
                                <span class="quick-view-old-price" id="quick-view-old-price" data-price-sar="${startingPrice * 1.25}">${formatPrice(startingPrice * 1.25)}</span>
                                <strong class="quick-view-price" id="quick-view-price" data-price-sar="${startingPrice}">${formatPrice(startingPrice)}</strong>
                            </div>
                        </div>
                        <div class="quick-view-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeQuickView(); viewDetails('${product.id}')">${t('More Details', 'تفاصيل أكثر')}</button>
                            <button type="button" class="btn btn-primary" onclick="closeQuickView(); viewDetails('${product.id}')" ${product.outOfStock ? 'disabled aria-disabled="true"' : ''}>${t('Buy Now', 'اطلب الآن')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
        const closeButton = modalRoot.querySelector('.quick-view-close');
        if (closeButton) closeButton.focus();
    });
};

// View Product Details
function viewDetails(productId) {
    closeQuickView();
    localStorage.setItem('zarz_active_product', productId);
    const product = products.find(p => p.id === productId);
    if(!product) return;
    
    const { title, desc } = getProductCopy(product);
    let dynamicHtml = '';
    
    if(product.category === 'social') {
        let typeStr = product.details.type;
        if(typeStr === 'High Quality Accounts') typeStr = t(typeStr, 'حسابات عالية الجودة');
        else if(typeStr === 'Real Look Profiles') typeStr = t(typeStr, 'حسابات بشكل حقيقي');
        else if(typeStr === 'Mixed (Real & HQ Bots)') typeStr = t(typeStr, 'مختلط (حقيقي وبوتات جودة عالية)');
        
        let delStr = product.details.delivery;
        if(delStr === '1-2 Hours') delStr = t(delStr, '1-24 ساعه');
        else if(delStr === '1-3 Hours') delStr = t(delStr, '1-24 ساعه');
        else if(delStr === '5-30 Mins') delStr = t(delStr, '1-24 ساعه');

        dynamicHtml = `
            <div class="alert alert-info" style="margin-bottom:1.5rem">
                <i class="fa-solid fa-circle-check"></i>
                <div><strong>${t('Follower Type:', 'نوع المتابعين:')}</strong> ${typeStr}<br><strong>${t('Delivery Time:', 'وقت التسليم:')}</strong> ${delStr}</div>
            </div>
            <div class="alert alert-success" style="margin-bottom:1.5rem; background:rgba(0, 230, 118, 0.1); border:1px solid var(--accent-green); border-radius:10px; padding:15px; display:flex; align-items:center; gap:10px;">
                <i class="fa-solid fa-gift text-green" style="font-size:1.5rem;"></i>
                <div style="color:var(--text-primary); font-size:0.95rem;"><strong>${t('Special Offer:', 'عرض خاص:')}</strong> ${t('Every order comes with 1,000 Free Likes & 1,000 Free Views!', 'كل طلب يأتيك معه 1000 لايك و 1000 مشاهدة مجاناً!')}</div>
            </div>
            <div class="form-group">
                <label>${t('Target Account Link / Username', 'رابط الحساب / اسم المستخدم')}</label>
                <input type="text" id="target-link" placeholder="https://..." required>
            </div>
            <div class="form-group">
                <label>${t('Quantity (Number of Followers)', 'الكمية (عدد المتابعين)')}</label>
                <input type="number" id="detail-qty" value="100" min="10" oninput="updateDetailQty(0)" style="width:100%;">
            </div>
        `;
    } else if(product.category === 'gaming') {
        let optionsHtml = product.details.options.map((opt, i) => {
            let label = opt.label;
            label = label.replace('Diamonds', t('Diamonds', 'جوهرة'));
            label = label.replace('Random Epic Skin', t('Random Epic Skin', 'سكن إيبيك عشوائي'));
            label = label.replace('Premium Bundle', t('Premium Bundle', 'حزمة مميزة'));
            return `<option value="${i}" data-price="${opt.price}">${label}</option>`;
        }).join('');
        
        dynamicHtml = `
            ${product.details.requiresCountry ? `
            <div class="form-group">
                <label>${t('Select Server / Country', 'اختر السيرفر / الدولة')}</label>
                <select id="game-country">
                    <option value="global">${t('Global', 'عالمي')}</option>
                    <option value="mena">${t('Middle East / NA', 'الشرق الأوسط / شمال إفريقيا')}</option>
                    <option value="asia">${t('Asia', 'آسيا')}</option>
                </select>
            </div>` : ''}
            ${product.details.requiresId ? `
            <div class="form-group">
                <label>${t('Player ID', 'رقم اللاعب (الآيدي)')}</label>
                <input type="text" id="player-id" placeholder="${t('Ex: 512345678', 'مثال: 512345678')}" required>
            </div>` : ''}
            <div class="form-group">
                <label>${t('Select Package', 'اختر الباقة')}</label>
                <select id="game-package" onchange="updateDetailPrice(this, ${product.basePrice})">
                    ${optionsHtml}
                </select>
            </div>
            <div class="form-group">
                <label>${t('Quantity', 'الكمية')}</label>
                <div class="cart-controls">
                    <button class="qty-btn" onclick="updateDetailQty(-1)">-</button>
                    <input type="number" id="detail-qty" class="qty-input" value="1" min="1" readonly>
                    <button class="qty-btn" onclick="updateDetailQty(1)">+</button>
                </div>
            </div>
        `;
    } else if(product.category === 'subscriptions') {
         let accType = product.details.type;
         if(accType === 'Shared Account') accType = t(accType, 'حساب خاص');
         
         let delMeth = product.details.delivery;
         if(delMeth === 'Email') delMeth = t(delMeth, 'البريد الإلكتروني');
         
         dynamicHtml = `
            <div class="alert alert-info" style="margin-bottom:1.5rem">
                <i class="fa-solid fa-envelope"></i>
                <div><strong>${t('Account Type:', 'نوع الحساب:')}</strong> ${accType}<br><strong>${t('Delivery:', 'التسليم:')}</strong> ${t('Delivered via', 'عن طريق')} ${delMeth}</div>
            </div>
            <div class="form-group">
                <label>${t('Recipient Number', 'رقم المستلم')}</label>
                <input type="tel" id="target-phone" placeholder="${t('Ex: +966...', 'مثال: +966...')}" required>
            </div>
        `;
    } else if(product.category === 'webdev') {
        let includesStr = product.details.includes.map(inc => {
             if(inc === 'Custom Design') return t(inc, 'تصميم مخصص');
             if(inc === 'Payment Gateway Integration') return t(inc, 'ربط بوابات الدفع');
             if(inc === 'Admin Panel') return t(inc, 'لوحة تحكم');
             if(inc === 'UI/UX Adjustments') return t(inc, 'تعديلات واجهة المستخدم');
             if(inc === 'Code Optimization') return t(inc, 'تحسين الأكواد');
             if(inc === 'Bug Fixing') return t(inc, 'إصلاح الأخطاء');
             return inc;
        }).join(t(', ', '، '));
        
        dynamicHtml = `
            <div class="alert alert-info" style="margin-bottom:1.5rem">
                <i class="fa-solid fa-laptop-code"></i>
                <div><strong>${t('Includes:', 'يتضمن:')}</strong> ${includesStr}</div>
            </div>
            <div class="form-group">
                <label>${t('Service Description / Requirements', 'وصف الخدمة / المتطلبات')}</label>
                <textarea rows="4" id="web-req" placeholder="${t('Describe what you need in detail...', 'اشرح ما تحتاجه بالتفصيل...')}"></textarea>
            </div>
            <div class="form-group">
                <label>${t('Reference Link (Optional)', 'رابط مرجعي (اختياري)')}</label>
                <input type="url" id="ref-link" placeholder="https://...">
            </div>
        `;
    }

    const container = document.getElementById('details-container');
    container.innerHTML = `
        <div class="details-wrapper">
                <div class="details-image"${getProductImageStyleAttr(product, 'details')}>${getLocalizedProductImage(product)}</div>
            <div class="details-info">
                <div class="details-cat">${formatCategory(product.category)}</div>
                <h1>${title}</h1>
                <p class="details-desc">${desc}</p>
                <div class="dynamic-options">
                    ${dynamicHtml}
                </div>
                ${renderServiceAssurance(product)}
                
                <div class="price-action-container service-checkout-box">
                    <div class="price-action-header">
                        <div class="price-action-labels">
                            <span style="font-size:1.1rem; color:var(--text-secondary); font-weight:600;">${t('Total Price', 'السعر الإجمالي')}</span>
                            <span id="detail-old-price-display" class="detail-old-price-display" data-base-sar="${product.basePrice * 1.25}" data-price-sar="${product.basePrice * 1.25}">
                                ${formatPrice(product.basePrice * 1.25)}
                            </span>
                        </div>
                        <div class="details-price" id="detail-price-display" data-base-sar="${product.basePrice}" data-price-sar="${product.basePrice}">
                            ${formatPrice(product.basePrice)}
                        </div>
                    </div>
                    
                    <div class="price-action-buttons">
                        <button class="btn btn-secondary w-100 detail-action-btn" onclick="addToCart('${product.id}')">
                            <i class="fa-solid fa-cart-plus"></i> ${appState.lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                        </button>
                        <button class="btn btn-primary w-100 detail-action-btn" onclick="orderNow('${product.id}')">
                            <i class="fa-solid fa-bolt"></i> ${appState.lang === 'ar' ? 'اطلب الآن' : 'Order Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    navigateTo('details');
    setTimeout(() => {
        if(window.restoreDetailsState) window.restoreDetailsState();
    }, 0);
}

window.orderNow = function(productId) {
    const oldLen = appState.cart.length;
    addToCart(productId);
    if(appState.cart.length > oldLen) {
        renderCart();
        navigateTo('checkout');
    }
};


// Interacting with Details Modifiers
window.updateDetailQty = function(change) {
    const qtyInput = document.getElementById('detail-qty');
    if(!qtyInput) return;
    
    let rawVal = parseInt(qtyInput.value);
    let qty = isNaN(rawVal) ? 0 : rawVal;
    
    if (change !== 0) {
        qty += change;
        if(qty < 1) qty = 1;
        qtyInput.value = qty;
    } else {
        if (qty < 0) {
            qty = 1;
            qtyInput.value = 1;
        }
    }
    
    let calcQty = qty < 1 ? 1 : qty;
    
    // Update total preview
    const priceDisplay = document.getElementById('detail-price-display');
    const baseSar = parseFloat(priceDisplay.getAttribute('data-base-sar'));
    const totalSar = baseSar * calcQty;
    priceDisplay.setAttribute('data-price-sar', totalSar);
    priceDisplay.textContent = formatPrice(totalSar);
    
    // Update old price preview
    const oldPriceDisplay = document.getElementById('detail-old-price-display');
    if (oldPriceDisplay) {
        const oldBaseSar = parseFloat(oldPriceDisplay.getAttribute('data-base-sar'));
        const totalOldSar = oldBaseSar * calcQty;
        oldPriceDisplay.setAttribute('data-price-sar', totalOldSar);
        oldPriceDisplay.textContent = formatPrice(totalOldSar);
    }
};

window.updateDetailPrice = function(selectElem, fallbackPrice) {
    const selectedOpt = selectElem.options[selectElem.selectedIndex];
    const newBase = selectedOpt ? parseFloat(selectedOpt.getAttribute('data-price')) : fallbackPrice;
    
    const priceDisplay = document.getElementById('detail-price-display');
    priceDisplay.setAttribute('data-base-sar', newBase);
    
    const qtyInput = document.getElementById('detail-qty');
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;
    
    const totalSar = newBase * qty;
    priceDisplay.setAttribute('data-price-sar', totalSar);
    priceDisplay.textContent = formatPrice(totalSar);
};

// Cart logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if(!product) return;

    // Extract dynamic data
    let customData = {};
    let finalPrice = product.basePrice;
    let qty = 1;

    const qtyInput = document.getElementById('detail-qty');
    if(qtyInput) qty = parseInt(qtyInput.value);

    if(product.category === 'social') {
        const link = document.getElementById('target-link').value;
        if(!link) return showToast('الرجاء إدخال رابط الحساب الدقيق', 'error');
        customData.link = link;
        customData.qtyMultiplier = qty; // For social, price scales with 1000s
        finalPrice = product.basePrice * qty;
    } else if(product.category === 'gaming') {
        const country = document.getElementById('game-country') ? document.getElementById('game-country').value : 'عالمي';
        const playerId = document.getElementById('player-id') ? document.getElementById('player-id').value : '';
        const pkgSelect = document.getElementById('game-package');
        
        if(product.details.requiresId && !playerId) return showToast('الرجاء إدخال رقم اللاعب (الآيدي)', 'error');
        
        if(pkgSelect) {
            const opt = pkgSelect.options[pkgSelect.selectedIndex];
            customData.package = opt.text;
            finalPrice = parseFloat(opt.getAttribute('data-price')) * qty;
        }
        customData.playerId = playerId;
        customData.server = country;
    } else if(product.category === 'subscriptions') {
        const phone = document.getElementById('target-phone').value;
        if(!phone) return showToast('الرجاء إدخال رقم هاتف المستلم', 'error');
        customData.phone = phone;
    } else if(product.category === 'webdev') {
        customData.requirements = document.getElementById('web-req').value;
    }

    pushCartItem({
        product,
        qty,
        unitPriceSar: finalPrice / qty,
        customData
    });
    showToast(translations[appState.lang].toast_added || 'تمت الإضافة للسلة بنجاح!', 'success');
}

function updateCartCount(animate = true) {
    const el = document.getElementById('cart-count');
    el.textContent = appState.cart.length;
    
    if (animate) {
        // Pulse animation
        el.style.transform = 'scale(1.5)';
        setTimeout(() => el.style.transform = 'scale(1)', 200);
    }
}

function removeFromCart(cartId) {
    appState.cart = appState.cart.filter(item => item.cartId !== cartId);
    localStorage.setItem('zarz_cart', JSON.stringify(appState.cart));
    updateCartCount();
    renderCart();
    showToast(appState.lang === 'ar' ? 'تم حذف المنتج' : 'Item removed', 'success');
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if(appState.cart.length === 0) {
        container.innerHTML = `<p style="color:var(--text-secondary)">السلة فارغة حالياً.</p>`;
        checkoutBtn.disabled = true;
        document.getElementById('cart-subtotal').textContent = formatPrice(0);
        document.getElementById('cart-fees').textContent = formatPrice(0);
        document.getElementById('cart-total').textContent = formatPrice(0);
        return;
    }

    checkoutBtn.disabled = false;
    let subtotalSar = 0;

    container.innerHTML = appState.cart.map(item => {
        subtotalSar += item.totalPriceSar;
        
        // Build meta string
        let metaParts = [];
        if(item.customData.link) metaParts.push(`الرابط: ${item.customData.link.substring(0,20)}...`);
        if(item.customData.package) metaParts.push(item.customData.package);
        if(item.customData.playerId) metaParts.push(`الآيدي: ${item.customData.playerId}`);
        if(item.customData.phone) metaParts.push(`الرقم: ${item.customData.phone}`);
        
        return `
        <div class="cart-item">
            <div class="cart-item-img">${getLocalizedProductImage(item.product)}</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${getProductCopy(item.product).title}</div>
                <div class="cart-item-meta">${metaParts.join(' | ')}</div>
                ${item.qty > 1 && item.product.category !== 'social' ? `<div class="cart-item-meta">الكمية: ${item.qty}</div>` : ''}
            </div>
            <div class="cart-item-price">${formatPrice(item.totalPriceSar)}</div>
            <button class="icon-btn text-accent" onclick="removeFromCart('${item.cartId}')"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;
    }).join('');

    // Summary calculation
    const feesSar = 0; // Set to 0
    const taxSar = 0; // Set to 0
    const totalSar = subtotalSar + feesSar + taxSar;

    document.getElementById('cart-subtotal').textContent = formatPrice(subtotalSar);
    document.getElementById('cart-fees').textContent = formatPrice(feesSar);
    if(document.getElementById('cart-tax')) document.getElementById('cart-tax').textContent = formatPrice(taxSar);
    document.getElementById('cart-total').textContent = formatPrice(totalSar);
    
    // Update checkout screen summary as well
    const summaryBox = document.getElementById('checkout-summary-box');
    if(summaryBox) {
        summaryBox.innerHTML = `
            <h3>إجمالي الطلب</h3>
            <div class="summary-row" style="margin-top:1rem">
                <span>العناصر (${appState.cart.length})</span>
                <span class="price">${formatPrice(subtotalSar)}</span>
            </div>
            <div class="summary-row total">
                <span>المطلوب دفعه</span>
                <span class="price text-accent" style="font-size:1.8rem">${formatPrice(totalSar)}</span>
            </div>
            <p style="color:var(--text-secondary); font-size:0.8rem; margin-top:1rem">
                الدفع بعملة ${appState.currencySymbols[appState.currency]}. سيتم تطبيق سعر الصرف الحالي.
            </p>
        `;
    }
}

// Checkout processing
function buildOrderDetails(appCart, includeFormatting = false) {
    return appCart.map(item => {
        const copy = getProductCopy(item.product);
        const title = copy.title;
        let metaParts = [];
        if(item.customData.link) metaParts.push((appState.lang === 'ar' ? '??????' : 'Link') + ': ' + item.customData.link);
        if(item.customData.package) metaParts.push(item.customData.package);
        if(item.customData.playerId) metaParts.push((appState.lang === 'ar' ? '??????' : 'Player ID') + ': ' + item.customData.playerId);
        if(item.customData.phone) metaParts.push((appState.lang === 'ar' ? '?????' : 'Phone') + ': ' + item.customData.phone);
        if(item.customData.server) metaParts.push((appState.lang === 'ar' ? '???????' : 'Server') + ': ' + item.customData.server);
        const titleText = includeFormatting ? ('*' + item.qty + 'x ' + title + '*') : (item.qty + 'x ' + title);
        const metaText = metaParts.length ? ('\n' + metaParts.join(' | ')) : '';
        return titleText + ' - ' + formatPrice(item.totalPriceSar) + metaText;
    }).join('\n\n');
}

async function submitOrderToGoogleSheets(payload) {
    if (!GOOGLE_SHEETS_WEB_APP_URL) {
        return { ok: false, reason: 'missing_endpoint' };
    }

    let response;
    try {
        response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        const fallbackBody = new URLSearchParams(payload).toString();
        const fallbackResponse = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: fallbackBody
        });

        if (fallbackResponse && fallbackResponse.type === 'opaque') {
            return { ok: true, transport: 'no-cors-fallback' };
        }

        throw error;
    }

    if (!response.ok) {
        throw new Error('Sheets request failed with status ' + response.status);
    }

    const rawText = await response.text();
    let result = { ok: true };

    if (rawText) {
        try {
            result = JSON.parse(rawText);
        } catch (parseError) {
            throw new Error('Invalid Sheets response: ' + rawText.slice(0, 120));
        }
    }

    if (!result.ok) {
        return { ok: false, reason: 'sheet_rejected', error: result.error || 'Google Sheets rejected the order.' };
    }

    return { ok: true, transport: 'json' };
}

window.processOrder = async function() {
    if(appState.cart.length === 0) return;

    const nameInput = document.getElementById('checkout-name').value.trim();
    const phoneInput = document.getElementById('checkout-phone').value.trim();
    const paymentMethod = document.getElementById('checkout-payment-method').value;
    const transactionLast4 = document.getElementById('checkout-transaction-last4').value.trim();

    if(!nameInput || !phoneInput) {
        showToast(appState.lang === 'ar' ? '???? ??? ???? ??????' : 'Please fill all fields', 'error');
        return;
    }
    if(!paymentMethod) {
        showToast(translations[appState.lang].payment_required_msg, 'error');
        return;
    }
    if(paymentMethod === 'bankak' && !transactionLast4) {
        showToast(translations[appState.lang].bank_last4_required_msg, 'error');
        return;
    }
    if(paymentMethod === 'bankak' && !/^\d{4}$/.test(transactionLast4)) {
        showToast(translations[appState.lang].bank_last4_invalid_msg, 'error');
        return;
    }

    const btn = document.querySelector('#checkoutForm button[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';
    if(btn) {
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> ' + translations[appState.lang].order_submit_progress;
        btn.disabled = true;
    }

    try {
        await finalizeOrder(paymentMethod, transactionLast4, btn, originalText);
    } catch (error) {
        console.error(error);
        if(btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
        showToast(translations[appState.lang].order_submit_error, 'error');
    }
};

window.finalizeOrder = async function(paymentMethod, transactionLast4 = '', submitBtn = null, submitOriginalText = null) {
    const nameInput = document.getElementById('checkout-name').value.trim();
    const phoneInput = document.getElementById('checkout-phone').value.trim();
    const orderNum = 'ZARZ-' + Math.floor(Math.random()*10000);
    const orderDate = new Date().toISOString();
    const totalStr = document.getElementById('cart-total').textContent;
    const paymentMethodLabel = getPaymentMethodLabel(paymentMethod);
    const detailsStr = buildOrderDetails(appState.cart, true);
    const sheetOrderText = [
        'Order Number: ' + orderNum,
        'Items:',
        buildOrderDetails(appState.cart, false),
        'Total: ' + totalStr,
        'Payment Method: ' + paymentMethodLabel,
        transactionLast4 ? ('Payment Confirmation (Last 4): ' + transactionLast4) : ''
    ].filter(Boolean).join('\n');

    const payload = {
        name: nameInput,
        phoneNumber: phoneInput,
        order: sheetOrderText,
        date: orderDate,
        paymentMethod: paymentMethodLabel
    };

    const sheetResult = await submitOrderToGoogleSheets(payload);
    if (!sheetResult.ok) {
        throw new Error(sheetResult.reason || 'Unable to submit order to Google Sheets.');
    }

    let newOrder = {
        id: orderNum,
        date: orderDate,
        method: paymentMethodLabel,
        mode: paymentMethod,
        paymentReference: transactionLast4 || '-',
        status: appState.lang === 'ar' ? '??? ????????' : 'Processing',
        total: totalStr,
        items: appState.cart.map(i => ({ title: getProductCopy(i.product).title, qty: i.qty }))
    };
    appState.orders.unshift(newOrder);
    appState.cart = [];
    localStorage.setItem('zarz_orders', JSON.stringify(appState.orders));
    localStorage.setItem('zarz_cart', JSON.stringify(appState.cart));
    localStorage.removeItem('zarz_checkout');
    updateCartCount();
    renderOrders();

    const msg = '*??? ????*\n*??? ?????:* ' + orderNum + '\n*?????:* ' + nameInput + '\n*??? ??????:* ' + phoneInput + '\n*????? ?????:* ' + paymentMethodLabel + (transactionLast4 ? ('\n*??? 4 ????? ?? ???????:* ' + transactionLast4) : '') + '\n\n*?????? ?????:*\n' + detailsStr + '\n\n*????????:* ' + totalStr;

    navigateTo('account');
    if(submitBtn) {
        submitBtn.innerHTML = submitOriginalText;
        submitBtn.disabled = false;
    }

    showToast(translations[appState.lang].order_submit_success, 'success');

    if (paymentMethod === 'whatsapp') {
        window.open('https://wa.me/201500007300?text=' + encodeURIComponent(msg), '_blank');
    }
};

function renderOrders() {
    const list = document.querySelector('.orders-list');
    const emptyState = list.querySelector('.empty-state');
    
    // Remove old orders rendered (keep empty state if exists)
    Array.from(list.children).forEach(child => {
        if(!child.classList.contains('empty-state')) child.remove();
    });
    
    if (appState.orders.length === 0) {
        if(emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if(emptyState) emptyState.style.display = 'none';
    
    const ordersHtml = appState.orders.map(order => {
        const itemsList = order.items && order.items.length > 0 
            ? order.items.map(i => `- ${i.qty}x ${i.title}`).join('<br>') 
            : 'لا توجد تفاصيل إضافية';
            
        return `
        <div class="cart-item" style="border-left: 4px solid var(--accent-green); animation: slideUpFade 0.4s ease-out; flex-direction: column; align-items: stretch; cursor: pointer; padding: 1rem;" onclick="toggleOrderDetails('${order.id}')">
            <div style="display:flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div class="cart-item-img"><i class="fa-solid fa-check text-green"></i></div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">طلب #${order.id}</div>
                        <div class="cart-item-meta" style="margin-top:0.3rem;">
                            الإجمالي: <span class="text-accent">${order.total}</span> | التاريخ: ${new Date(order.date).toLocaleDateString('ar-EG')}
                        </div>
                    </div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn btn-secondary order-delete-btn" style="padding:0.4rem 0.8rem; font-size:0.8rem; border-color:var(--accent-red); color:var(--accent-red);" onclick="event.stopPropagation(); deleteOrder('${order.id}')">
                        <i class="fa-solid fa-trash"></i> حذف
                    </button>
                    <button class="btn btn-primary" style="padding:0.4rem; font-size:0.8rem;"><i class="fa-solid fa-chevron-down"></i></button>
                </div>
            </div>
            <div id="order-details-${order.id}" style="display:none; padding-top: 1rem; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); font-size:0.95rem; color:var(--text-secondary); width: 100%;">
                <strong style="color:var(--text-primary);">الخدمات المطلوبة:</strong><br>
                ${itemsList}
                <br><br>
                <strong style="color:var(--text-primary);">حالة الطلب:</strong> قيد المعالجة (تواصل معنا عبر واتساب)
            </div>
        </div>
        `;
    }).join('');
    
    list.insertAdjacentHTML('beforeend', ordersHtml);
}

window.deleteOrder = function(orderId) {
    if(!confirm('هل أنت متأكد من حذف هذا الطلب من سجل طلباتك؟')) return;
    appState.orders = appState.orders.filter(o => o.id !== orderId);
    localStorage.setItem('zarz_orders', JSON.stringify(appState.orders));
    renderOrders();
    showToast('تم حذف الطلب بنجاح', 'success');
};

window.toggleOrderDetails = function(orderId) {
    const detailsDiv = document.getElementById(`order-details-${orderId}`);
    if(detailsDiv) {
        detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
    }
};


function applyTranslations() {
    if(typeof translations === "undefined") return;
    const currentTranslations = translations[appState.lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (currentTranslations[key]) {
            if (el.hasAttribute('data-i18n-attr')) {
                el.setAttribute(el.getAttribute('data-i18n-attr'), currentTranslations[key]);
            } else {
                el.innerHTML = currentTranslations[key];
            }
        }
    });
}

// UI Utils (Toast)
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-circle-info';
    if(type === 'success') icon = 'fa-circle-check';
    if(type === 'error') icon = 'fa-circle-xmark';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.copyAccount = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(translations[appState.lang].copied_msg || 'تم نسخ النص بنجاح', 'success');
    }).catch(err => {
        showToast('فشل في عملية النسخ', 'error');
    });
};
