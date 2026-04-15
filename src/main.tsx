import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './lib/AuthContext';
import { CartProvider } from './lib/CartContext';

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

void cleanupLegacyServiceWorkers();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Missing root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
