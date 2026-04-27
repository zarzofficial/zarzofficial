import { Suspense } from "react";
import { MemoryRouter, Navigate, Route, Routes, useParams, useSearchParams } from "react-router-dom";
import { AppFrame } from "./AppFrame";
import { Home } from "../pages/Home";
import { Store } from "../pages/Store";
import CartRoute from "../routes/CartRoute";
import AccountRoute from "../routes/AccountRoute";
import { Contact } from "../pages/Contact";
import { Terms } from "../pages/Terms";
import { ProductDetails } from "../pages/ProductDetails";
import { getCatalogPath, getCatalogRouteCategory } from "../lib/storeCatalog";

function normalizeServerLocation(location: string) {
  if (!location) return "/";
  if (location === "/") return "/";

  const [path, suffix = ""] = location.split(/([?#].*)/, 2);
  let decodedPath = path;

  try {
    decodedPath = decodeURI(path);
  } catch {
    decodedPath = path;
  }

  const normalizedPath = decodedPath.replace(/\/+$/, "") || "/";
  return `${normalizedPath}${suffix}`;
}

function CatalogRoute() {
  const { category } = useParams<{ category?: string }>();

  if (getCatalogRouteCategory(category) === null) {
    return <Navigate to="/products" replace />;
  }

  return <Store />;
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

export function ServerApp({ location }: { location: string }) {
  return (
    <MemoryRouter initialEntries={[normalizeServerLocation(location)]}>
      <AppFrame>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<StoreRoute />} />
            <Route path="/products/catalog" element={<Navigate to="/products" replace />} />
            <Route path="/products/catalog/:category" element={<CatalogRoute />} />
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
    </MemoryRouter>
  );
}
