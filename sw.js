// Define the cache name and assets to cache
const CACHE_NAME = 'my-cache-v1';
const ASSETS_TO_CACHE = [
    '/anime-universe/',
    '/anime-universe/index.html',
    '/anime-universe/styles.css',
    '/anime-universe/script.js',
    '/anime-universe/images/logo.png',
    '/anime-universe/offline.html' // Fallback page for offline access
];

// Install event - caching specified assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Pre-caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Fetch event - serve cached assets if available
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return cachedResponse;
                }
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request)
                    .catch(() => caches.match('/offline.html')); // Serve offline page if fetch fails
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
