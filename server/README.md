# Cloudflare notification server

Acest folder contine backend-ul pentru notificari remote.

Ce face:

- salveaza ora, minutul, zilele si timezone-ul pentru fiecare instalare
- salveaza abonamentul Web Push al browserului
- ruleaza un cron la fiecare minut in Cloudflare Workers
- trimite notificari chiar daca aplicatia web este inchisa

Limitari reale:

- pe iPhone functioneaza doar daca site-ul este instalat pe Home Screen ca PWA
- utilizatorul trebuie sa accepte permisiunea de notificari
- fara un build nativ iOS/Android nu poti folosi Expo Push pentru aplicatia web hostata pe Cloudflare Pages

## Deploy

1. Instaleaza dependintele:

```bash
cd server
npm install
```

2. Autentifica Wrangler:

```bash
npx wrangler login
```

3. Creeaza KV-ul:

```bash
npx wrangler kv namespace create NOTIFICATION_KV
npx wrangler kv namespace create NOTIFICATION_KV --preview
```

4. Pune ID-urile generate in `wrangler.jsonc`.

5. Genereaza cheile VAPID:

```bash
npx web-push generate-vapid-keys --json
```

6. Salveaza cheia privata si cheia publica ca secrete/variabile:

```bash
npx wrangler secret put VAPID_PRIVATE_KEY
npx wrangler secret put VAPID_PUBLIC_KEY
```

7. Deploy:

```bash
npx wrangler deploy
```

8. In aplicatia Expo web seteaza:

- `EXPO_PUBLIC_NOTIFICATION_SERVER_URL=https://<worker-url>`
- `EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY=<cheia-publica-vapid>`

## Endpoints

- `GET /health`
- `GET /api/public/message`
- `POST /api/device/sync`

Body pentru `POST /api/device/sync`:

```json
{
  "installationId": "uuid-local",
  "platform": "web",
  "appOrigin": "https://site.pages.dev",
  "schedule": {
    "hour": 7,
    "minute": 0,
    "days": [1, 2, 3, 4, 5],
    "timeZone": "Europe/Bucharest"
  },
  "subscription": {
    "endpoint": "...",
    "expirationTime": null,
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  },
  "pushEnabled": true
}
```