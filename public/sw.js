// Service Worker Moon is a Girl — version légère.
// Rôle actuel : fonctionnement hors-ligne basique (cache des pages visitées).
// Rôle futur (Prompt 8) : réception de notifications push + affichage.

const VERSION = "v1";
const CACHE_PAGES = `moon-pages-${VERSION}`;
const CACHE_ASSETS = `moon-assets-${VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/login",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_PAGES).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cles) =>
      Promise.all(
        cles
          .filter((cle) => !cle.endsWith(VERSION))
          .map((cle) => caches.delete(cle))
      )
    )
  );
  self.clients.claim();
});

function estRequeteSamOrigin(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;
  if (!estRequeteSamOrigin(request)) return;

  const url = new URL(request.url);

  if (
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/data/")
  ) {
    return;
  }

  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((reponse) => {
          const copie = reponse.clone();
          caches.open(CACHE_PAGES).then((cache) => cache.put(request, copie));
          return reponse;
        })
        .catch(() =>
          caches.match(request).then((cache) => cache || caches.match("/"))
        )
    );
    return;
  }

  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cache) =>
          cache ||
          fetch(request).then((reponse) => {
            const copie = reponse.clone();
            caches
              .open(CACHE_ASSETS)
              .then((cacheStore) => cacheStore.put(request, copie));
            return reponse;
          })
      )
    );
  }
});
