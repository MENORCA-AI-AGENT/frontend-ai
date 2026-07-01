# Comandos Frontend

## Instalacion

```bash
npm install
```

## Desarrollo web

```bash
npm run start -- --host 127.0.0.1 --port 8100
```

URL local:

```txt
http://127.0.0.1:8100
```

## Build web

```bash
npm run build
```

## Tests y lint

```bash
npm run lint
npm run test -- --watch=false --browsers=ChromeHeadless
```

## Capacitor

```bash
npm run build
npx cap sync
npx cap open android
npx cap open ios
```

## Android debug

```bash
cd android
./gradlew assembleDebug
```

## Playwright visual

```bash
npx playwright install chromium
npx playwright screenshot --viewport-size=375,812 http://127.0.0.1:8100/login output/playwright/login-mobile.png
npx playwright screenshot --viewport-size=1440,900 http://127.0.0.1:8100/login output/playwright/login-desktop.png
npx playwright screenshot --viewport-size=375,812 http://127.0.0.1:8100/home output/playwright/home-mobile.png
npx playwright screenshot --wait-for-timeout=1500 --viewport-size=1440,900 http://127.0.0.1:8100/home output/playwright/home-desktop.png
```

## Git sugerido

```bash
git checkout -b features/<nombre-tarea>
git add .
git commit -m "feat: <descripcion>"
git push -u origin features/<nombre-tarea>
```
