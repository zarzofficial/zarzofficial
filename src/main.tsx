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
  let decodedPathname = pathname;

  try {
    decodedPathname = decodeURI(pathname);
  } catch {
    decodedPathname = pathname;
  }

  if (!decodedPathname || decodedPathname === "/") return "/";
  return decodedPathname.replace(/\/+$/, "") || "/";
}

async function preloadStartupRoute() {
  if (typeof window === "undefined") return;

  const path = normalizeStartupPath(window.location.pathname);

  if (path === "/") {
    return;
  }

  if (path === "/products" || path === "/store.html" || path === "/products/catalog" || path.startsWith("/products/catalog/")) {
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

  if (path.startsWith("/products/")) return;
}

function shouldHydratePrerenderedApp(root: HTMLElement) {
  // Keep the prerendered shell visible and attach React to it instead of
  // clearing the page and remounting from scratch when the route matches.
  // Static hosts may serve /index.html for unknown legacy URLs; hydrating
  // mismatched route markup forces React to regenerate the tree and logs #418.
  const prerenderRoute = root.dataset.prerenderRoute;
  if (prerenderRoute && normalizeStartupPath(prerenderRoute) !== normalizeStartupPath(window.location.pathname)) {
    return false;
  }

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
const shouldHydratePrerendered = isPrerendered && shouldHydratePrerenderedApp(rootElement);

function mountApp() {
  if (shouldHydratePrerendered) {
    hydrateRoot(rootElement, appTree);
    return;
  }

  createRoot(rootElement).render(appTree);
}

void cleanupLegacyServiceWorkers();

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
