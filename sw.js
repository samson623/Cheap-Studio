/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Cheap Studio - Service Worker
 * Provides caching strategies for optimal performance
 */

const CACHE_NAME = 'cheap-studio-v1.0.0';
const STATIC_CACHE_NAME = 'cheap-studio-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'cheap-studio-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/manifest.json'
];

// Assets to cache on first request
const DYNAMIC_ASSETS = [
  // Add any dynamic assets here
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first, then network (for static assets)
  CACHE_FIRST: 'cache-first',
  // Network first, then cache (for dynamic content)
  NETWORK_FIRST: 'network-first',
  // Cache only (for offline-first assets)
  CACHE_ONLY: 'cache-only',
  // Network only (for always-fresh content)
  NETWORK_ONLY: 'network-only'
};

// ==========================================================================
// Service Worker Installation
// ==========================================================================

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// ==========================================================================
// Service Worker Activation
// ==========================================================================

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('cheap-studio-')) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Service Worker: Activation failed', error);
      })
  );
});

// ==========================================================================
// Fetch Event Handler
// ==========================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (unless specifically handled)
  if (url.origin !== location.origin) {
    return;
  }

  // Determine cache strategy based on request
  const strategy = getCacheStrategy(request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// ==========================================================================
// Cache Strategy Determination
// ==========================================================================

function getCacheStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Static assets (CSS, JS, images)
  if (pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$/)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }

  // HTML pages
  if (pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }

  // API calls (if any)
  if (pathname.startsWith('/api/')) {
    return CACHE_STRATEGIES.NETWORK_ONLY;
  }

  // Default to network first
  return CACHE_STRATEGIES.NETWORK_FIRST;
}

// ==========================================================================
// Request Handlers
// ==========================================================================

async function handleRequest(request, strategy) {
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return handleCacheFirst(request);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return handleNetworkFirst(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return handleCacheOnly(request);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return handleNetworkOnly(request);
    
    default:
      return handleNetworkFirst(request);
  }
}

// Cache first strategy
async function handleCacheFirst(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    
    // Try to return cached version as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or error response
    return createErrorResponse();
  }
}

// Network first strategy
async function handleNetworkFirst(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Network first strategy failed:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or error response
    return createErrorResponse();
  }
}

// Cache only strategy
async function handleCacheOnly(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || createErrorResponse();
}

// Network only strategy
async function handleNetworkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Network only strategy failed:', error);
    return createErrorResponse();
  }
}

// ==========================================================================
// Utility Functions
// ==========================================================================

function createErrorResponse() {
  return new Response(
    JSON.stringify({
      error: 'Resource not available offline',
      message: 'This resource requires an internet connection.'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

// ==========================================================================
// Background Sync (for future enhancement)
// ==========================================================================

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      handleBackgroundSync()
    );
  }
});

async function handleBackgroundSync() {
  try {
    // Implement background sync logic here
    // For example: sync offline form submissions, update cache, etc.
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// ==========================================================================
// Push Notifications (for future enhancement)
// ==========================================================================

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: data.tag || 'default',
        requireInteraction: data.requireInteraction || false,
        actions: data.actions || []
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// ==========================================================================
// Cache Management
// ==========================================================================

// Periodic cache cleanup
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(cleanupCache());
  }
});

async function cleanupCache() {
  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      if (cacheName.startsWith('cheap-studio-')) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        // Remove old entries (older than 7 days)
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        for (const request of requests) {
          const response = await cache.match(request);
          const dateHeader = response.headers.get('date');
          
          if (dateHeader) {
            const responseDate = new Date(dateHeader).getTime();
            if (responseDate < oneWeekAgo) {
              await cache.delete(request);
            }
          }
        }
      }
    }
    
    console.log('Cache cleanup completed');
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
}

// ==========================================================================
// Performance Monitoring
// ==========================================================================

// Monitor cache hit rates
let cacheHits = 0;
let cacheMisses = 0;

function trackCachePerformance(hit) {
  if (hit) {
    cacheHits++;
  } else {
    cacheMisses++;
  }
  
  // Log performance metrics periodically
  if ((cacheHits + cacheMisses) % 100 === 0) {
    const hitRate = (cacheHits / (cacheHits + cacheMisses)) * 100;
    console.log(`Cache hit rate: ${hitRate.toFixed(2)}%`);
  }
}