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

- Varianta web hostata pe Cloudflare Pages nu poate garanta notificari zilnice locale in fundal pe iPhone.
- Cel mult poti afisa notificari de browser cat timp pagina ramane deschisa si browserul este activ.
- Pentru o notificare reala o data pe zi la ora setata de utilizator, ai nevoie de aplicatia rulata nativ prin Expo Go sau un build iOS.

## 4) Important pentru aplicatii iOS "native" instalate direct

Fara abonament Apple Developer (platit), varianta complet nativa instalata permanent pe telefon are limitari.

Optiuni gratuite reale:

- Testare in Expo Go (recomandat, gratis)
- Varianta web hostata gratis si deschisa pe iPhone
