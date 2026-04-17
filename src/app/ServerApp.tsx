import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppFrame } from "./AppFrame";
import { Home } from "../pages/Home";
import { Store } from "../pages/Store";
import CartRoute from "../routes/CartRoute";
import AccountRoute from "../routes/AccountRoute";
import { Contact } from "../pages/Contact";
import { Terms } from "../pages/Terms";
import { ProductDetails } from "../pages/ProductDetails";

function normalizeServerLocation(location: string) {
  if (!location) return "/";
  if (location === "/") return "/";

  const [path, suffix = ""] = location.split(/([?#].*)/, 2);
  const normalizedPath = path.replace(/\/+$/, "") || "/";
  return `${normalizedPath}${suffix}`;
}

export function ServerApp({ location }: { location: string }) {
  return (
    <MemoryRouter initialEntries={[normalizeServerLocation(location)]}>
      <AppFrame>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Store />} />
          <Route path="/products/catalog" element={<Navigate to="/products" replace />} />
          <Route path="/products/catalog/:category" element={<Store />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartRoute />} />
          <Route path="/checkout" element={<CartRoute />} />
          <Route path="/products/cart" element={<CartRoute />} />
          <Route path="/products/checkout" element={<CartRoute />} />
          <Route path="/account" element={<AccountRoute />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/store.html" element={<Store />} />
          <Route path="/account.html" element={<AccountRoute />} />
          <Route path="/contact.html" element={<Contact />} />
          <Route path="/terms.html" element={<Terms />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AppFrame>
    </MemoryRouter>
  );
}
