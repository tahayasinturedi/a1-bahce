const CACHE_NAME = "a1-bahce-v13";
const LOCAL_FILES = [
  "./",
  "index.html",
  "css/style.css",
  "js/words.js",
  "js/app.js",
  "assets/couple.jpg",
  "manifest.json",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(LOCAL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  /* Fontlar değişmez: önbellekten ver, arka planda tazele */
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        const update = fetch(event.request).then(response => {
          if (response && response.ok) cache.put(event.request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || update;
      })
    );
    return;
  }

  /* Kendi dosyalarımız: önce ağ (güncellemeler hemen gelsin), çevrimdışıysa önbellek */
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
  }
});
