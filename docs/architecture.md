# Arquitectura Frontend

## Arquitectura general

El frontend es una app Ionic/Angular standalone para Menorca AI Agent. Su primer
bloque funcional implementa autenticacion con Supabase Auth usando Google y
Apple, callback web y deep link nativo para Android/iOS.

La app sigue una organizacion por features y servicios compartidos:

```txt
src/app
  auth       Pantallas de login y callback OAuth
  core       Servicios reutilizables, estado y clientes
  home       Primera pantalla despues de login
```

```mermaid
flowchart TD
  Login["LoginPage"] --> AuthService["AuthService"]
  Callback["AuthCallbackPage"] --> AuthService
  Home["HomePage"] --> AuthService
  BackendAuth["BackendAuthService"] --> AuthService
  AuthService --> Supabase["Supabase Auth"]
  BackendAuth --> Backend["NestJS Backend /api"]
  AppComponent["AppComponent"] --> Router["Angular Router"]
  Native["Capacitor App appUrlOpen"] --> AppComponent
```

## Tecnologias utilizadas

- Angular 20 standalone components.
- Ionic Angular 8.
- Capacitor 8.
- Capacitor App para deep links.
- Capacitor Browser para abrir OAuth en navegador del sistema.
- Supabase JS SDK.
- Angular Signals (`signal`, `computed`) para estado de auth.
- Angular Router lazy routes.
- Karma/Jasmine para unit tests.
- ESLint para lint.
- Playwright CLI para validacion visual.
- Android Gradle project generado por Capacitor.
- iOS Xcode project generado por Capacitor.

## Lo que ya esta hecho

- Ruta `/login`.
- Ruta `/auth/callback`.
- Ruta `/home`.
- Login con Google.
- Login con Apple.
- Botones con logos visibles de Google y Apple.
- OAuth PKCE con Supabase.
- Callback web: `http://localhost:8100/auth/callback`.
- Callback nativo: `com.menorca.aiagent://auth/callback`.
- Deep link Android configurado en `AndroidManifest.xml`.
- URL Scheme iOS configurado en `Info.plist`.
- `AuthService` para session state, login, callback, logout y access token.
- `BackendAuthService` para llamar backend con bearer token.
- Home inicial con estado de sesion.
- README y pruebas.

## Flujo de datos

### OAuth web

```mermaid
sequenceDiagram
  participant U as Usuario
  participant F as Angular/Ionic
  participant S as Supabase Auth

  U->>F: Click Continuar con Google/Apple
  F->>S: signInWithOAuth(provider, redirectTo web)
  S-->>F: /auth/callback?code=...
  F->>S: exchangeCodeForSession(code)
  S-->>F: session
  F->>F: Navega a /home
```

### OAuth en dispositivo fisico

```mermaid
sequenceDiagram
  participant U as Usuario
  participant A as App Ionic
  participant B as Browser nativo
  participant S as Supabase Auth

  U->>A: Click Continuar con Google/Apple
  A->>S: signInWithOAuth(skipBrowserRedirect)
  S-->>A: URL OAuth
  A->>B: Browser.open(URL OAuth)
  B->>S: Login proveedor
  S-->>A: com.menorca.aiagent://auth/callback?code=...
  A->>A: appUrlOpen normaliza ruta
  A->>S: exchangeCodeForSession(code)
  A->>A: Guarda session y navega a /home
```

### Llamada protegida al backend

```mermaid
sequenceDiagram
  participant F as Frontend
  participant B as Backend NestJS
  participant S as Supabase Auth

  F->>F: AuthService.getAccessToken()
  F->>B: GET /api/auth/me con Bearer token
  B->>S: auth.getUser(token)
  S-->>B: Usuario validado
  B-->>F: Usuario normalizado
```

## Estructura de carpetas

```txt
src
  app
    app.component.ts
    app.routes.ts
    auth
      callback
        auth-callback.page.ts/html/scss/spec.ts
      login
        login.page.ts/html/scss/spec.ts
    core
      auth
        auth.service.ts
        auth.types.ts
        backend-auth.service.ts
    home
      home.page.ts/html/scss/spec.ts
  environments
    environment.ts
    environment.prod.ts
android
  app/src/main/AndroidManifest.xml
ios
  App/App/Info.plist
```

## Como se comunican los modulos

- `AppComponent` escucha `App.addListener('appUrlOpen')` para deep links.
- `AppComponent` convierte `com.menorca.aiagent://auth/callback?...` en ruta
  Angular `/auth/callback?...`.
- `AuthCallbackPage` llama `AuthService.completeOAuthCallback()`.
- `LoginPage` llama `AuthService.signInWithProvider('google' | 'apple')`.
- `HomePage` lee signals de `AuthService` y permite logout.
- `BackendAuthService` lee `AuthService.getAccessToken()` y llama al backend.

## Configuracion

Environment actual:

```ts
apiUrl: 'http://localhost:3000'
supabaseUrl: 'https://ocwakwtzliledabccvgc.supabase.co'
supabasePublishableKey: 'sb_publishable_...'
authRedirectUrl: 'http://localhost:8100/auth/callback'
nativeAuthRedirectUrl: 'com.menorca.aiagent://auth/callback'
allowedAuthProviders: ['google', 'apple']
```

Redirect URLs requeridas en Supabase:

```txt
http://localhost:8100/auth/callback
com.menorca.aiagent://auth/callback
```

## Tecnologias previstas pero aun no implementadas

- Onboarding completo.
- Home con clima, buses, restaurantes y supermercados.
- Chat del agente turistico.
- Voz con STT/TTS.
- Cuotas guest/user/paid.
- Stripe checkout.
- Ratings de lugares y agente.
- Alarmas/notificaciones.
