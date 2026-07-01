# Contexto Frontend

## Estado actual

- Login Google/Apple implementado.
- Supabase OAuth PKCE implementado.
- Callback web y deep link nativo implementados.
- Android e iOS generados.
- Documentacion tecnica en `/docs`.
- Tareas vivas en `/tasks`.
- Contexto operativo en `/.ai`.

## Pendiente inmediato

- Probar OAuth en dispositivo fisico Android.
- Probar OAuth en dispositivo fisico iOS.
- Confirmar Redirect URLs en Supabase.
- Integrar `BackendAuthService.getCurrentUser()` en home.
- Crear UI de eliminacion de cuenta.
- Implementar route guard.
- Empezar onboarding.
- Implementar modales de limite de peticiones.
- Integrar Stripe checkout.
- Construir home turistica con clima/buses/lugares abiertos.
- Integrar chat/voz con backend.

## Bloqueadores conocidos

- CoreSimulator desactualizado en este Mac impidio completar `xcodebuild`.
- Falta firma nativa para pruebas/release iOS.
- Falta confirmar Redirect URLs de Supabase Dashboard.
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
