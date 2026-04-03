# Ghid rapid: iPhone + deploy gratuit (TypeScript)

## 1) Ruleaza aplicatia pe iPhone fara backend

Aplicatia este facuta in React Native + Expo cu TypeScript si functioneaza local, fara server backend.

Comenzi:

1. `cd iphone-app`
2. `npm start`

Pe iPhone 13:

1. Instalezi aplicatia **Expo Go** din App Store (gratis).
2. Scanezi QR code-ul din terminal/browser.
3. Aplicatia se deschide pe telefon.

## 2) Build web deja generat pentru deploy gratuit

Folderul de deploy este:

- `dist/`

Acest folder este static (HTML + JS) si poate fi urcat pe:

- Cloudflare Pages (gratis)
- Netlify (gratis)
- Vercel (gratis)
- GitHub Pages (gratis)

## 3) Deploy exemplu pe Cloudflare Pages (gratuit)

1. Creezi cont gratuit Cloudflare.
2. In Pages alegi "Create project".
3. Upload direct folderul `dist`.
4. Primesti un URL public.
5. Deschizi URL-ul pe iPhone.

Nota importanta:

- Notificarile locale din pagina nu ruleaza fiabil in fundal.
- Pentru notificari cu aplicatia inchisa trebuie Web Push + service worker + backend mereu activ.
- Pe iPhone, Web Push functioneaza doar pentru un site instalat pe Home Screen ca PWA si cu permisiunea de notificari acceptata.

## 4) Backend de notificari pe Cloudflare

Exista acum un folder separat pentru backend:

- `../server`

Acest backend este un Cloudflare Worker care:

- salveaza ora, minutul, zilele si timezone-ul alese din aplicatie
- salveaza abonamentul Web Push al browserului
- ruleaza un cron in fiecare minut
- trimite notificarea chiar daca aplicatia web este inchisa

Variabile necesare in aplicatia web:

- `EXPO_PUBLIC_NOTIFICATION_SERVER_URL`
- `EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY`

Aceste variabile se configureaza in proiectul de frontend din Cloudflare Pages, la `Settings` -> `Variables and Secrets`.

Exemplu:

- `EXPO_PUBLIC_NOTIFICATION_SERVER_URL=https://server.<subdomain>.workers.dev`
- `EXPO_PUBLIC_NOTIFICATION_VAPID_PUBLIC_KEY=<cheia-publica-vapid>`

Dupa ce le adaugi, trebuie redeploy la frontend ca sa fie disponibile in build.

Deploy backend:

1. `cd ../server`
2. `npm install`
3. configurezi `wrangler.jsonc`
4. setezi secretele VAPID in Cloudflare
5. `npx wrangler deploy`

Deploy automat din Git pentru backend:

1. conectezi Worker-ul la repository
2. in `Build configuration` pui:
	- `Build command`: `npm run check`
	- `Deploy command`: `npx wrangler deploy`
	- `Non-production branch deploy command`: `npx wrangler versions upload`
	- `Path`: `server`
3. faci commit si push pentru orice schimbare din folderul `server`
4. Cloudflare face build si deploy automat

Atentie:

- `Path` trebuie sa fie `server`, nu `/server`
- daca schimbi `wrangler.jsonc` doar local, Cloudflare nu vede modificarile pana nu faci push
- domeniul Worker-ului ramane acelasi intre deploy-uri daca numele Worker-ului nu se schimba

## 5) Important pentru aplicatii iOS "native" instalate direct

Fara abonament Apple Developer (platit), varianta complet nativa instalata permanent pe telefon are limitari.

Optiuni gratuite reale:

- Testare in Expo Go (recomandat, gratis)
- Varianta web hostata gratis si deschisa pe iPhone
