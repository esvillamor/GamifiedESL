const CACHE_NAME = 'presentation-pwa-v1';

// Files to cache for offline use
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './video.mp4' // Remove this line ONLY if your video file is very large (> 50MB)
];

// Install event: cache files
self.addEventListener('install', event => {
  self.skipWaiting(); // Forces the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached file if found
        if (response) {
          return response;
        }
        // Otherwise, pull it from the web
        return fetch(event.request);
      })
  );
});

// Activate event: clean up old caches if the version name changes
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all open pages immediately
});