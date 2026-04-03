self.notificationServerUrl = (() => {
    try {
        const currentUrl = new URL(self.location.href);
        return currentUrl.searchParams.get('serverUrl') || '';
    } catch {
        return '';
    }
})();

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    const fallbackNotification = {
        title: 'Mesaj de incurajare',
        body: 'Deschide aplicatia. Ai primit mesajul tau programat.',
    };

    const loadNotification = async () => {
        if (!self.notificationServerUrl) {
            return fallbackNotification;
        }

        try {
            const response = await fetch(`${self.notificationServerUrl}/api/public/message`);
            if (!response.ok) {
                return fallbackNotification;
            }

            const payload = await response.json();
            return {
                title: typeof payload.title === 'string' && payload.title ? payload.title : fallbackNotification.title,
                body: typeof payload.body === 'string' && payload.body ? payload.body : fallbackNotification.body,
            };
        } catch {
            return fallbackNotification;
        }
    };

    event.waitUntil(
        loadNotification().then(({ title, body }) => {
            return self.registration.showNotification(title, {
                body,
                icon: '/favicon.png',
                badge: '/favicon.png',
                data: {
                    url: '/',
                },
            });
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