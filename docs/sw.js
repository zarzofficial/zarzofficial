const LEGACY_CACHE_PREFIXES = ["zarz-pwa"];

async function clearLegacyCaches() {
  const cacheKeys = await caches.keys();
  await Promise.all(
    cacheKeys
      .filter((cacheKey) => LEGACY_CACHE_PREFIXES.some((prefix) => cacheKey.startsWith(prefix)))
      .map((cacheKey) => caches.delete(cacheKey)),
  );
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await clearLegacyCaches();
      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      await Promise.all(clients.map((client) => client.navigate(client.url)));
    })(),
  );
});
