const CACHE_NAME = 'flex-cx-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/config.js',
  '/manifest.json',
  '/css/chat.css',
  '/css/auth.css',
  '/css/settings.css',
  '/css/responsive.css',
  '/css/animations.css',
  '/js/utils.js',
  '/js/storage.js',
  '/js/theme.js',
  '/js/voice.js',
  '/js/api.js',
  '/js/auth.js',
  '/js/history.js',
  '/js/image.js',
  '/js/chat.js',
  '/js/settings.js',
  '/pages/login.html',
  '/pages/register.html',
  '/pages/settings.html',
  '/pages/image-generator.html',
  '/pages/data-insights.html',
  '/pages/work-suggestions.html',
  '/pages/document-reader.html',
  '/pages/knowledge-base.html'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((res) => res || fetch(evt.request))
  );
});