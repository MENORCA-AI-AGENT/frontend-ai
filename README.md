# Menorca AI Agent Frontend

Ionic/Angular app for the Menorca travel assistant.

## Estado actual

- Login con Supabase Auth.
- Proveedores permitidos: Google y Apple.
- Botones de acceso con logotipos visibles de Google y Apple.
- Login nativo en dispositivo fisico con `@capgo/capacitor-social-login` y
  `supabase.auth.signInWithIdToken()`.
- Callback OAuth web y deep link nativo.
- Configuracion Capacitor con `appId: com.menorca.aiagent` para Android.
- Bundle iOS alineado con Apple Developer:
  `com.danny-armijos.menorca-ai-agent`.
- Plataformas nativas Android e iOS generadas.
- Deep links nativos configurados por plataforma.
- Login y home redisenados con las pantallas reales del MCP de Stitch:
  proyecto `Menorca AI Travel Guide`, tema `Balearic Horizon`.
- Login mobile sin scroll de fondo y con `Omitir registro` como entrada guest a
  `/home`.
- Internacionalizacion runtime segun idioma del dispositivo con soporte inicial
  `es`, `en` y `ca`, fallback a espanol.
- Home estilo Stitch con clima, buses, gastronomia, suministros, recomendacion,
  FAB del agente IA y navegacion inferior.
- Build, unit tests y validacion visual con Playwright.

## Documentacion tecnica

La documentacion viva del frontend esta en:

```txt
docs/architecture.md
docs/api.md
docs/decisions.md
docs/conventions.md
```

Estos archivos describen arquitectura, tecnologias, rutas, servicios, contratos,
decisiones, convenciones y mejoras futuras.

El estado operativo de tareas se mantiene en:

```txt
tasks/current.md
tasks/backlog.md
```

El contexto persistente para agentes de IA se mantiene en:

```txt
.ai/project.md
.ai/rules.md
.ai/context.md
.ai/commands.md
.ai/stack.md
```

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
nativeAuthRedirectUrl: 'com.danny-armijos.menorca-ai-agent://auth/callback'
googleWebClientId: '804358190687-071h3gve8rt605sc8m05igqrp0tdr5dg.apps.googleusercontent.com'
googleIosClientId: '804358190687-1jgo41tfqn5bvcsh7o1n6bt1nhn8kg5e.apps.googleusercontent.com'
appleClientId: 'com.danny-armijos.menorca-ai-agent'
appleRedirectUrl: 'https://ocwakwtzliledabccvgc.supabase.co/auth/v1/callback'
allowedAuthProviders: ['google', 'apple']
```

La publishable key de Supabase es publica y puede estar en frontend. No se deben
poner service role keys, claves de IA ni secretos de Stripe en Angular.

Los client IDs de Google/Apple son publicos, pero deben configurarse con los
valores reales de Google Cloud y Apple Developer antes de probar en dispositivo.

## Supabase Auth

En Supabase Dashboard, agrega estas Redirect URLs:

```txt
http://localhost:8100/auth/callback
com.menorca.aiagent://auth/callback
com.danny-armijos.menorca-ai-agent://auth/callback
```

Los proveedores activos esperados son:

```txt
Google
Apple
```

La app usa dos caminos:

- Web: `signInWithOAuth` y callback PKCE en `/auth/callback`.
- Dispositivo fisico: UI nativa del proveedor con
  `@capgo/capacitor-social-login`, obtencion de `idToken` y sesion Supabase con
  `signInWithIdToken`.
- Google nativo no envia `nonce` al SDK ni a Supabase. Antes del login se limpia
  la sesion previa del proveedor para evitar tokens antiguos con nonce y errores
  de GoTrue como `Nonces mismatch`.
- En Supabase Auth, el provider Google debe tener activado `Skip nonce checks`
  para aceptar el `idToken` nativo de iOS. Google y Apple ya autenticaron
  correctamente en dispositivo fisico iOS.

El plugin `@capacitor/browser` fue retirado del flujo nativo para evitar abrir
un navegador desde la app.

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

Los URL schemes nativos ya estan configurados en:

```txt
android/app/src/main/AndroidManifest.xml -> com.menorca.aiagent
ios/App/App/Info.plist -> com.danny-armijos.menorca-ai-agent
```

Despues prueba Google y Apple en un dispositivo real.

Para Google nativo:

- Firebase project: `master-ia-83f09`.
- Android Firebase app: `com.menorca.aiagent`, configurada en
  `android/app/google-services.json`.
- iOS Firebase app: `com.danny-armijos.menorca-ai-agent`, configurada en
  `ios/App/App/GoogleService-Info.plist`.
- Configura `googleWebClientId` con un OAuth Client ID de tipo Web.
- `googleIosClientId` esta configurado con el OAuth Client ID de tipo iOS.
- En Android agrega el SHA-1 del build instalado al OAuth client de Google y
  vuelve a descargar `google-services.json`.
- iOS incluye el `REVERSED_CLIENT_ID` como URL scheme en `Info.plist`.
- iOS incluye `GIDClientID` y `GIDServerClientID` en `Info.plist`; Google
  Sign-In los requiere para evitar el crash `No active configuration`.
- En Supabase Auth > Providers > Google, activa `Skip nonce checks`. Confirmado
  en dispositivo fisico iOS: con este ajuste Supabase crea/autentica el usuario
  correctamente.
- Si aparece `Passed nonce and nonce in id_token should either both exist or
  not` o `Nonces mismatch`, revisa que la build instalada incluya el flujo
  nativo sin nonce, que `Skip nonce checks` este activo en Supabase y que se
  haya eliminado/reinstalado la app en el dispositivo.
- Estado actual: Android Firebase aun no incluye `oauth_client`, pero el plugin
  usa el `googleWebClientId` configurado. iOS ya tiene `CLIENT_ID` y
  `REVERSED_CLIENT_ID`.
- SHA-1 debug actual para Android, confirmado en Firebase CLI:
  `66:D6:73:71:E5:C2:66:48:AF:61:39:A7:1C:25:0D:1E:F5:54:67:19`.
- Web Client ID actual:
  `804358190687-071h3gve8rt605sc8m05igqrp0tdr5dg.apps.googleusercontent.com`.
- iOS Client ID actual:
  `804358190687-1jgo41tfqn5bvcsh7o1n6bt1nhn8kg5e.apps.googleusercontent.com`.

Para Apple nativo:

- Activa Sign in with Apple en el App ID
  `com.danny-armijos.menorca-ai-agent`.
- En Supabase Auth > Providers > Apple, agrega
  `com.danny-armijos.menorca-ai-agent` en `Client IDs`.
- Revisa el equipo de firma en Xcode.
- El target iOS usa
  `PRODUCT_BUNDLE_IDENTIFIER=com.danny-armijos.menorca-ai-agent` y
  `App.entitlements` con `com.apple.developer.applesignin`.
- Si aparece `unacceptable audience in id_token`, Supabase no reconoce todavia
  el `aud` nativo. El `aud` esperado para iOS es
  `com.danny-armijos.menorca-ai-agent`.
- Si aparece `com.apple.AuthenticationServices.AuthorizationError error 1000`,
  revisa que el capability exista en Apple Developer y que la app instalada se
  haya firmado con ese provisioning profile.

Nota local: `xcodebuild` compila correctamente sin firma. La prueba final de
Apple Sign in debe hacerse en dispositivo fisico con provisioning profile del
Team `7JT7A8CDHH` y capability activo en Apple Developer.

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
npx playwright screenshot --viewport-size=375,812 http://127.0.0.1:8100/home output/playwright/home-mobile.png
npx playwright screenshot --wait-for-timeout=1500 --viewport-size=1440,900 http://127.0.0.1:8100/home output/playwright/home-desktop.png
```

## Verificacion realizada

```txt
npm run build
npx cap sync
npm run lint
npm run test -- --watch=false --browsers=ChromeHeadless
cd android && ./gradlew assembleDebug
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -destination 'generic/platform=iOS' CODE_SIGNING_ALLOWED=NO build
Playwright screenshot mobile 375x812
Playwright screenshot desktop 1440x900
Playwright snapshot /login
```

Resultado actual: build correcto, lint correcto, 5 tests unitarios pasando,
Android debug compilado, iOS generic build correcto sin firma y UI de
login/home validada con capturas mobile y desktop.

Nota de seguridad: `SocialLogin.logLevel` queda en `0` para evitar que tokens
nativos aparezcan en consola durante pruebas.

Nota: el presupuesto CSS de componentes se ajusto para el diseno Stitch actual;
`npm run build` queda sin errores de budget.
