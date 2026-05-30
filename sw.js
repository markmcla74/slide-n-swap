const CACHE_NAME = 'slideswap-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './animal_templates.js',
  './puzzle_library_final.js'
];

// Cache core assets on install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Network-first fetch strategy for easy iterative testing
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
