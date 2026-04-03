
const DEFAULT_MESSAGES = [
    'Hello, iubirea mea! Sa ai o zi la fel de minunata ca tine.',
    'Esti minunata exact asa cum esti. Nu uita asta niciodata.',
    'Ai un suflet superb si o energie care lumineaza totul.',
    'Un pas mic azi inseamna un progres mare maine. Sunt mandru de tine.',
    'Meriti tot ce e mai bun in lume. Curaj, poti orice!',
    'Te iubesc pentru cine esti, nu pentru ce faci. Esti incredibila.',
    'Respira adanc. Esti puternica, capabila si iubita.',
    'Orice provocare de azi poate fi depasita. Eu cred in tine.',
    'Ai grija de tine azi. Tu contezi enorm pentru mine.',
    'Hello, iubirea mea! Astazi stralucesti din nou!',
    "Fiecare zi e o noua oportunitate de a fi fericiti impreuna. Sa avem o zi minunata!",
    "Astazi e o zi perfecta pentru a-ti aminti cat de speciala esti pentru mine. Te iubesc!",
    'Astazi, sa ne bucuram de fiecare moment impreuna. Esti totul pentru mine!',
    'Fiecare clipa alaturi de tine este un dar. Te iubesc!',
    'Esti puternica, frumoasa si incredibila. Nu uita asta niciodata.',
    'Esti dulce, grijulie si plina de iubire. Sunt atat de norocos sa te am in viata mea.',
    'Te iubesc pentru tot ceea ce esti si pentru tot ceea ce faci. Esti minunata!',
    'Chiar si in zilele grele, lumina ta ramane speciala. Sunt cu tine.',
    'Ai incredere in tine. Ai depasit atatea si vei depasi si asta.',
    'Azi incepe cu tine, cu forta ta si cu frumusetea ta interioara.',
    'Nu trebuie sa fii perfecta. Pentru mine esti deja extraordinara.',
    'Esti motiv de zambet, de liniste si de recunostinta in viata mea.',
    'Fii blanda cu tine astazi. Meriti rabdare, iubire si pace.',
    'Tot ce faci conteaza. Efortul tau se vede si valoreaza enorm.',
    'In tine exista mai mult curaj decat simti si mai multa putere decat crezi.',
    'Azi iti amintesc doar atat: esti iubita, esti capabila si esti suficienta.',
    'Sa nu uiti ca fiecare pas mic pe care il faci construieste ceva frumos.',
    'Esti una dintre cele mai bune parti din viata mea. Te iubesc mult.',
    'Ziua asta are mai mult sens doar pentru ca existi tu in ea.'
];

const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_MESSAGES.length);
    return DEFAULT_MESSAGES[randomIndex];
};

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    const title = 'Mesaj';
    const body = getRandomMessage();

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