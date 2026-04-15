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

  if (path === "/" ) return;

  if (path === "/products" || path === "/store.html") {
    await import("./pages/Store");
    return;
  }

  if (path === "/cart" || path === "/checkout" || path === "/products/cart" || path === "/products/checkout") {
    await import("./pages/Cart");
    return;
  }

  if (path === "/account" || path === "/account.html") {
    await import("./pages/Account");
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

void cleanupLegacyServiceWorkers();

if (isPrerendered) {
  void preloadStartupRoute()
    .catch((error) => {
      console.error("Startup route preload failed", error);
    })
    .finally(() => {
      hydrateRoot(rootElement, appTree);
    });
} else {
  void preloadStartupRoute().catch((error) => {
    console.error("Startup route preload failed", error);
  });

  createRoot(rootElement).render(appTree);
}
