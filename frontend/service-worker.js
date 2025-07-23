const CACHE_NAME = "my-pwa-cache-v1";
const urlsToCache = [
	"/",
	"/login",
	"/index.html",
	"/styles.css",
	"/scripts.js",
	"/public/manit_sm.png",
	"/manifest.json",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		new URL(event.request.url).origin !== self.location.origin
			? fetch(event.request)
			: caches.match(event.request).then((cachedResponse) => {
					return cachedResponse || fetch(event.request);
			  })
	);
});

self.addEventListener("activate", (event) => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (!cacheWhitelist.includes(cacheName)) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
