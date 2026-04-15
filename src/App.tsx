import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { ScrollToTop } from "./components/ScrollToTop";
import { getProductBySlugOrId } from "./data/products";

const Store = lazy(() => import("./pages/Store").then((module) => ({ default: module.Store })));
const Cart = lazy(() => import("./pages/Cart").then((module) => ({ default: module.Cart })));
const Account = lazy(() => import("./pages/Account").then((module) => ({ default: module.Account })));
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

function RouteSkeleton() {
  return (
    <div className="mx-auto flex min-h-[52vh] w-full max-w-screen-2xl flex-col gap-5 px-6 pb-12 pt-28 md:px-12 md:pt-32" aria-hidden="true">
      <div className="h-5 w-24 rounded-full bg-white/8" />
      <div className="h-12 w-full max-w-[20rem] rounded-full bg-white/8" />
      <div className="h-4 w-full max-w-2xl rounded-full bg-white/6" />
      <div className="h-4 w-full max-w-xl rounded-full bg-white/6" />
      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="aspect-[4/5] rounded-[1.5rem] border border-white/6 bg-surface-container-low/70 shadow-[0_10px_24px_rgba(8,6,18,0.16)]" />
        <div className="aspect-[4/5] rounded-[1.5rem] border border-white/6 bg-surface-container-low/70 shadow-[0_10px_24px_rgba(8,6,18,0.16)]" />
        <div className="hidden aspect-[4/5] rounded-[1.5rem] border border-white/6 bg-surface-container-low/70 shadow-[0_10px_24px_rgba(8,6,18,0.16)] lg:block" />
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
      <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<RouteSkeleton />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Store />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/products/cart" element={<Navigate to="/cart" replace />} />
              <Route path="/checkout" element={<Navigate to="/cart" replace />} />
              <Route path="/products/checkout" element={<Navigate to="/cart" replace />} />
              <Route path="/account" element={<Account />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/store.html" element={<Navigate to="/products" replace />} />
              <Route path="/account.html" element={<Navigate to="/account" replace />} />
              <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
              <Route path="/terms.html" element={<Navigate to="/terms" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
