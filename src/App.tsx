import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AppFrame } from "./app/AppFrame";
import { getCatalogPath, getCatalogRouteCategory, getCategoryName } from "./lib/storeCatalog";
import { Home } from "./pages/Home";

const Store = lazy(() => import("./pages/Store").then((module) => ({ default: module.Store })));
const ProductDetails = lazy(() =>
  import("./pages/ProductDetails").then((module) => ({ default: module.ProductDetails })),
);
const Contact = lazy(() => import("./pages/Contact").then((module) => ({ default: module.Contact })));
const Terms = lazy(() => import("./pages/Terms").then((module) => ({ default: module.Terms })));
const CartRoute = lazy(() => import("./routes/CartRoute"));
const AccountRoute = lazy(() => import("./routes/AccountRoute"));

function setDocumentTitle(pageName: string) {
  const prefix = "زارز | ZARZ | ";
  let title = `${prefix}${pageName}`;
  if (title.length > 60) {
    title = `${prefix}${pageName.slice(0, 60 - prefix.length - 3)}...`;
  }

  document.title = title;
}

function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
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
      void import("./data/products")
        .then(({ getProductBySlugOrId }) => {
          if (cancelled) return;
          const product = getProductBySlugOrId(id ? decodeURIComponent(id) : "");
          setDocumentTitle(product?.title || "تفاصيل المنتج");
        })
        .catch(() => {
          if (!cancelled) setDocumentTitle("تفاصيل المنتج");
        });

      return () => {
        cancelled = true;
      };
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

    setDocumentTitle(pageName);

    return () => {
      cancelled = true;
    };
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

export default function App() {
  return (
    <Router>
      <CanonicalPath />
      <DynamicTitle />
      <ScrollToTop />
      <AppFrame>
        <Suspense fallback={null}>
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
