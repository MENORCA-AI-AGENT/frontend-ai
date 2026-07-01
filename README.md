# Menorca AI Agent Frontend

Ionic/Angular app for the Menorca travel assistant.

## Estado actual

- Login con Supabase Auth.
- Proveedores permitidos: Google y Apple.
- Botones de acceso con logotipos visibles de Google y Apple.
- Callback OAuth web y deep link nativo.
- Configuracion Capacitor con `appId: com.menorca.aiagent`.
- Plataformas nativas Android e iOS generadas.
- Deep link `com.menorca.aiagent://auth/callback` configurado en Android e iOS.
- Home inicial con estado de sesion y cierre de sesion.
- Build, unit tests y validacion visual con Playwright.

## Configuracion

Los valores publicos de Supabase viven en:

```txt
src/environments/environment.ts
src/environments/environment.prod.ts
```

Variables principales:

```ts
apiUrl: 'http://localhost:3000'
supabaseUrl: 'https://ocwakwtzliledabccvgc.supabase.co'
supabasePublishableKey: 'sb_publishable_...'
authRedirectUrl: 'http://localhost:8100/auth/callback'
nativeAuthRedirectUrl: 'com.menorca.aiagent://auth/callback'
allowedAuthProviders: ['google', 'apple']
```

La publishable key de Supabase es publica y puede estar en frontend. No se deben
poner service role keys, claves de IA ni secretos de Stripe en Angular.

## Supabase Auth

En Supabase Dashboard, agrega estas Redirect URLs:

```txt
http://localhost:8100/auth/callback
com.menorca.aiagent://auth/callback
```

Los proveedores activos esperados son:

```txt
Google
Apple
```

La app usa `signInWithOAuth` y flujo PKCE. En dispositivo fisico abre el flujo
OAuth en el navegador del sistema y vuelve a la app por deep link.

## Dispositivo fisico

Pasos generales:

```bash
npm install
npm run build
npx cap sync
```

Android:

```bash
npx cap add android
npx cap open android
```

iOS:

```bash
npx cap add ios
npx cap open ios
```

El URL scheme nativo `com.menorca.aiagent` ya esta configurado en:

```txt
android/app/src/main/AndroidManifest.xml
ios/App/App/Info.plist
```

Despues prueba Google y Apple en un dispositivo real.

Nota local: la verificacion automatica con `xcodebuild` puede requerir Xcode y
CoreSimulator actualizados. En este entorno se detecto CoreSimulator
desactualizado, por lo que la prueba iOS debe completarse desde Xcode en el Mac
actualizado y con el equipo de firma seleccionado.

## Comandos

Servidor local:

```bash
npm run start -- --host 127.0.0.1 --port 8100
```

Build:

```bash
npm run build
```

Tests unitarios:

```bash
npm run test -- --watch=false --browsers=ChromeHeadless
```

Validacion visual con Playwright:

```bash
npx playwright install chromium
npx playwright screenshot --viewport-size=375,812 http://127.0.0.1:8100/login output/playwright/login-mobile.png
npx playwright screenshot --viewport-size=1440,900 http://127.0.0.1:8100/login output/playwright/login-desktop.png
```

## Verificacion realizada

```txt
npm run build
npx cap sync
npm run lint
npm run test -- --watch=false --browsers=ChromeHeadless
cd android && ./gradlew assembleDebug
Playwright screenshot mobile 375x812
Playwright screenshot desktop 1440x900
Playwright snapshot /login
```

Resultado actual: build correcto, lint correcto, 5 tests unitarios pasando,
Android debug compilado y UI de login validada sin errores de consola.
