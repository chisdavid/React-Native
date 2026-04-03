self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    const title = 'Mesaj de incurajare';
    const body = 'Deschide aplicatia. Ai primit mesajul tau programat.';

    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            icon: '/favicon.png',
            badge: '/favicon.png',
            data: {
                url: '/',
            },
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    return client.focus();
                }
            }

            if (self.clients.openWindow) {
                return self.clients.openWindow('/');
            }

            return undefined;
        })
    );
});