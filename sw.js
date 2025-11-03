const CACHE='r';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([
    'index.html','styles.css','script.js',
    'js/jsnes.min.js','js/genplusgx.js','js/genplusgx.wasm',
    'js/neogeo.js','js/neogeo.wasm'
  ])));
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});