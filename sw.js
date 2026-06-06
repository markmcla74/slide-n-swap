const CACHE_NAME = 'slideswap-v5'; // Bumped version to force phone cache update
const ASSETS = [
  './',
'./index.html',
'./style.css',
'./app.js',
'./animal_templates.js',
'./puzzle_library_final.js',
'./background-track.mp3' // <--- 1. CHANGE THIS to your exact background music filename/path!
];

// Cache core assets on install
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Forces the waiting service worker to become active immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Clean up old caches when upgrading versions
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Cache-First strategy with Network Fallback: Instant mobile loading
self.addEventListener('fetch', (e) => {
  // Skip handling non-HTTP/HTTPS protocols (like browser extensions or local testing bugs)
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // If the asset (like the music file) exists in local phone storage, serve it immediately!
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, go out to GitHub to grab it, then cache it for next time
      return fetch(e.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
