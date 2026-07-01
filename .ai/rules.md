# Reglas Frontend

## Reglas obligatorias

- Analizar el proyecto antes de hacer cambios.
- Mantener arquitectura Ionic/Angular standalone.
- Usar Angular Signals cuando sea adecuado para estado local.
- Mantener Google y Apple como unicos proveedores de login.
- Mantener logos visibles de Google y Apple en botones de login.
- No exponer service role keys, claves de IA, Stripe secret ni secretos.
- Si el usuario pega API keys en el chat, tratarlas como comprometidas y pedir
  rotacion; documentar solo nombres de variables.
- La publishable key de Supabase puede estar en frontend.
- Usar `AuthService` para OAuth y session.
- Usar servicios separados para llamadas backend.
- Actualizar README, `/docs`, `/tasks` y `/.ai` al cerrar tareas importantes.
- Ejecutar `npm run build`, `npm run lint` y tests tras cambios funcionales.
- Usar Playwright para validar UI responsive.
- Ejecutar `npx cap sync` tras cambios que afecten builds nativos.
- Mantener compatibilidad con backend Supabase Auth: enviar bearer token de
  Supabase a la API.

## UI/UX

- Mobile-first.
- Touch targets minimos de 44px.
- Respetar safe areas.
- No crear landing decorativa cuando se pide funcionalidad.
- Evitar textos de ayuda innecesarios dentro de la app final.
- No romper compatibilidad de aprobacion Apple/Google en login.
- Usar Playwright para revisar mobile y desktop cuando haya cambios visuales.

## Git

- Antes de commit/push preguntar destino si no fue indicado.
- Para features usar ramas `features/<nombre>`.
- No revertir cambios del usuario.
