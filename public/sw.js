// Japky service worker (P7, decision G6): offline reading of pages already visited.
// Only public, static learning pages and build assets are cached. Never cached: /api, server actions (POST),
// personal pages (home, review, me, admin, chat, sign-in), public pages that stream per-user data
// (learn path progress, tests history: a shared device would show the previous user's data) and the live streak widget.
// Bump VERSION when the caching rules change; old caches are deleted on activate.
var VERSION = 'japky-v2';
var OFFLINE = '/offline.html';
var PUBLIC_PAGE = /^\/(vi|en)(\/(learn|kana|kanji|words|packs|speak|songs|tests|about|privacy|embed-code)(\/.*)?)?\/?$/;
var PER_USER_PAGE = /^\/(vi|en)\/(learn\/n5|tests|tests\/ai)\/?$/;
var STATIC_ASSET = /^\/(_next\/static|strokes|pwa-icon)\/|^\/(ui-mode|embed-boot)\.js$/;
var HASHED = /^\/_next\/static\//;
// shortcut: FIFO trim of hashed build files by count, not by build; fine while VERSION bumps clear the rest.
var MAX_HASHED = 300;

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

function put(req, res) {
  if (!cacheable(res)) return;
  var copy = res.clone();
  caches.open(VERSION).then(function (c) {
    return c.put(req, copy).then(function () {
      if (!HASHED.test(new URL(req.url).pathname)) return;
      return c.keys().then(function (keys) {
        var hashed = keys.filter(function (k) { return HASHED.test(new URL(k.url).pathname); });
        return Promise.all(hashed.slice(0, Math.max(0, hashed.length - MAX_HASHED)).map(function (k) { return c.delete(k); }));
      });
    });
  });
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Hashed build files are immutable: cache first. Unhashed files (strokes, icons, scripts): stale-while-revalidate.
  if (STATIC_ASSET.test(url.pathname)) {
    var refresh = function () {
      return fetch(req).then(function (res) { put(req, res); return res; });
    };
    event.respondWith(
      caches.match(req).then(function (hit) {
        if (!hit) return refresh();
        if (!HASHED.test(url.pathname)) event.waitUntil(refresh().catch(function () {}));
        return hit;
      }),
    );
    return;
  }

  // Public learning pages (HTML and RSC payloads): network first, cached copy when offline.
  if (PUBLIC_PAGE.test(url.pathname) && !PER_USER_PAGE.test(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          put(req, res);
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
