import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { getProductBySlugOrId } from "./data/products";
import { AppFrame } from "./app/AppFrame";
import { getCatalogPath, getCatalogRouteCategory, getCategoryName } from "./lib/storeCatalog";

const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const Store = lazy(() => import("./pages/Store").then((module) => ({ default: module.Store })));
const CartRoute = lazy(() => import("./routes/CartRoute"));
const AccountRoute = lazy(() => import("./routes/AccountRoute"));
const Contact = lazy(() => import("./pages/Contact").then((module) => ({ default: module.Contact })));
const Terms = lazy(() => import("./pages/Terms").then((module) => ({ default: module.Terms })));
const ProductDetails = lazy(() =>
  import("./pages/ProductDetails").then((module) => ({ default: module.ProductDetails })),
);

function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    let pageName = "الرئيسية";
    const path = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");

    if (path === "/cart" || path === "/products/cart") {
      pageName = "سلة المشتريات";
    } else if (path === "/checkout" || path === "/products/checkout") {
      pageName = "إتمام الطلب";
    } else if (path === "/products/catalog" || path.startsWith("/products/catalog/")) {
      const categoryId = path === "/products/catalog" ? null : path.split("/products/catalog/")[1];
      const category = getCatalogRouteCategory(categoryId);
      pageName = category && category !== "all" ? `المنتجات | ${getCategoryName(category)}` : "المنتجات";
    } else if (path.startsWith("/products/")) {
      const id = path.split("/products/")[1];
      const product = getProductBySlugOrId(id ? decodeURIComponent(id) : "");
      pageName = product?.title || "تفاصيل المنتج";
    } else {
      switch (path) {
        case "/":
          pageName = "الرئيسية";
          break;
        case "/products":
          pageName = "المنتجات";
          break;
        case "/account":
          pageName = "حسابي";
          break;
        case "/contact":
          pageName = "تواصل معنا";
          break;
        case "/terms":
          pageName = "الشروط والأحكام";
          break;
        default:
          pageName = "الصفحة غير موجودة";
      }
    }

    const prefix = "زارز | ZARZ | ";
    let title = `${prefix}${pageName}`;
    if (title.length > 60) {
      title = `${prefix}${pageName.slice(0, 60 - prefix.length - 3)}...`;
    }

    document.title = title;
  }, [location.pathname]);

  return null;
}

function CanonicalPath() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") return;

    const normalizedPath = location.pathname.replace(/\/+$/, "");
    if (!normalizedPath || normalizedPath === location.pathname) return;

    navigate(
      {
        pathname: normalizedPath,
        search: location.search,
        hash: location.hash,
      },
      { replace: true, state: location.state },
    );
  }, [location.hash, location.pathname, location.search, location.state, navigate]);

  return null;
}

function StoreRoute() {
  const [searchParams] = useSearchParams();
  const legacyCategory = searchParams.get("category");

  if (legacyCategory) {
    const requestedCategory = getCatalogRouteCategory(legacyCategory);
    return <Navigate to={getCatalogPath(requestedCategory ?? "all")} replace />;
  }

  return <Store />;
}

function RouteFallback() {
  return (
    <div className="min-h-[52vh] bg-background px-6 pb-16 pt-28 text-on-background md:px-12" aria-hidden="true">
      <div className="mx-auto max-w-screen-2xl animate-pulse">
        <div className="mb-4 h-3 w-24 rounded-full bg-primary/20" />
        <div className="mb-4 h-10 w-full max-w-md rounded-full bg-surface-container" />
        <div className="mb-12 h-4 w-full max-w-xl rounded-full bg-surface-container-high" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[1.75rem] border border-outline-variant/10 bg-surface-container-low">
              <div className="aspect-[4/3] w-full bg-surface-container" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 rounded-full bg-surface-container-high" />
                <div className="h-4 w-full rounded-full bg-surface-container-highest/60" />
                <div className="h-4 w-5/6 rounded-full bg-surface-container-highest/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <CanonicalPath />
      <DynamicTitle />
      <ScrollToTop />
      <AppFrame>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<StoreRoute />} />
              <Route path="/products/catalog" element={<Navigate to="/products" replace />} />
              <Route path="/products/catalog/:category" element={<Store />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<CartRoute />} />
              <Route path="/products/cart" element={<Navigate to="/cart" replace />} />
              <Route path="/checkout" element={<Navigate to="/cart" replace />} />
              <Route path="/products/checkout" element={<Navigate to="/cart" replace />} />
              <Route path="/account" element={<AccountRoute />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/store.html" element={<Navigate to="/products" replace />} />
              <Route path="/account.html" element={<Navigate to="/account" replace />} />
              <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
              <Route path="/terms.html" element={<Navigate to="/terms" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
      </AppFrame>
    </Router>
  );
}
