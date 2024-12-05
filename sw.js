const CACHE_NAME = 'pwa-cache-v2'; // Ganti versi jika ada update
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/404.html',
    '/login.html',
    '/logo.png',
    '/icon-192x192.png',
    '/icon-512x512.png',
    'scripts/setting.js',
    'scripts/select.js',
    'scripts/online.js',
    'scripts/tabel.js',
    'scripts/header.js',
    'scripts/tombol.js',
    'scripts/Fungsi.js',
    'styles/style.css',
    'styles/header.css',
    'styles/tabel.css',
    'styles/splas.css',
    'styles/tema/light.css',
    'styles/tema/dark.css',
];

// Install event - Cache semua resource
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((error) => {
                console.error('[Service Worker] Error during install:', error);
            })
    );
});

// Activate event - Hapus cache lama
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            console.log(`[Service Worker] Deleting old cache: ${cache}`);
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('[Service Worker] Error during activation:', error);
            })
    );
});

// Fetch event - Serve cached assets atau fallback ke network
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika ditemukan di cache, gunakan cache
                if (response) {
                    console.log('[Service Worker] Returning cached asset:', event.request.url);
                    return response;
                }

                // Jika tidak ditemukan, fetch dari network
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request).catch(() => {
                    // Jika gagal (misal offline), berikan fallback
                    if (event.request.mode === 'navigate') {
                        return caches.match('/404.html');
                    }
                });
            })
            .catch((error) => {
                console.error('[Service Worker] Fetch error:', error);
            })
    );
});
