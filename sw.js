self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("tukercrypto-cache").then((cache) => {
      return cache.addAll([
        "/index.html",
        "/assets/logo-192.png",
        "/assets/logo-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
