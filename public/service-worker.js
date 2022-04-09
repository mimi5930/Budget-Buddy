// cache names
const APP_PREFIX = 'BudgetBuddy-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// paths to files
const FILES_TO_CACHE = [
  './index.html',
  './css/styles.css',
  './js/idb.js',
  './js/index.js',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// run if page installed service-worker
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('installing cache : ' + CACHE_NAME);

      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // find only this cache
    caches.keys().then(keyList => {
      let cacheKeepList = keyList.filter(key => {
        return key.indexOf(APP_PREFIX);
      });

      // add current cache
      cacheKeepList.push(CACHE_NAME);

      // delete old versions
      return Promise.all(
        keyList.map((key, i) => {
          if (cacheKeepList.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i]);

            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
