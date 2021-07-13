var CACHE_NAME = 'letmeaskapp';

var urlsToCache = [
    '/',
    '/static/js/2.9ab3b4b9.chunk.js',
    '/static/js/main.144fa653.chunk.js',
    '/favicon.ico'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});
