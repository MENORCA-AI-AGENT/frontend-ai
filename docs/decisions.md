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

### Login nativo en dispositivo fisico

En plataformas nativas se usa `@capgo/capacitor-social-login` para obtener el
`idToken` de Google o Apple y luego `supabase.auth.signInWithIdToken()`.

Motivo:

- Evita abrir `Capacitor Browser` para login movil.
- Mantiene Supabase Auth como autoridad de sesion.
- Permite probar una experiencia mas cercana a nativa en dispositivo fisico.

Limitaciones:

- Google requiere `googleWebClientId` y configuracion SHA-1 en Android.
- Los archivos Firebase nativos se versionan porque contienen configuracion
  publica de app y permiten que Android/iOS resuelvan integraciones nativas.
- Google nativo no envia `nonce` al SDK ni a Supabase. Decision: el SDK iOS
  puede devolver un claim `nonce` diferente al generado en Angular, provocando
  `Nonces mismatch`; para este flujo nativo se evita el nonce y se limpia la
  sesion previa de Google antes de solicitar un `idToken` nuevo.
- Supabase Auth > Providers > Google queda con `Skip nonce checks` activado.
  Decision: en iOS nativo no tenemos acceso fiable al nonce usado para emitir el
  `idToken`; Supabase documenta este ajuste como util para ese caso y ya fue
  validado en dispositivo fisico.
- Apple nativo se limita a iOS; Android requiere configuracion OAuth/Service ID.
- Apple requiere que el bundle id firmado coincida con el App ID registrado:
  `com.danny-armijos.menorca-ai-agent`, y que el target tenga el entitlement
  `com.apple.developer.applesignin`.
- Supabase tambien debe aceptar ese bundle como `Client ID` del provider Apple,
  porque valida el claim `aud` del `idToken` nativo.

### Deep links por plataforma

Se usan dos schemes por limitacion de plataforma:

```txt
iOS: com.danny-armijos.menorca-ai-agent://auth/callback
Android: com.menorca.aiagent://auth/callback
```

Decision: Android conserva `com.menorca.aiagent` porque el `applicationId` no
puede contener guiones; iOS usa el bundle exacto registrado en Apple Developer.

Estan configurados en:

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

### Stitch como referencia visual

El diseno actual toma tokens del proyecto Stitch `Menorca AI Travel Guide`:
tema `Balearic Horizon`, Montserrat/Inter, azul mediterraneo `#0077b6`,
superficies claras, acento terracota y cards de informacion turistica.

Decision: la implementacion visual de `LoginPage` y `HomePage` replica las
pantallas obtenidas desde el MCP de Stitch, no una interpretacion libre. Se
mantiene el avatar como accion de login/logout para conservar la prueba de
sesion sin introducir controles visibles ajenos al diseno aprobado.

Decision: el presupuesto `anyComponentStyle` de produccion sube a 12 KB warning
y 16 KB error. El limite anterior de 4 KB no era compatible con pantallas
Stitch ricas en layout, iconos CSS y responsive states; el nuevo limite conserva
control de tamano sin bloquear el diseno aprobado.

Decision: la pantalla de login desactiva el scroll de `ion-content` y elimina
movimiento de fondo. En iPhone esta vista debe sentirse como una entrada nativa
estatica; cualquier desplazamiento visual se reserva para pantallas de contenido
como Home. El boton `Omitir registro` navega a `/home` para activar el modo
guest con cuota limitada.

### Internacionalizacion runtime

La app usa `I18nService` con Angular Signals para detectar
`navigator.languages`, normalizar locales regionales (`en-US`, `ca-ES`,
`es-ES`) y seleccionar `es`, `en` o `ca`.

Decision: no se incorpora una dependencia externa ni Angular i18n compile-time
en este hito. La app movil necesita un unico bundle nativo que cambie textos
segun el idioma del dispositivo; una capa runtime tipada es suficiente para
Login/Home y deja abierta la posibilidad de agregar selector manual mas tarde.

Decision: el fallback es espanol porque es el idioma base del producto y el mas
seguro para la experiencia inicial en Menorca.

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
- Sustituir los datos de maqueta Stitch por clima, buses, restaurantes,
  supermercados y chat del agente conectados a servicios reales.
