# Convenciones Frontend

## Convenciones de codigo

- Angular standalone components.
- Inyeccion con `inject()` en componentes y servicios.
- Estado local de auth con Signals.
- Rutas lazy-loaded.
- SCSS por pagina.
- Ionic components para UI movil.
- JSDoc en TypeScript explicando funcionalidad y decision tecnica.
- Tests unitarios por pagina/feature.

## Nombres

- Paginas: `*.page.ts`, `*.page.html`, `*.page.scss`, `*.page.spec.ts`.
- Servicios: `*.service.ts`.
- Tipos compartidos: `*.types.ts`.
- Rutas: `app.routes.ts`.
- Config nativa: `capacitor.config.ts`.

## Organizacion

```txt
src/app/auth
  login
  callback

src/app/core
  auth

src/app/home
```

Regla de organizacion:

- `auth`: pantallas y UI de autenticacion.
- `core`: servicios reutilizables y tipos.
- `home`: primera superficie funcional de la app.
- `android` e `ios`: proyectos nativos generados por Capacitor.

## Buenas practicas actuales

- Login limitado a Google y Apple.
- Botones con logotipos visibles de proveedores.
- Touch targets grandes en login.
- Layout mobile-first y responsive.
- Deep link nativo configurado.
- OAuth en browser del sistema para dispositivo fisico.
- No se exponen service role keys ni secretos.
- Tests unitarios para login, callback, home y app root.
- Validacion visual con Playwright.
- Android debug compila.

## Buenas practicas para nuevos recursos

- Usar servicios para llamadas HTTP y logica de negocio.
- Mantener componentes enfocados en estado visual/interaccion.
- Agregar tests por cada pagina o servicio nuevo.
- Verificar `npm run build`, `npm run lint` y tests antes de cerrar tareas.
- Usar Playwright para validar UI responsive.
- Mantener safe areas y touch targets en vistas moviles.
- No introducir texto explicativo innecesario dentro de la UI final.
- Evitar colocar secretos en `environment`.
- Ejecutar `npx cap sync` despues de cambios web que afecten app nativa.

## Tecnologias y estado actual

Tecnologias activas:

- Angular 20.
- Ionic Angular 8.
- Capacitor 8.
- Supabase JS.
- Android/iOS nativo via Capacitor.
- Karma/Jasmine.
- ESLint.
- Playwright para validacion visual.

Tecnologias del roadmap:

- Stripe Checkout.
- Notificaciones locales/remotas.
- Voz y transcripcion.
- Mapas o listados de lugares.
- Servicios de clima, buses y restaurantes.
- Chat tipo agente turistico.
