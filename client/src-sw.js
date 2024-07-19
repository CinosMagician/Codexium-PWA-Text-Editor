import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

// Precache files
precacheAndRoute(self.__WB_MANIFEST);

// Cache strategy for pages
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// Warm up cache with specified URLs
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Register route to cache navigation requests (HTML pages)
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Register route to cache CSS, JS, and Web Worker requests with a StaleWhileRevalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Register route to cache images with a CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        // Cache for 30 days
        maxAgeSeconds: 30 * 24 * 60 * 60, 
        // Only cache 60 images
        maxEntries: 60, 
      }),
    ],
  })
);

// Offline fallback
offlineFallback({
  pageFallback: '/offline.html',
  imageFallback: '/assets/images/fallback.png',
});