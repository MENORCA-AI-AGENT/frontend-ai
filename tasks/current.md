# Current Frontend Tasks

## Qué se está desarrollando actualmente

- Documentacion tecnica del frontend en `/docs`.
- Registro vivo de tareas en `/tasks`.
- Contexto persistente para agentes en `/.ai`, actualizado con stack completo,
  Ionic, Supabase, Milvus/RAG via backend, Stripe, proveedores IA y politica de
  API keys.
- Flujo de autenticacion Supabase web con OAuth PKCE y mobile nativo con
  `@capgo/capacitor-social-login` + `signInWithIdToken`.
- Diseno de login y home actualizado desde el MCP de Stitch
  `Menorca AI Travel Guide` con tema `Balearic Horizon`.
- Google y Apple ya autentican correctamente con Supabase en dispositivo fisico
  iOS.
- Presupuesto CSS de Angular ajustado para permitir pantallas Stitch ricas sin
  romper el build de produccion.
- Login mobile ajustado para iPhone: fondo fijo sin scroll, marca `MENORCA LUXE`
  con tipografia premium y boton `Omitir registro` navegando a `/home`.
- Internacionalizacion priorizada implementada segun idioma del dispositivo en
  Login/Home con soporte `es`, `en`, `ca` y fallback a espanol.

## Qué falta por terminar

- Probar Google nativo en Android con los client IDs configurados.
- Regenerar archivos Firebase si se requiere que Android incluya OAuth metadata:
  - Android debe incluir `oauth_client`.
- Confirmar en Apple Developer que el App ID
  `com.danny-armijos.menorca-ai-agent` tiene activo Sign in with Apple y
  regenerar provisioning profile si hace falta.
- Confirmar en Supabase Auth > Providers > Apple que
  `com.danny-armijos.menorca-ai-agent` esta agregado en `Client IDs`.
- Confirmar Redirect URLs en Supabase para web/fallback:
  - `http://localhost:8100/auth/callback`
  - `com.menorca.aiagent://auth/callback`
  - `com.danny-armijos.menorca-ai-agent://auth/callback`
- Conectar los datos reales de clima, buses, restaurantes y supermercados a la
  Home ya redisenada desde Stitch.
- Integrar llamada real a `BackendAuthService.getCurrentUser()` despues del
  login.
- Crear UI para eliminacion de cuenta.

## Próximos pasos

1. Probar Google nativo en Android fisico con SHA-1 correcto.
2. Implementar route guard para proteger `/home`.
3. Mostrar perfil backend-safe desde `GET /api/auth/me`.
4. Crear flujo visual de borrar cuenta y cerrar sesion local.
5. Empezar onboarding responsive con la pantalla Stitch existente.
6. Conectar fuentes reales para clima, buses y lugares abiertos.

## Bloqueadores

- `xcodebuild` compila sin firma; Apple Sign in ya fue validado en dispositivo,
  pero falta configurar firma de release.
- Falta confirmar configuracion de redirect URLs en Supabase Dashboard.
- Falta configurar firma nativa para iOS/Android release.
- Firebase CLI verifico apps Android/iOS en `master-ia-83f09` y los archivos
  nativos ya estan integrados en el repo.
- `googleWebClientId` configurado con el cliente web
  `804358190687-071h3gve8rt605sc8m05igqrp0tdr5dg.apps.googleusercontent.com`.
- `googleIosClientId` configurado con el cliente iOS
  `804358190687-1jgo41tfqn5bvcsh7o1n6bt1nhn8kg5e.apps.googleusercontent.com`.
- `REVERSED_CLIENT_ID` agregado a `Info.plist`:
  `com.googleusercontent.apps.804358190687-1jgo41tfqn5bvcsh7o1n6bt1nhn8kg5e`.
- `GIDClientID` y `GIDServerClientID` agregados a `Info.plist` para resolver
  el crash iOS `No active configuration. Make sure GIDClientID is set`.
- Google nativo ahora funciona sin nonce: antes de pedir el `idToken` se limpia
  la sesion previa de Google y luego se llama `signInWithIdToken` solo con
  provider/token para evitar `Passed nonce and nonce in id_token should either
  both exist or not` y `Nonces mismatch`.
- Supabase Auth > Providers > Google tiene `Skip nonce checks` activo; login
  Google nativo iOS confirmado en dispositivo fisico.
- SHA-1 debug Android confirmado en Firebase CLI:
  `66:D6:73:71:E5:C2:66:48:AF:61:39:A7:1C:25:0D:1E:F5:54:67:19`.
- `google-services.json` aun tiene `oauth_client: []`; no bloquea el uso del
  Web Client ID en el plugin, pero conviene regenerarlo cuando Google/Firebase
  lo exponga.
- Apple nativo ya entrega `idToken` y Supabase acepta el `aud`
  `com.danny-armijos.menorca-ai-agent`; login Apple validado en dispositivo.
- Corregido error probable de Apple `AuthorizationError 1000`: bundle id iOS y
  entitlement de Sign in with Apple ya estan alineados en el proyecto.
- `SocialLogin.logLevel` queda apagado para no imprimir tokens nativos en
  consola.
- `npm run build` pasa sin errores de presupuesto CSS tras ajustar
  `anyComponentStyle`.
- `npm audit` reporta vulnerabilidades pendientes de revisar.

## Archivos afectados

- `README.md`
- `docs/architecture.md`
- `docs/api.md`
- `docs/decisions.md`
- `docs/conventions.md`
- `tasks/current.md`
- `tasks/backlog.md`
- `.ai/project.md`
- `.ai/rules.md`
- `.ai/context.md`
- `.ai/commands.md`
- `.ai/stack.md`
- `src/app/auth/**`
- `src/app/core/auth/**`
- `src/app/core/i18n/**`
- `src/app/home/**`
- `src/environments/**`
- `angular.json`
- `android/app/src/main/AndroidManifest.xml`
- `ios/App/App/Info.plist`
