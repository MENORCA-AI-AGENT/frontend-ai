# Current Frontend Tasks

## Qué se está desarrollando actualmente

- Documentacion tecnica del frontend en `/docs`.
- Registro vivo de tareas en `/tasks`.
- Contexto persistente para agentes en `/.ai`, actualizado con stack completo,
  Ionic, Supabase, Milvus/RAG via backend, Stripe, proveedores IA y politica de
  API keys.
- Flujo de autenticacion Supabase mobile/web con Google y Apple ya implementado
  en la rama actual.

## Qué falta por terminar

- Probar login Google y Apple en dispositivo fisico real.
- Confirmar Redirect URLs en Supabase:
  - `http://localhost:8100/auth/callback`
  - `com.menorca.aiagent://auth/callback`
- Completar prueba iOS desde Xcode actualizado con equipo de firma.
- Integrar llamada real a `BackendAuthService.getCurrentUser()` despues del
  login.
- Crear UI para eliminacion de cuenta.

## Próximos pasos

1. Probar OAuth en Android fisico.
2. Probar OAuth en iOS fisico.
3. Implementar route guard para proteger `/home`.
4. Mostrar perfil backend-safe desde `GET /api/auth/me`.
5. Crear flujo visual de borrar cuenta y cerrar sesion local.
6. Empezar onboarding responsive.

## Bloqueadores

- En este Mac, `xcodebuild` aviso que CoreSimulator esta desactualizado.
- Falta confirmar configuracion de redirect URLs en Supabase Dashboard.
- Falta configurar firma nativa para iOS/Android release.
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
- `src/app/home/**`
- `src/environments/**`
- `android/app/src/main/AndroidManifest.xml`
- `ios/App/App/Info.plist`
