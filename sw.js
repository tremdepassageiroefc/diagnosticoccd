// Service worker: guarda o app e as fontes para funcionar off-line.
// Ao alterar qualquer arquivo, aumente o número da versão abaixo.
const CACHE = 'led-ccd-v3';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
const FONTES = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap';

async function guardarFontes(cache) {
  try {
    const res = await fetch(FONTES, { mode: 'cors' });
    if (!res.ok) return;
    const css = await res.clone().text();
    await cache.put(FONTES, res);
    const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]);
    await Promise.all(urls.map(u => fetch(u, { mode: 'cors' }).then(r => r.ok && cache.put(u, r)).catch(() => {})));
  } catch (_) { /* sem fontes: o app usa as fontes do sistema */ }
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(async c => {
    await c.addAll(ARQUIVOS);
    await guardarFontes(c);
  }).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Fontes: cache primeiro.
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(r =>
      r || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return;

  // Abertura do app: rede primeiro (pega atualizações), versão salva se estiver off-line.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(res => {
      const copia = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copia)); return res;
    }).catch(() => caches.match('./index.html', { ignoreSearch: true })));
    return;
  }

  // Demais arquivos: cache primeiro, atualizando em segundo plano.
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => {
    const rede = fetch(e.request).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
      return res;
    }).catch(() => r);
    return r || rede;
  }));
});
