import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppFrame } from "./AppFrame";
import { Home } from "../pages/Home";
import { Store } from "../pages/Store";
import { Cart } from "../pages/Cart";
import { Account } from "../pages/Account";
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
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Cart />} />
          <Route path="/products/cart" element={<Cart />} />
          <Route path="/products/checkout" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/store.html" element={<Store />} />
          <Route path="/account.html" element={<Account />} />
          <Route path="/contact.html" element={<Contact />} />
          <Route path="/terms.html" element={<Terms />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AppFrame>
    </MemoryRouter>
  );
}
