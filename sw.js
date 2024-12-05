self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('pwa-cache').then((cache) => {
            return cache.addAll([
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
                'styles/tema/light.css'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
