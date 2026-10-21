// Service worker: guarda o app para funcionar offline.
// Ao alterar qualquer arquivo, aumente o número da versão abaixo.
const CACHE = 'led-ccd-v1';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Fontes do Google: usa o cache primeiro e guarda o que baixar.
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(r =>
      r || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }))));
    return;
  }
  // Arquivos do app: tenta a rede (para pegar atualizações) e cai no cache se estiver offline.
  e.respondWith(fetch(e.request).then(res => {
    const copia = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, copia));
    return res;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
