# Decisiones Frontend

## Decisiones importantes

### Ionic/Angular standalone

La app usa Angular standalone components y rutas lazy-loaded. Esto reduce
boilerplate de NgModules y mantiene cada pantalla autocontenida.

### Supabase Auth como proveedor de identidad

La autenticacion se delega en Supabase Auth. El frontend no maneja passwords ni
tokens propios. Solo conserva la session de Supabase y envia access tokens al
backend cuando necesita recursos protegidos.

### Solo Google y Apple

Los proveedores permitidos son `google` y `apple`. Se modelan como union type y
tambien existen en `environment.allowedAuthProviders`.

Motivos:

- Coincide con la configuracion del proyecto Supabase.
- Evita mostrar proveedores no aprobados.
- Facilita aprobacion de Apple manteniendo su boton visible.

### OAuth PKCE

El cliente Supabase se configura con:

```ts
flowType: 'pkce'
detectSessionInUrl: false
persistSession: true
autoRefreshToken: true
```

El callback se maneja explicitamente en `AuthCallbackPage`.

### Browser externo en dispositivo fisico

En plataformas nativas se usa `skipBrowserRedirect` y `Capacitor Browser`.

Motivo:

- Google y Apple funcionan mejor fuera del WebView.
- Permite volver por deep link.

### Deep link unico

Se usa:

```txt
com.menorca.aiagent://auth/callback
```

Esta configurado en:

- `android/app/src/main/AndroidManifest.xml`
- `ios/App/App/Info.plist`

### Estado con Angular Signals

`AuthService` usa `signal` y `computed` para exponer `session`, `user`,
`loading`, `error` e `isAuthenticated`.

Motivo:

- Estado simple y reactivo.
- Menos dependencia de Subjects/RxJS para una primera capa de auth.

### Servicios separados

- `AuthService`: Supabase session y OAuth.
- `BackendAuthService`: llamadas HTTP al backend con bearer token.

Motivo:

- Evita mezclar OAuth con contratos REST propios.
- Facilita probar y cambiar backend sin tocar OAuth.

### UI responsive y aprobacion de proveedores

La pagina de login mantiene los logos SVG de Google y Apple dentro de botones
grandes. Se validaron capturas mobile y desktop con Playwright.

## Patrones utilizados

- Standalone components.
- Lazy routes.
- Services con `providedIn: 'root'`.
- Signals para estado.
- Wrapper service para backend.
- Callback route para OAuth.
- Capacitor deep link listener en root component.
- Tests unitarios con mocks.

## Convenciones

- Las rutas viven en `app.routes.ts`.
- Las paginas usan carpeta propia con `.page.ts`, `.page.html`, `.page.scss`,
  `.page.spec.ts`.
- Servicios transversales viven en `src/app/core`.
- Providers OAuth se limitan por tipo y por environment.
- Las claves secretas no se guardan en frontend.
- La publishable key de Supabase es publica y puede vivir en `environment`.
- Los assets generados (`www`, `public`, builds nativos) quedan ignorados.

## Posibles mejoras futuras

- Agregar guard de rutas para redirigir usuarios no autenticados.
- Implementar pantalla de onboarding.
- Integrar `BackendAuthService.getCurrentUser()` en home para verificar backend.
- Crear flujo real de eliminacion de cuenta desde UI.
- Agregar modo offline/error states para OAuth.
- Añadir tests e2e de Playwright versionados.
- Personalizar iconos/splash nativos.
- Configurar firma iOS y Android release.
- Crear environments por staging/production.
- Agregar politica de privacidad y terminos antes de publicar con Apple.
- Conectar clima, buses, restaurantes, supermercados y chat del agente.
