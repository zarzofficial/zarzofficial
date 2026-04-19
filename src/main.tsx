import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppProviders } from './app/AppProviders';

async function cleanupLegacyServiceWorkers() {
  if (typeof window === "undefined") return;

  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => registration.unregister().catch(() => false)),
      );
    } catch (error) {
      console.error("Legacy service worker cleanup failed", error);
    }
  }

  if ("caches" in window) {
    try {
      const cacheKeys = await window.caches.keys();
      await Promise.all(
        cacheKeys
          .filter((cacheKey) => cacheKey.startsWith("zarz-pwa"))
          .map((cacheKey) => window.caches.delete(cacheKey)),
      );
    } catch (error) {
      console.error("Legacy cache cleanup failed", error);
    }
  }
}

function normalizeStartupPath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

async function preloadStartupRoute() {
  if (typeof window === "undefined") return;

  const path = normalizeStartupPath(window.location.pathname);

  if (path === "/") {
    return;
  }

  if (path === "/products" || path === "/store.html" || path === "/products/catalog" || path.startsWith("/products/catalog/")) {
    await import("./pages/Store");
    return;
  }

  if (path === "/cart" || path === "/checkout" || path === "/products/cart" || path === "/products/checkout") {
    await import("./routes/CartRoute");
    return;
  }

  if (path === "/account" || path === "/account.html") {
    await import("./routes/AccountRoute");
    return;
  }

  if (path === "/contact" || path === "/contact.html") {
    await import("./pages/Contact");
    return;
  }

  if (path === "/terms" || path === "/terms.html") {
    await import("./pages/Terms");
    return;
  }

  if (path.startsWith("/products/")) {
    await import("./pages/ProductDetails");
  }
}

function shouldWarmStoreRoute() {
  if (typeof window === "undefined") return false;

  const isCoarsePointer =
    typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  const connection = navigator as Navigator & {
    connection?: {
      effectiveType?: string;
      saveData?: boolean;
    };
  };
  const connectionInfo = connection.connection;
  const slowConnection =
    Boolean(connectionInfo?.saveData) ||
    ["slow-2g", "2g", "3g"].includes(String(connectionInfo?.effectiveType || "").toLowerCase());

  return !isCoarsePointer && !slowConnection;
}

function warmCommonRoutes() {
  if (typeof window === "undefined") return;

  const path = normalizeStartupPath(window.location.pathname);
  if (path !== "/" || !shouldWarmStoreRoute()) return;

  const warmStoreRoute = () => {
    void import("./pages/Store").catch((error) => {
      console.error("Store route warmup failed", error);
    });
  };

  globalThis.setTimeout(warmStoreRoute, 4000);
}

function shouldHydratePrerenderedApp() {
  // Keep the prerendered shell visible and attach React to it instead of
  // clearing the page and remounting from scratch on first load.
  return true;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Missing root element');
}

const appTree = (
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);

const isPrerendered = rootElement.dataset.prerendered === "true";
const shouldHydratePrerendered = isPrerendered && shouldHydratePrerenderedApp();

function mountApp() {
  if (shouldHydratePrerendered) {
    hydrateRoot(rootElement, appTree);
    return;
  }

  createRoot(rootElement).render(appTree);
}

void cleanupLegacyServiceWorkers();
warmCommonRoutes();

if (isPrerendered) {
  void preloadStartupRoute()
    .catch((error) => {
      console.error("Startup route preload failed", error);
    })
    .finally(() => {
      mountApp();
    });
} else {
  void preloadStartupRoute().catch((error) => {
    console.error("Startup route preload failed", error);
  });

  mountApp();
}
