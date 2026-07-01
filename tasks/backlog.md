# Frontend Backlog

## Mejoras futuras

- Implementar onboarding completo con imagenes y experiencia mobile-first.
- Crear guard de rutas para sesiones autenticadas/no autenticadas.
- Verificar `GET /api/auth/me` al entrar en home.
- Agregar pantalla de perfil.
- Agregar eliminacion de cuenta desde UI.
- Implementar cuotas guest/user/paid y modales de limite.
- Implementar flujo Stripe para comprar 20 peticiones.
- Crear home con clima, buses, restaurantes y supermercados abiertos.
- Implementar chat del agente turistico.
- Agregar entrada por voz y respuesta por voz.
- Implementar avisos/alarmas.
- Agregar ratings de lugares y del agente.
- Personalizar iconos y splash nativos.
- Agregar Playwright e2e versionado para flujos criticos.
- Extraer tokens visuales Stitch a estilos compartidos para reducir SCSS por
  pagina y resolver warnings de presupuesto CSS.

## Bugs encontrados

- Apple Sign in aun requiere validacion en dispositivo fisico con provisioning
  profile real.
- `npm audit` reporta vulnerabilidades pendientes.
- `npm run build` reporta warnings de presupuesto CSS en login/home.

## Refactors pendientes

- Crear modelos tipados para respuestas del backend.
- Mover configuracion publica a un provider tipado si crecen los environments.
- Crear componentes reutilizables para botones OAuth, estados vacios y modales.
- Separar UI auth de logica de navegacion si crece el flujo.
- Añadir capa de `api` compartida para fetch/error handling.
- Extraer `NativeSocialAuthService` si crecen las reglas de Google/Apple.

## Ideas para nuevas funcionalidades

- Modo invitado con contador visible de peticiones.
- Selector de preferencias turisticas durante onboarding.
- Favoritos de calas/restaurantes.
- Mapa de lugares recomendados.
- Recordatorios basados en buses/restauras.
- Modo offline para itinerarios guardados.
- Panel de consumo de peticiones restantes.
