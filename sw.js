// Service Worker — handles Web Push for order-day reminders.
// No fetch/caching handler on purpose (keeps the app always fresh).

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        data = { body: event.data ? event.data.text() : '' };
    }

    const title = data.title || '🔔 תזכורת הזמנות';
    const options = {
        body: data.body || 'יש הזמנות שצריך להגיש היום',
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        dir: 'rtl',
        lang: 'he',
        tag: 'order-reminder',
        renotify: true
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) return client.focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow('/');
        })
    );
});
