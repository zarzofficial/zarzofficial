export type Category = "social" | "ai" | "gaming";
import { getLegacyOriginalPrice } from "../lib/pricing";

export interface ProductOption {
  label: string;
  price: number;
}

export interface ProductVariationGroup {
  id: string;
  label: string;
  options: Array<{ id?: string; label: string }>;
}

export interface ProductDetails {
  type?: string;
  duration?: string;
  delivery?: string;
  batch?: number;
  options?: ProductOption[];
  includes?: string[];
  requiresId?: boolean;
  requiresCountry?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: Category;
  desc: string;
  basePrice: number;
  image: string;
  rating: string;
  outOfStock: boolean;
  features: string[];
  details: ProductDetails;
  originalPrice?: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  variationGroups?: ProductVariationGroup[];
}

const rawProducts: Product[] = [
  {
    id: "شات-جي-بي-تي-بلس",
    slug: "شات-جي-بي-تي-بلس",
    title: "شات جي بي تي بلس (ChatGPT Plus) - شهر واحد",
    category: "ai",
    desc: "استمتع بأقوى نسخة من شات جي بي تي مع سرعة وأداء متقدم. دخول بجهازين، تجديد اشتراك أوفر، ضمان كامل المدة، ودعم فني مستمر.",
    basePrice: 19999,
    originalPrice: 20000,
    image: "/assets/chatgpt-plus-v4.avif",
    rating: "5.0",
    outOfStock: false,
    features: ["دخول بجهازين", "تجديد اشتراك أوفر", "ضمان كامل المدة", "دعم فني مستمر"],
    details: {
      type: "حساب خاص",
      duration: "شهر واحد",
      delivery: "واتساب",
      options: [{ label: "اشتراك شهر واحد", price: 19999 }],
    },
    reviewCount: 222,
    stock: 14,
    variationGroups: [
      {
        id: "support",
        label: "الدعم",
        options: [
          { id: "standard", label: "قياسي" },
          { id: "priority", label: "مميز" },
        ],
      },
    ],
    featured: true,
  },
  {
    id: "جيميني-برو",
    slug: "جيميني-برو",
    title: "جيميني برو (Gemini Pro)",
    category: "ai",
    desc: "وصول إلى النسخة المتقدمة من جيميني. أداء فائق وتحليل أعمق للبيانات مع تسليم مباشر ومتابعة سريعة.",
    basePrice: 12200,
    originalPrice: 15000,
    image: "/assets/gemini-pro-v3.avif",
    rating: "5.0",
    outOfStock: false,
    features: ["دخول بجهازين", "تجديد اشتراك أوفر", "ضمان كامل المدة", "دعم فني مستمر"],
    details: {
      type: "حساب خاص",
      duration: "شهر واحد",
      delivery: "واتساب",
      options: [
        { label: "اشتراك شهر واحد", price: 12200 },
        { label: "اشتراك 4 شهور", price: 29000 },
      ],
    },
    reviewCount: 154,
    stock: 18,
  },
  {
    id: "متابعين-إنستغرام",
    slug: "متابعين-إنستغرام",
    title: "زيادة متابعين إنستغرام",
    category: "social",
    desc: "عرض مذهل! إذا تم شراء ألف متابع يأتي معها هدية ألف لايك وألفين مشاهدة. السعر للمتابع الواحد.",
    basePrice: 9.4,
    originalPrice: 15.6,
    image: "/assets/instagram-followers-v4.avif",
    rating: "5.0",
    outOfStock: false,
    features: ["هدية 1000 لايك", "هدية 2000 مشاهدة", "توصيل لليوزرنيم", "خدمة مضمونة"],
    details: { type: "حسابات عالية الجودة", delivery: "1-2 ساعة", batch: 1 },
    reviewCount: 286,
    stock: 84,
    featured: true,
    variationGroups: [
      {
        id: "quality",
        label: "الجودة",
        options: [
          { id: "steady", label: "ثابت" },
          { id: "fast", label: "سريع" },
          { id: "mixed", label: "مختلط" },
        ],
      },
    ],
  },
  {
    id: "متابعين-تيك-توك",
    slug: "متابعين-تيك-توك",
    title: "زيادة متابعين تيك توك",
    category: "social",
    desc: "عرض مذهل! إذا تم شراء ألف متابع يأتي معها هدية ألف لايك وألفين مشاهدة. السعر للمتابع الواحد.",
    basePrice: 9.4,
    originalPrice: 15.6,
    image: "/assets/tiktok-followers-v4.avif",
    rating: "5.0",
    outOfStock: false,
    features: ["هدية 1000 لايك", "هدية 2000 مشاهدة", "توصيل لليوزرنيم", "خدمة مضمونة"],
    details: { type: "حسابات عالية الجودة", delivery: "5-30 دقيقة", batch: 1 },
    reviewCount: 342,
    stock: 91,
    featured: true,
    variationGroups: [
      {
        id: "campaign",
        label: "نوع الحملة",
        options: [
          { id: "starter", label: "بداية" },
          { id: "growth", label: "نمو" },
          { id: "boost", label: "دفعة قوية" },
        ],
      },
    ],
  },
  {
    id: "متابعين-فيسبوك",
    slug: "متابعين-فيسبوك",
    title: "زيادة متابعين فيسبوك",
    category: "social",
    desc: "عرض مذهل! إذا تم شراء ألف متابع يأتي معها هدية ألف لايك وألفين مشاهدة. السعر للمتابع الواحد.",
    basePrice: 9.4,
    originalPrice: 15.6,
    image: "/assets/facebook-followers-v4.avif",
    rating: "5.0",
    outOfStock: false,
    features: ["هدية 1000 لايك", "هدية 2000 مشاهدة", "نمو مستمر", "خدمة مضمونة"],
    details: { type: "حسابات ذات مظهر حقيقي", delivery: "1-3 ساعات", batch: 1 },
    reviewCount: 168,
    stock: 47,
    variationGroups: [
      {
        id: "delivery",
        label: "الوتيرة",
        options: [
          { id: "natural", label: "طبيعي" },
          { id: "balanced", label: "متوازن" },
        ],
      },
    ],
  },
  {
    id: "شدات-ببجي",
    slug: "شدات-ببجي",
    title: "شحن شدات UC ببجي موبايل",
    category: "gaming",
    desc: "توصيل مباشر للمعرف ID، حزم وعروض حصرية، شحن آمن ومضمون، ودعم فني مستمر.",
    basePrice: 1000,
    originalPrice: 1700,
    image: "/assets/pubg-uc-v4.avif",
    rating: "5.0",
    outOfStock: true,
    features: ["توصيل مباشر للمعرف ID", "حزم وعروض حصرية", "شحن آمن", "دعم فني مستمر"],
    details: {
      type: "شحن",
      requiresId: true,
      requiresCountry: true,
      options: [
        { label: "60 شدة", price: 1000 },
        { label: "325 شدة", price: 3200 },
        { label: "660 شدة", price: 5800 },
      ],
    },
    reviewCount: 504,
    featured: true,
    stock: 0,
  },
  {
    id: "جواهر-فري-فاير",
    slug: "جواهر-فري-فاير",
    title: "شحن مجوهرات فري فاير",
    category: "gaming",
    desc: "توصيل مباشر للمعرف ID، حزم وعروض حصرية، شحن آمن ومضمون، ودعم مستمر.",
    basePrice: 800,
    originalPrice: 1350,
    image: "/assets/freefire-diamonds-v4.avif",
    rating: "5.0",
    outOfStock: true,
    features: ["توصيل مباشر للمعرف ID", "حزم وعروض حصرية", "شحن آمن", "دعم مستمر"],
    details: {
      type: "شحن",
      requiresId: true,
      requiresCountry: true,
      options: [
        { label: "100 جوهرة", price: 800 },
        { label: "520 جوهرة", price: 3200 },
        { label: "1060 جوهرة", price: 6000 },
      ],
    },
    reviewCount: 391,
    featured: true,
    stock: 0,
  },
];

export const products: Product[] = rawProducts.map((product) => ({
  ...product,
  originalPrice: getLegacyOriginalPrice(product.basePrice),
}));

export const productById = new Map(products.map((product) => [product.id, product]));
export const productBySlug = new Map(products.map((product) => [product.slug, product]));
export const featuredProducts = products.filter((product) => product.featured);
export const legacyProductSlugMap: Record<string, string> = {
  "شات-جي-بي-تي-بلس-شهر": "شات-جي-بي-تي-بلس",
  "جيميني-برو-شهر": "جيميني-برو",
  "شدات-ببجي-موبايل": "شدات-ببجي",
  "متابعين-انستجرام": "متابعين-إنستغرام",
};

export function getProductById(id: string | null | undefined) {
  return id ? productById.get(id) || null : null;
}

export function getProductBySlug(slug: string | null | undefined) {
  if (!slug) return null;
  return productBySlug.get(slug) || productBySlug.get(legacyProductSlugMap[slug] || "") || null;
}

export function getProductBySlugOrId(value: string | null | undefined) {
  return getProductBySlug(value) || getProductById(value);
}

export function getCategoryLabel(category: Category) {
  switch (category) {
    case "ai":
      return "الذكاء الاصطناعي";
    case "social":
      return "وسائل التواصل";
    case "gaming":
      return "ألعاب الفيديو";
    default:
      return category;
  }
}
