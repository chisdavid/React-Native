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

In configuratia actuala din repo, binding-ul KV este deja completat in [wrangler.jsonc](d:/Iphone%20APP/server/wrangler.jsonc) pentru:

- `NOTIFICATION_KV`
- `id`
- `preview_id`

5. Genereaza cheile VAPID:

```bash
npx web-push generate-vapid-keys --json
```

6. Salveaza cheia privata si cheia publica ca secrete/variabile:

```bash
npx wrangler secret put VAPID_PRIVATE_KEY
npx wrangler secret put VAPID_PUBLIC_KEY
```

`VAPID_PRIVATE_KEY` ramane doar in Cloudflare ca secret.

`VAPID_PUBLIC_KEY` trebuie folosita in doua locuri:

- in Worker, pentru trimiterea request-urilor Web Push
- in frontend, ca `EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY`

7. Deploy:

```bash
npx wrangler deploy
```

8. In aplicatia Expo web seteaza:

- `EXPO_PUBLIC_NOTIFICATION_SERVER_URL=https://<worker-url>`
- `EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY=<cheia-publica-vapid>`

## Build automat din Git

Worker-ul de server poate fi conectat la repository pentru deploy automat la fiecare commit.

Configuratia folosita in Cloudflare Workers Build este:

- `Build command`: `npm run check`
- `Deploy command`: `npx wrangler deploy`
- `Non-production branch deploy command`: `npx wrangler versions upload`
- `Path`: `server`

Observatii importante:

- `Path` trebuie sa fie `server`, nu `/server`
- `npm run dev` nu este corect pentru pipeline, fiindca porneste modul local de dezvoltare
- dupa orice modificare in [wrangler.jsonc](d:/Iphone%20APP/server/wrangler.jsonc), trebuie facut commit si push ca sa fie folosita noua configuratie in Cloudflare

Fluxul complet este:

1. modifici fisierele din `server/`
2. faci commit si push
3. Cloudflare ruleaza `npm run check`
4. Cloudflare ruleaza `npx wrangler deploy`
5. Worker-ul este actualizat pe acelasi URL public, atat timp cat numele din `wrangler.jsonc` ramane neschimbat

## Variabile pentru frontend

In proiectul Cloudflare Pages al frontendului trebuie definite:

- `EXPO_PUBLIC_NOTIFICATION_SERVER_URL`
- `EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY`

Aceste variabile se configureaza in Pages, la `Settings` -> `Variables and Secrets`, apoi se face redeploy la frontend.

Exemplu:

```txt
EXPO_PUBLIC_NOTIFICATION_SERVER_URL=https://server.<subdomain>.workers.dev
EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY=<cheia-publica-vapid>
```

URL-ul `workers.dev` ramane stabil intre deploy-uri, cat timp numele Worker-ului ramane acelasi.

## Endpoints

- `GET /health`
- `GET /api/public/message`
- `POST /api/device/sync`
- `POST /api/device/test`

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

Body optional pentru `POST /api/device/test`:

```json
{
  "installationId": "uuid-local"
}
```

Comportament:

- daca trimiti `installationId`, Worker-ul incearca sa trimita imediat o notificare catre device-ul respectiv
- daca nu trimiti `installationId`, Worker-ul alege ultimul device activ sincronizat si incearca sa trimita imediat notificarea