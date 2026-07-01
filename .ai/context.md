# Contexto Frontend

## Estado actual

- Login Google/Apple implementado.
- Supabase OAuth PKCE implementado.
- Login nativo Google/Apple preparado con Capgo Social Login y
  `signInWithIdToken`.
- Callback web y deep link nativo implementados.
- Android e iOS generados.
- Login y home redisenados con pantallas reales del MCP de Stitch
  `Menorca AI Travel Guide`.
- Login mobile ajustado para iPhone: marca serif, fondo fijo sin scroll y
  `Omitir registro` navegando a `/home`.
- Internacionalizacion runtime activa para Login/Home segun idioma del
  dispositivo: `es`, `en`, `ca`, fallback `es`.
- iOS corregido para Apple Sign in: bundle id
  `com.danny-armijos.menorca-ai-agent` y entitlement
  `com.apple.developer.applesignin`.
- Apple nativo ya devuelve `idToken` y Supabase acepta el `aud`
  `com.danny-armijos.menorca-ai-agent`.
- Documentacion tecnica en `/docs`.
- Tareas vivas en `/tasks`.
- Contexto operativo en `/.ai`.

## Pendiente inmediato

- Probar Google nativo en Android con los client IDs configurados.
- Firebase MCP no esta disponible en esta sesion; Firebase CLI si esta
  autenticada. `master-ia-83f09` tiene apps Android/iOS y el repo ya incluye
  `android/app/google-services.json` e
  `ios/App/App/GoogleService-Info.plist`.
- Android Firebase aun tiene `oauth_client: []`; el plugin usa el Web Client ID
  configurado en environments.
- iOS ya tiene `googleIosClientId` y `REVERSED_CLIENT_ID` configurados.
- iOS tambien tiene `GIDClientID` y `GIDServerClientID` en `Info.plist` para
  Google Sign-In nativo.
- Google nativo funciona sin nonce: se limpia la sesion previa de Google y se
  envia a Supabase solo provider/token con `signInWithIdToken`.
- Supabase Auth > Providers > Google tiene `Skip nonce checks` activo; login
  Google nativo iOS ya autentica correctamente en dispositivo fisico.
- `googleWebClientId` ya esta configurado con el cliente web
  `804358190687-071h3gve8rt605sc8m05igqrp0tdr5dg.apps.googleusercontent.com`.
- `googleIosClientId` ya esta configurado con el cliente iOS
  `804358190687-1jgo41tfqn5bvcsh7o1n6bt1nhn8kg5e.apps.googleusercontent.com`.
- SHA-1 debug Android confirmado en Firebase CLI:
  `66:D6:73:71:E5:C2:66:48:AF:61:39:A7:1C:25:0D:1E:F5:54:67:19`.
- Apple nativo validado en dispositivo: Supabase acepta el `aud`
  `com.danny-armijos.menorca-ai-agent`.
- Probar login nativo en dispositivo fisico Android.
- Confirmar Redirect URLs en Supabase.
- Integrar `BackendAuthService.getCurrentUser()` en home.
- Crear UI de eliminacion de cuenta.
- Implementar route guard.
- Empezar onboarding.
- Implementar modales de limite de peticiones.
- Integrar Stripe checkout.
- Conectar la home Stitch con clima/buses/lugares abiertos reales.
- Integrar chat/voz con backend.

## Bloqueadores conocidos

- `xcodebuild` iOS generic compila sin firma; Apple Sign in ya se valido en
  dispositivo fisico, pero falta firma de release.
- Falta firma nativa para release iOS.
- Falta confirmar Redirect URLs de Supabase Dashboard.
- Falta confirmar en Apple Developer que
  `com.danny-armijos.menorca-ai-agent` tiene Sign in with Apple activo y
  provisioning profile regenerado.
- Build web sin errores de presupuesto CSS tras ajustar `anyComponentStyle`.
- `npm audit` reporta vulnerabilidades pendientes.
- Las API keys compartidas en chat deben rotarse antes de produccion.

## Archivos clave

- `src/app/core/auth/auth.service.ts`
- `src/app/core/auth/backend-auth.service.ts`
- `src/app/auth/login/**`
- `src/app/auth/callback/**`
- `src/app/app.component.ts`
- `src/app/app.routes.ts`
- `capacitor.config.ts`
- `android/app/src/main/AndroidManifest.xml`
- `ios/App/App/Info.plist`
- `docs/**`
- `tasks/**`
- `.ai/**`
