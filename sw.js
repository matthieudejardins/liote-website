/* Lioté — Service Worker
 * Cache-first for static assets, network-first (with fallback) for HTML.
 * Bump CACHE_VERSION to invalidate all caches on deploy. */

const CACHE_VERSION = 'liote-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const HTML_CACHE = `${CACHE_VERSION}-html`;

const PRECACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/assets/fonts/cormorant.woff2',
  '/assets/fonts/inter.woff2',
  '/assets/fonts/montserrat.woff2',
  '/404.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests on same origin
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML: network-first with cache fallback
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(HTML_CACHE).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() =>
        caches.match(req).then((cached) => cached || caches.match('/404.html'))
      )
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Only cache successful, basic responses
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const copy = res.clone();
        caches.open(STATIC_CACHE).then((cache) => cache.put(req, copy));
        return res;
      });
    })
  );
});
