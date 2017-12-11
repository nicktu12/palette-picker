/* eslint-disable no-undef */ 

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v4').then(cache => {
      return cache.addAll([
        '/',
        '/js/scripts.js',
        '/css/styles.css',
        '/assets/lock-2.svg'
      ]);
    })
  );
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

this.addEventListener('activate', event => {
  let cacheWhitelist = ['assets-v4'];

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
      .then(() => clients.claim())
  );
});
