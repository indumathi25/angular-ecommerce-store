const CACHE_NAME = 'demo/v1';

const CACHE_FILES = ['./main.js', './polyfills.js', './runtime.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_FILES);
    })
  );
});

self.addEventListener('activate', (e) => {
  // Clean up useless cache
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // Keep only the current cache version
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
    })
  );
});

// This will be triggered every time app requests a file from server
self.addEventListener('fetch', (e) => {
  // Offline exprience
  // Whenever a file is requested,
  // 1. fetch from network, update my cache 2. cache as a fallback

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // update my cache
        const cloneData = res.clone();
        // We can apply different caching strategies here based on file type
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, cloneData);
        });
        // Uncomment for debugging: console.log('Network:', e.request.url);
        return res;
      })
      .catch(() => {
        // Uncomment for debugging: console.log('Cache:', e.request.url);
        return caches.match(e.request).then((file) => {
          if (file) {
            return file;
          }

          // For navigation requests (HTML pages/routes), serve index.html
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html').then((indexFile) => {
              return indexFile || new Response('Offline', { status: 503 });
            });
          }

          return new Response('Offline - Resource not found', {
            status: 404,
            statusText: 'Not Found',
          });
        });
      })
  );
});
