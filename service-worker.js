// Service Worker for AIFI CAM PWA
const CACHE_NAME = 'aifi-cam-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://unpkg.com/lucide@latest'
];

// 설치 이벤트 - 캐시 생성
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        self.skipWaiting(); // 즉시 활성화
      })
  );
});

// 활성화 이벤트 - 이전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // 즉시 제어권 획득
    })
  );
});

// Fetch 이벤트 - 캐시 우선, 네트워크 폴백
self.addEventListener('fetch', (event) => {
  // Chrome extension 관련 요청 무시
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시에서 반환
        if (response) {
          return response;
        }

        // 캐시에 없으면 네트워크 요청
        return fetch(event.request).then((response) => {
          // 유효한 응답이 아니면 그대로 반환
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 응답 복제 (캐시 저장용)
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              // GET 요청만 캐시
              if (event.request.method === 'GET') {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        });
      })
      .catch(() => {
        // 오프라인 폴백 페이지
        return new Response(
          `<!DOCTYPE html>
          <html lang="ko">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>AIFI CAM - Offline</title>
              <style>
                  body {
                      background: #181818;
                      color: #fff;
                      font-family: 'Segoe UI', sans-serif;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      margin: 0;
                  }
                  .offline-message {
                      text-align: center;
                      padding: 20px;
                  }
                  h1 { font-size: 2em; margin-bottom: 10px; }
                  p { opacity: 0.7; }
                  .retry-btn {
                      margin-top: 20px;
                      padding: 10px 20px;
                      background: #0078d4;
                      border: none;
                      border-radius: 4px;
                      color: white;
                      cursor: pointer;
                      font-size: 14px;
                  }
                  .retry-btn:hover { background: #006bb3; }
              </style>
          </head>
          <body>
              <div class="offline-message">
                  <h1>🔌 오프라인 모드</h1>
                  <p>인터넷 연결이 필요합니다.</p>
                  <p>연결 상태를 확인한 후 다시 시도해주세요.</p>
                  <button class="retry-btn" onclick="location.reload()">다시 시도</button>
              </div>
          </body>
          </html>`,
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      })
  );
});

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-recordings') {
    event.waitUntil(syncRecordings());
  }
});

async function syncRecordings() {
  // 나중에 클라우드 동기화 기능 구현 가능
  console.log('Syncing recordings...');
}

// 푸시 알림 (선택사항)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('AIFI CAM', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});