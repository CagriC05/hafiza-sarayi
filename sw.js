// Çevrimdışı çalışma: uygulama kabuğunu önbelleğe al, ağ varsa tazele.
const AD = 'hafiza-sarayi-v2';
const DOSYALAR = [
  './', './index.html', './styles.css',
  './app.js', './store.js', './srs.js', './mufredat.js', './ilerleme.js', './eslestir.js',
  './manifest.json', './icons/icon-192.png', './icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(AD).then((c) => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((adlar) => Promise.all(adlar.filter((a) => a !== AD).map((a) => caches.delete(a))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((yanit) => {
        const kopya = yanit.clone();
        caches.open(AD).then((c) => c.put(e.request, kopya)).catch(() => {});
        return yanit;
      })
      .catch(() => caches.match(e.request).then((v) => v || caches.match('./index.html')))
  );
});
