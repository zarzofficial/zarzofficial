// Products Database
const products = [
    {
        id: 'sub1', title: 'ChatGPT Go', category: 'subscriptions',
        desc: 'الوصول الحصري لـ GPT-4. أولوية الوصول، استجابة أسرع ومميزات متقدمة. حساب خاص يُسلّم عبر الواتساب. / Access GPT-4, priority access, and faster response speeds. Shared account delivered to WhatsApp.', basePrice: 9700 / 940,
        icon: '<img src="./assets/chatgpt-go.png" alt="ChatGPT Go" class="full-cover-img">',
        rating: '5.0', details: { type: 'Shared Account', duration: '1 Year', delivery: 'WhatsApp', options: [{ label: '1 Year Shared', price: 9700 / 940 }] }
    },
    {
        id: 'sub2', title: 'Gemini Pro', category: 'subscriptions',
        desc: 'وصول لنسخة Gemini Advanced المتميزة. يُسلّم عبر الواتساب. / Access to Gemini Advanced. Delivered to WhatsApp.', basePrice: 10,
        icon: '<img src="./assets/gemini-pro.png" alt="Gemini Pro" class="full-cover-img">',
        rating: '4.9', details: { type: 'Shared Account', duration: '1 Month', delivery: 'WhatsApp', options: [{ label: '1 Month Shared', price: 10 }] }
    },
    {
        id: 'web1', title: 'E-commerce Store Creation', category: 'webdev',
        desc: 'Full creation of a premium, responsive e-commerce store with modern design.', basePrice: 170000 / 940,
        icon: '<img src="./assets/ecommerce-store.png" alt="E-commerce Store" class="full-cover-img">',
        rating: '5.0', details: { type: 'Service', includes: ['Custom Design', 'Payment Gateway Integration', 'Admin Panel'], hasForm: true }
    },
    {
        id: 'sm2', title: 'TikTok Followers', category: 'social',
        desc: 'Boost your TikTok presence instantly. Start seeing results in minutes.', basePrice: 0.01,
        icon: '<img src="./assets/tiktok-followers.png" alt="TikTok Followers" class="full-cover-img">',
        rating: '4.9', details: { type: 'High Quality Accounts', delivery: '5-30 Mins', batch: 1 }
    },
    {
        id: 'sm3', title: 'Facebook Followers', category: 'social',
        desc: 'Grow your Facebook page or profile organically with our fast service.', basePrice: 0.01,
        icon: '<img src="./assets/facebook-followers.png" alt="Facebook Followers" class="full-cover-img">',
        rating: '4.7', details: { type: 'Real Look Profiles', delivery: '1-3 Hours', batch: 1 }
    },
    {
        id: 'sm1', title: 'Instagram Followers', category: 'social',
        desc: 'High-quality Instagram followers. Instant delivery within 1-2 hours.', basePrice: 0.01,
        icon: '<img src="./assets/instagram-followers.png" alt="Instagram Followers" class="full-cover-img">',
        rating: '4.8', details: { type: 'Mixed (Real & HQ Bots)', delivery: '1-2 Hours', batch: 1 }
    },
    {
        id: 'g1', title: 'PUBG Mobile UC', category: 'gaming', outOfStock: true,
        desc: 'Instant PUBG Mobile UC Top-up. Secure and reliable directly to your Player ID.', basePrice: 5,
        icon: '<img src="./assets/pubg-uc.png" alt="PUBG Mobile UC" class="full-cover-img">',
        rating: '5.0', details: { type: 'Top-up', requiresId: true, requiresCountry: true, options: [
            { label: '60 UC', price: 5 }, { label: '325 UC', price: 20 }, { label: '660 UC', price: 40 }
        ]}
    },
    {
        id: 'g2', title: 'Free Fire Diamonds', category: 'gaming', outOfStock: true,
        desc: 'Get your Free Fire Diamonds instantly via Player ID.', basePrice: 4,
        icon: '<img src="./assets/freefire-diamonds.png" alt="Free Fire Diamonds" class="full-cover-img">',
        rating: '4.9', details: { type: 'Top-up', requiresId: true, requiresCountry: true, options: [
            { label: '100 Diamonds', price: 4 }, { label: '520 Diamonds', price: 20 }, { label: '1060 Diamonds', price: 40 }
        ]}
    },
    {
        id: 'web2', title: 'Website Modification', category: 'webdev',
        desc: 'Fix bugs, redesign sections, or add new features to your existing website.', basePrice: 85000 / 940,
        icon: '<img src="./assets/web-modification.png" alt="Website Modification" class="full-cover-img">',
        rating: '4.8', details: { type: 'Service', includes: ['UI/UX Adjustments', 'Code Optimization', 'Bug Fixing'], hasForm: true }
    }
];

// App State
let appState = {
    cart: JSON.parse(localStorage.getItem('zarz_cart')) || [],
    orders: JSON.parse(localStorage.getItem('zarz_orders')) || [],
    currency: 'SDG',
    lang: localStorage.getItem('zarz_lang') || 'ar',
    exchangeRates: { SAR: 1, USD: 0.266, AED: 0.979, SDG: 159.6, EGP: 12.6 }, // Default fallback (overridden below)
    currencySymbols: { SAR: 'SAR', USD: '$', AED: 'AED', SDG: 'SDG', EGP: 'EGP' }
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    // Apply persisted language settings to document
    document.documentElement.lang = appState.lang;
    document.documentElement.dir = appState.lang === 'ar' ? 'rtl' : 'ltr';
    const langBtnText = document.getElementById('lang-btn-text');
    if(langBtnText && typeof translations !== 'undefined' && translations[appState.lang]) {
        langBtnText.textContent = translations[appState.lang].lang_switch;
    }

    applyTranslations();
    await fetchExchangeRates();
    await detectUserCurrency();
    initRouter();
    renderProducts(products);
    updateCartCount();
    renderOrders();
    
    // Mobile Menu
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show-mobile-menu');
            mobileBtn.classList.toggle('active');
        });
        
        // Close menu on link click
        navLinks.addEventListener('click', (e) => {
             if (e.target.closest('a') || e.target.closest('button')) {
                 navLinks.classList.remove('show-mobile-menu');
                 mobileBtn.classList.remove('active');
             }
        });
    }

    // Currency listener (Removed as currency is now fixed to SDG)
    const curSelect = document.getElementById('currency');
    if(curSelect) {
        curSelect.addEventListener('change', (e) => {
            appState.currency = e.target.value;
            localStorage.setItem('zarz_currency', appState.currency);
            refreshPrices();
            renderCart();
        });
    }

    // Search & Filter
    document.getElementById('service-search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const activeFilter = document.querySelector('.category-filter li.active').dataset.filter;
        let filtered = products.filter(p => p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
        if(activeFilter !== 'all') filtered = filtered.filter(p => p.category === activeFilter);
        renderProducts(filtered);
    });

    document.querySelectorAll('.category-filter li').forEach(li => {
        li.addEventListener('click', (e) => {
            const targetLi = e.target.closest('li');
            if(!targetLi) return;
            document.querySelectorAll('.category-filter li').forEach(el => el.classList.remove('active'));
            targetLi.classList.add('active');
            const filter = targetLi.dataset.filter;
            document.getElementById('service-search').value = '';
            
            if(filter === 'all') renderProducts(products);
            else renderProducts(products.filter(p => p.category === filter));
        });
    });

    // -- Form Persistence Setup --
    const restoreCheckout = () => {
        const savedCheckout = JSON.parse(localStorage.getItem('zarz_checkout')) || {};
        if(savedCheckout.name) document.getElementById('checkout-name').value = savedCheckout.name;
        if(savedCheckout.phone) document.getElementById('checkout-phone').value = savedCheckout.phone;
    };
    
    restoreCheckout();

    const saveCheckout = () => {
        const nameInput = document.getElementById('checkout-name');
        const phoneInput = document.getElementById('checkout-phone');
        const name = nameInput ? nameInput.value : '';
        const phone = phoneInput ? phoneInput.value : '';
        localStorage.setItem('zarz_checkout', JSON.stringify({ name, phone }));
    };

    const checkoutForm = document.getElementById('checkoutForm');
    if(checkoutForm) {
        checkoutForm.addEventListener('input', saveCheckout);
        checkoutForm.addEventListener('change', saveCheckout);
    }

    document.getElementById('details-container').addEventListener('input', () => { if(window.saveDetailsState) window.saveDetailsState(); });
    document.getElementById('details-container').addEventListener('change', () => { if(window.saveDetailsState) window.saveDetailsState(); });
});

window.saveDetailsState = function() {
    let state = {};
    const extract = (id) => { const el = document.getElementById(id); if(el) state[id] = el.value; };
    ['target-link', 'detail-qty', 'game-country', 'player-id', 'game-package', 'target-email', 'web-req', 'ref-link'].forEach(extract);
    localStorage.setItem('zarz_details_form', JSON.stringify(state));
};

window.restoreDetailsState = function() {
    let state = JSON.parse(localStorage.getItem('zarz_details_form')) || {};
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


// Exchange Rates
async function fetchExchangeRates() {
    appState.exchangeRates = {
        SAR: 1,
        SDG: 940,
        USD: 940 / 3500,
        EGP: 940 / 73,
        AED: 940 / 942
    };
    appState.currency = 'SDG'; // Force SDG
    localStorage.setItem('zarz_currency', 'SDG');
    refreshPrices();
}

// Geo-Location Currency Detection (Disabled to enforce SDG)
async function detectUserCurrency() {
    appState.currency = 'SDG';
    localStorage.setItem('zarz_currency', 'SDG');
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
        if(viewId === 'cart') renderCart();
    }
}

// To use from hero buttons
function filterStore(cat) {
    navigateTo('store');
    document.querySelectorAll('.category-filter li').forEach(el => el.classList.remove('active'));
    const targetLi = document.querySelector(`.category-filter li[data-filter="${cat}"]`);
    if(targetLi) targetLi.classList.add('active');
    renderProducts(products.filter(p => p.category === cat));
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
function generateProductCardHTML(p) {
    let title = p.title;
    let desc = p.desc;
    if(translations && appState.lang && translations[appState.lang][`prod_${p.id}_title`]) {
        title = translations[appState.lang][`prod_${p.id}_title`];
        desc = translations[appState.lang][`prod_${p.id}_desc`];
    }
    const oldPrice = p.basePrice * 1.25;
    const discountBadge = `<div style="position:absolute; top:10px; right:10px; z-index:2; background:var(--accent-red); color:white; padding:4px 8px; border-radius:6px; font-size:0.8rem; font-weight:bold;">${appState.lang === 'ar' ? 'خصم 20%' : '-20%'}</div>`;
    
    // Add sold out logic here
    const isSoldOut = p.outOfStock;
    const soldOutBadge = isSoldOut ? `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:10; background:rgba(255,59,48,0.9); color:white; padding:10px 20px; border-radius:8px; font-weight:bold; font-size:1.2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">${appState.lang === 'ar' ? 'نفذت الكمية' : 'Sold Out'}</div>` : '';

    const priceHtml = isSoldOut 
        ? `<div style="display:flex; justify-content:center; width:100%;"><span style="color:var(--text-secondary); font-weight:bold; font-size:1.1rem; text-transform:uppercase;">${appState.lang === 'ar' ? 'نفذت الكمية' : 'Sold Out'}</span></div>`
        : `<div style="display:flex; flex-direction:column; gap:0.2rem;">
               <span style="font-size:0.75rem; color:var(--text-secondary); text-decoration:line-through;" data-price-sar="${oldPrice}">${formatPrice(oldPrice)}</span>
               <span class="product-price" data-price-sar="${p.basePrice}" style="color:var(--accent-red); font-weight:bold; font-size:1.1rem;">${formatPrice(p.basePrice)}</span>
           </div>
           <button class="btn btn-primary" style="padding: 0.6rem 0.8rem; border-radius: 8px; flex-shrink:0;" onclick="event.stopPropagation(); viewDetails('${p.id}')">
               <i class="fa-solid fa-cart-shopping"></i>
           </button>`;

    return `
    <div class="product-card" ${isSoldOut ? '' : `onclick="viewDetails('${p.id}')" style="cursor:pointer;"`} title="${appState.lang === 'ar' ? 'التفاصيل' : 'Details'}">
        <div class="product-image" ${isSoldOut ? 'style="opacity:0.6; filter:grayscale(1);"' : ''}>
            ${isSoldOut ? soldOutBadge : discountBadge}
            <span class="product-badge"><i class="fa-solid fa-star text-accent"></i> ${p.rating}</span>
            ${p.icon}
        </div>
        <div class="product-info" ${isSoldOut ? 'style="opacity:0.7;"' : ''}>
            <div class="product-cat">${formatCategory(p.category)}</div>
            <h3 class="product-title">${title}</h3>
            <p class="product-desc">${desc}</p>
            <div class="product-price-row">
                ${priceHtml}
            </div>
        </div>
    </div>
    `;
}

function renderProducts(items) {
    const container = document.getElementById('products-container');
    if(container) {
        container.innerHTML = items.map(generateProductCardHTML).join('');
    }
    
    const featContainer = document.getElementById('featured-container');
    if(featContainer) {
        const topIds = ['sm2', 'g1', 'sub1', 'web1'];
        const featuredItems = products.filter(p => topIds.includes(p.id));
        featContainer.innerHTML = featuredItems.map(generateProductCardHTML).join('');
    }

    refreshPrices();
}

function formatCategory(cat) {
    if(appState.lang === 'ar') {
        const map = { social: 'تواصل اجتماعي', gaming: 'ألعاب', subscriptions: ' اشتراكات الذكاء الصناعي', webdev: 'تطوير ويب' };
        return map[cat] || cat;
    }
    const map = { social: 'Social Media', gaming: 'Gaming', subscriptions: 'Subscriptions', webdev: 'Web Development' };
    return map[cat] || cat;
}

// View Product Details
function viewDetails(productId) {
    localStorage.setItem('zarz_active_product', productId);
    const product = products.find(p => p.id === productId);
    if(!product) return;
    
    const t = (en, ar) => appState.lang === 'ar' ? ar : en;
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
            <div class="details-image">${product.icon}</div>
            <div class="details-info">
                <div class="details-cat">${formatCategory(product.category)}</div>
                <h1>${product.title}</h1>
                <p class="details-desc">${product.desc}</p>
                <div class="dynamic-options">
                    ${dynamicHtml}
                </div>
                
                <div class="price-action-container" style="background:var(--surface-light); padding:1.5rem; border-radius:var(--border-radius-lg); border:1px solid var(--border-color); margin-top:2rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:1rem;">
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-size:1.1rem; color:var(--text-secondary); font-weight:600;">${t('Total Price', 'السعر الإجمالي')}</span>
                            <span id="detail-old-price-display" data-base-sar="${product.basePrice * 1.25}" data-price-sar="${product.basePrice * 1.25}" style="text-decoration:line-through; color:var(--text-secondary); font-size:1rem; margin-top:5px;">
                                ${formatPrice(product.basePrice * 1.25)}
                            </span>
                        </div>
                        <div class="details-price" id="detail-price-display" data-base-sar="${product.basePrice}" data-price-sar="${product.basePrice}" style="margin:0; font-size:2rem; font-weight:bold; color:var(--accent-red);">
                            ${formatPrice(product.basePrice)}
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-secondary w-100" onclick="addToCart('${product.id}')" style="padding: 1rem; font-size:1.1rem; flex:1;">
                            <i class="fa-solid fa-cart-plus"></i> ${appState.lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                        </button>
                        <button class="btn btn-primary w-100" onclick="orderNow('${product.id}')" style="padding: 1rem; font-size:1.1rem; flex:1;">
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
        if(!link) return showToast('Please enter target link', 'error');
        customData.link = link;
        customData.qtyMultiplier = qty; // For social, price scales with 1000s
        finalPrice = product.basePrice * qty;
    } else if(product.category === 'gaming') {
        const country = document.getElementById('game-country') ? document.getElementById('game-country').value : 'Global';
        const playerId = document.getElementById('player-id') ? document.getElementById('player-id').value : '';
        const pkgSelect = document.getElementById('game-package');
        
        if(product.details.requiresId && !playerId) return showToast('Please enter Player ID', 'error');
        
        if(pkgSelect) {
            const opt = pkgSelect.options[pkgSelect.selectedIndex];
            customData.package = opt.text;
            finalPrice = parseFloat(opt.getAttribute('data-price')) * qty;
        }
        customData.playerId = playerId;
        customData.server = country;
    } else if(product.category === 'subscriptions') {
        const phone = document.getElementById('target-phone').value;
        if(!phone) return showToast('Please enter recipient number', 'error');
        customData.phone = phone;
    } else if(product.category === 'webdev') {
        customData.requirements = document.getElementById('web-req').value;
    }

    // Add to state
    appState.cart.push({
        cartId: Date.now().toString(),
        product,
        qty: qty,
        unitPriceSar: finalPrice / qty,
        totalPriceSar: finalPrice,
        customData
    });
    
    localStorage.setItem('zarz_cart', JSON.stringify(appState.cart));
    updateCartCount();
    showToast(translations[appState.lang].toast_added || 'Added to cart successfully!', 'success');
}

function updateCartCount() {
    const el = document.getElementById('cart-count');
    el.textContent = appState.cart.length;
    
    // Pulse animation
    el.style.transform = 'scale(1.5)';
    setTimeout(() => el.style.transform = 'scale(1)', 200);
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
        container.innerHTML = `<p style="color:var(--text-secondary)">Your cart is empty.</p>`;
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
        if(item.customData.link) metaParts.push(`Link: ${item.customData.link.substring(0,20)}...`);
        if(item.customData.package) metaParts.push(item.customData.package);
        if(item.customData.playerId) metaParts.push(`ID: ${item.customData.playerId}`);
        if(item.customData.phone) metaParts.push(`Number: ${item.customData.phone}`);
        
        return `
        <div class="cart-item">
            <div class="cart-item-img">${item.product.icon}</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.product.title}</div>
                <div class="cart-item-meta">${metaParts.join(' | ')}</div>
                ${item.qty > 1 && item.product.category !== 'social' ? `<div class="cart-item-meta">Qty: ${item.qty}</div>` : ''}
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
            <h3>Order Total</h3>
            <div class="summary-row" style="margin-top:1rem">
                <span>Items (${appState.cart.length})</span>
                <span class="price">${formatPrice(subtotalSar)}</span>
            </div>
            <div class="summary-row total">
                <span>To Pay</span>
                <span class="price text-accent" style="font-size:1.8rem">${formatPrice(totalSar)}</span>
            </div>
            <p style="color:var(--text-secondary); font-size:0.8rem; margin-top:1rem">
                Paying in ${appState.currency}. Current rate applies.
            </p>
        `;
    }
}

// Checkout processing
window.processOrder = function() {
    if(appState.cart.length === 0) return;
    
    const nameInput = document.getElementById('checkout-name').value.trim();
    const phoneInput = document.getElementById('checkout-phone').value.trim();
    
    if(!nameInput || !phoneInput) {
        showToast(appState.lang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields', 'error');
        return;
    }
    
    const btn = document.querySelector('#checkoutForm button[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';
    if(btn) {
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ${appState.lang === 'ar' ? 'جاري المعالجة...' : 'Processing...'}`;
        btn.disabled = true;
    }

    showToast(appState.lang === 'ar' ? 'جاري تحويلك للواتساب...' : 'Redirecting to WhatsApp...', 'info');
    finalizeOrder('whatsapp', btn, originalText);
};

window.finalizeOrder = function(type, submitBtn = null, submitOriginalText = null) {
    const nameInput = document.getElementById('checkout-name').value.trim();
    const phoneInput = document.getElementById('checkout-phone').value.trim();
    const orderNum = `ZARZ-${Math.floor(Math.random()*10000)}`;
    const totalStr = document.getElementById('cart-total').textContent;
    let detailsStr = appState.cart.map(item => {
        let metaParts = [];
        if(item.customData.link) metaParts.push(`Link: ${item.customData.link}`);
        if(item.customData.package) metaParts.push(item.customData.package);
        if(item.customData.playerId) metaParts.push(`ID: ${item.customData.playerId}`);
        if(item.customData.phone) metaParts.push(`Number: ${item.customData.phone}`);
        if(item.customData.server) metaParts.push(`Server: ${item.customData.server}`);
        return `*${item.qty}x ${item.product.title}* - ${formatPrice(item.totalPriceSar)}\n  ${metaParts.join(', ')}`;
    }).join('\n\n');

    let newOrder = {
        id: orderNum,
        date: new Date().toISOString(),
        method: 'WhatsApp',
        mode: 'whatsapp',
        status: 'Processing',
        total: totalStr,
        items: appState.cart.map(i => ({ title: i.product.title, qty: i.qty }))
    };
    appState.orders.unshift(newOrder);
    appState.cart = [];
    localStorage.setItem('zarz_orders', JSON.stringify(appState.orders));
    localStorage.setItem('zarz_cart', JSON.stringify(appState.cart));
    localStorage.removeItem('zarz_checkout');
    updateCartCount();
    renderOrders();

    const msg = `*New Order Request*\n*Order Number:* ${orderNum}\n*Name:* ${nameInput}\n*Phone:* ${phoneInput}\n\n*Order Details:*\n${detailsStr}\n\n*Total Amount:* ${totalStr}\n\nكيف تود الدفع؟ (طريقة الدفع: بنكك / كاش / غير ذلك)\nHow would you like to pay? (Bankak / Cash / other)`;

    setTimeout(() => {
        navigateTo('account');
        if(submitBtn) {
            submitBtn.innerHTML = submitOriginalText;
            submitBtn.disabled = false;
        }
        window.open(`https://wa.me/201500007300?text=${encodeURIComponent(msg)}`, '_blank');
    }, 800);
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
    
    const ordersHtml = appState.orders.map(order => `
        <div class="cart-item" style="border-left: 4px solid var(--accent-green); animation: slideUpFade 0.4s ease-out;">
            <div class="cart-item-img"><i class="fa-solid fa-check text-green"></i></div>
            <div class="cart-item-info">
                <div class="cart-item-title">Order #${order.id}</div>
                <div class="cart-item-meta">
                    <span style="color:var(--accent-green); font-weight:bold;">Status: Processing</span> | 
                    Method: ${order.method} ${order.mode === 'whatsapp' ? '(WhatsApp)' : '(Direct)'}
                </div>
                <div class="cart-item-meta" style="margin-top:0.3rem;">
                    Total: ${order.total} | Date: ${new Date(order.date).toLocaleDateString()}
                </div>
            </div>
            <button class="btn btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.8rem">Details</button>
        </div>
    `).join('');
    
    list.insertAdjacentHTML('beforeend', ordersHtml);
}

window.toggleLanguage = function() {
    appState.lang = appState.lang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('zarz_lang', appState.lang);
    
    document.documentElement.lang = appState.lang;
    document.documentElement.dir = appState.lang === 'ar' ? 'rtl' : 'ltr';
    const langBtnText = document.getElementById('lang-btn-text');
    if(langBtnText) langBtnText.textContent = translations[appState.lang].lang_switch;
    applyTranslations();
    
    // Refresh Active UI Elements
    renderProducts(products);
    renderCart();

    const activeView = document.querySelector('.view.active');
    if(activeView && activeView.id === 'view-details') {
        navigateTo('store'); // Return to store explicitly to prevent details view misalignment with language switch
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
        showToast(translations[appState.lang].copied_msg || 'Account copied!', 'success');
    }).catch(err => {
        showToast('Failed to copy', 'error');
    });
};
