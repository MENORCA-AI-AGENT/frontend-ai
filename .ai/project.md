# Proyecto Frontend

## Resumen

Frontend Ionic/Angular para Menorca AI Agent, una app movil/web de agente
turistico de Menorca. El primer bloque funcional implementa login con Supabase
Auth usando Google y Apple, preparado para dispositivo fisico con Capacitor.

El producto completo sera una app de agente de viajes para Menorca con
onboarding, login opcional, cuotas de peticiones, home con clima/buses/lugares
abiertos, chat tipo ChatGPT, voz, alarmas, ratings y pago con Stripe.

## Objetivo del frontend

- Permitir login con Google y Apple.
- Mantener botones aprobables con logos visibles.
- Completar OAuth web y login nativo mobile mediante `idToken`.
- Persistir sesion Supabase.
- Enviar access token al backend.
- Preparar Android e iOS para pruebas fisicas.
- Evolucionar a onboarding, home turistica y chat del agente.
- Mostrar clima, buses, restaurantes y supermercados abiertos.
- Manejar limites de peticiones guest/user/paid.
- Integrar pagos Stripe desde UI.
- Permitir chat por texto y voz.
- Permitir eliminacion de cuenta.

## Estado funcional actual

- `/login`: login Google/Apple.
- `/auth/callback`: exchange PKCE.
- `/home`: dashboard turistico inicial de maqueta.
- Deep link iOS `com.danny-armijos.menorca-ai-agent://auth/callback`.
- Deep link Android `com.menorca.aiagent://auth/callback`.
- Android e iOS generados por Capacitor.
- Login nativo con `@capgo/capacitor-social-login` y Supabase
  `signInWithIdToken`.
- Diseno login/home basado en Stitch `Menorca AI Travel Guide`, tema
  `Balearic Horizon`.
- Tests unitarios y validacion visual con Playwright.

## Alcance funcional objetivo

- Invitado puede omitir login y hacer 2 peticiones.
- Luego debe autenticarse.
- Usuario autenticado tiene 3 peticiones mas, 5 gratis en total.
- Superado el limite, compra 20 peticiones por 5 EUR.
- Login solo con Google y Apple.
- Botones OAuth deben mantener logos oficiales visibles.
- App debe funcionar en dispositivo fisico con deep links.
- Agente debe mantenerse en rol turistico de Menorca.

## Repositorio

```txt
https://github.com/MENORCA-AI-AGENT/frontend-ai.git
```

Rama actual de trabajo:

```txt
features/frontend-supabase-auth-mobile
```
