// Japky service worker (P7, decision G6): offline reading of pages already visited.
// Only public, static learning pages and build assets are cached. Never cached: /api, server actions (POST),
// personal pages (home, review, me, admin, chat, sign-in) and the live streak widget.
// Bump VERSION when the caching rules change; old caches are deleted on activate.
var VERSION = 'japky-v1';
var OFFLINE = '/offline.html';
var PUBLIC_PAGE = /^\/(vi|en)(\/(learn|kana|kanji|words|packs|speak|songs|tests|about|privacy|embed-code)(\/.*)?)?\/?$/;
var STATIC_ASSET = /^\/(_next\/static|strokes|pwa-icon)\/|^\/(ui-mode|embed-boot)\.js$/;

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return cache.addAll([OFFLINE, '/vi', '/en']);
    }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
    }),
  );
  self.clients.claim();
});

function cacheable(response) {
  return response && response.ok && response.type === 'basic' && !response.redirected;
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Build assets are immutable: cache first.
  if (STATIC_ASSET.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(function (hit) {
        return (
          hit ||
          fetch(req).then(function (res) {
            if (cacheable(res)) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
            return res;
          })
        );
      }),
    );
    return;
  }

  // Public learning pages (HTML and RSC payloads): network first, cached copy when offline.
  if (PUBLIC_PAGE.test(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          if (cacheable(res)) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            return hit || (req.mode === 'navigate' ? caches.match(OFFLINE) : Response.error());
          });
        }),
    );
    return;
  }

  // Anything else that is a page: network only, offline page as fallback.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(function () {
        return caches.match(OFFLINE);
      }),
    );
  }
});
