# API Frontend

Este documento describe las rutas, servicios, contratos y llamadas externas
actuales del frontend.

## Rutas Angular

### `/login`

Componente:

- `LoginPage`

Funcion:

- Muestra login con Google y Apple.
- Mantiene logos visibles de ambos proveedores.
- Inicia web OAuth o login nativo mediante `AuthService.signInWithProvider()`.

### `/auth/callback`

Componente:

- `AuthCallbackPage`

Funcion:

- Recibe callback OAuth web o deep link normalizado.
- Llama `AuthService.completeOAuthCallback(window.location.href)`.
- Navega a `/home` si el exchange fue correcto.
- Navega a `/login` si falla.

### `/home`

Componente:

- `HomePage`

Funcion:

- Muestra dashboard turistico inicial de maqueta con clima, buses,
  gastronomia, supermercados y recomendacion.
- Permite cerrar sesion con `AuthService.signOut()`.

## Servicios

### `AuthService`

Dependencias:

- `@supabase/supabase-js`
- `@capacitor/core`
- `@capgo/capacitor-social-login`
- Angular Signals
- `environment`

Responsabilidad:

- Crear cliente Supabase.
- Restaurar sesion.
- Mantener estado de auth.
- Iniciar OAuth web.
- Iniciar login nativo Google/Apple en dispositivo fisico.
- Entregar `idToken` nativo a Supabase con `signInWithIdToken`.
- Completar callback PKCE.
- Cerrar sesion.
- Exponer access token para backend.

Metodos publicos:

```ts
signInWithProvider(provider: 'google' | 'apple'): Promise<void>
completeOAuthCallback(callbackUrl: string): Promise<boolean>
signOut(): Promise<void>
getAccessToken(): string | null
```

Signals publicas:

```ts
session
user
loading
error
isAuthenticated
allowedProviders
```

### `BackendAuthService`

Dependencias:

- `AuthService`
- `environment.apiUrl`
- Fetch API

Responsabilidad:

- Llamar endpoints protegidos del backend con bearer token de Supabase.

Metodos:

```ts
getCurrentUser(): Promise<unknown>
deleteCurrentAccount(): Promise<unknown>
```

Endpoints consumidos:

```txt
GET    /api/auth/me
DELETE /api/auth/me
```

## Tipos

### `AuthProvider`

```ts
type AuthProvider = 'google' | 'apple';
```

### `AuthState`

```ts
interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

## Llamadas externas

### Supabase OAuth web

Web:

```ts
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:8100/auth/callback'
  }
});
```

### Login nativo con Supabase

```ts
const login = await SocialLogin.login({
  provider: 'google',
  options: {
    scopes: ['email', 'profile']
  }
});

await supabase.auth.signInWithIdToken({
  provider: 'google',
  token: login.result.idToken
});
```

Apple iOS:

```ts
const login = await SocialLogin.login({
  provider: 'apple',
  options: {
    scopes: ['email', 'name']
  }
});

await supabase.auth.signInWithIdToken({
  provider: 'apple',
  token: login.result.idToken
});
```

Callback:

```ts
await supabase.auth.exchangeCodeForSession(code);
```

Logout:

```ts
await supabase.auth.signOut();
```

### Backend auth

Request:

```http
GET /api/auth/me
Authorization: Bearer <supabase_access_token>
```

Respuesta esperada:

```json
{
  "id": "9e6f3f6d-8c2c-4f64-a69c-03d3bfb2d533",
  "email": "user@example.com",
  "roles": ["user"],
  "provider": "google"
}
```

Eliminacion de cuenta:

```http
DELETE /api/auth/me
Authorization: Bearer <supabase_access_token>
```

Respuesta esperada:

```json
{
  "deleted": true,
  "message": "Account deletion requested. The current access token may remain valid until it expires."
}
```

## Dependencias principales

- `@angular/core`, `@angular/router`
- `@ionic/angular`
- `@capacitor/core`
- `@capacitor/app`
- `@capacitor/android`
- `@capacitor/ios`
- `@capgo/capacitor-social-login`
- `@supabase/supabase-js`

## Ejemplos de uso interno

Login:

```ts
await authService.signInWithProvider('google');
```

Callback:

```ts
await authService.completeOAuthCallback(window.location.href);
```

Backend:

```ts
await backendAuthService.getCurrentUser();
```

Logout:

```ts
await authService.signOut();
```
