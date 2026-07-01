# Stack Frontend

## Runtime local detectado

```txt
Node: 24.16.0
npm: 11.13.0
Docker: 29.4.0
Java: OpenJDK 21.0.10
Xcode: 26.6
```

Flutter no se usa en este frontend.

## Producto completo

```txt
Frontend: Ionic + Angular + Capacitor
Backend: NestJS monolitico modular
Auth: Supabase Auth
Base de datos principal: Supabase Postgres con RLS
Base vectorial/RAG: Milvus en backend
Pagos: Stripe
IA texto/orquestador: DeepSeek, Gemini, Groq via backend
Voz/STT/TTS previsto: OpenAI/speech services via backend
Clima: Open-Meteo via backend
Buses: TMSA Menorca via backend
Restaurantes/supermercados: fuente libre tipo OpenStreetMap/Overpass via backend
```

## Angular

```txt
Angular CLI: 20.3.28
Angular: 20.3.25
TypeScript: 5.9.3
RxJS: 7.8.2
zone.js: 0.15.1
```

## Ionic y Capacitor

```txt
@ionic/angular: ^8.0.0
@capacitor/core: 8.4.1
@capacitor/android: ^8.4.1
@capacitor/ios: ^8.4.1
@capacitor/app: 8.1.0
@capacitor/haptics: 8.0.2
@capacitor/keyboard: 8.0.5
@capacitor/status-bar: 8.0.2
@capgo/capacitor-social-login: ^8.3.30
```

## Auth

```txt
@supabase/supabase-js: ^2.110.0
Supabase project URL: https://ocwakwtzliledabccvgc.supabase.co
OAuth permitidos: google, apple
Deep link iOS: com.danny-armijos.menorca-ai-agent://auth/callback
Deep link Android: com.menorca.aiagent://auth/callback
Login nativo: provider idToken -> supabase.auth.signInWithIdToken
iOS bundle id: com.danny-armijos.menorca-ai-agent
Android application id: com.menorca.aiagent
iOS entitlement: com.apple.developer.applesignin
```

Variables frontend:

```ts
apiUrl
supabaseUrl
supabasePublishableKey
authRedirectUrl
nativeAuthRedirectUrl
googleWebClientId
googleIosClientId
appleClientId
appleRedirectUrl
allowedAuthProviders: ['google', 'apple']
```

## Supabase

```txt
Supabase Auth: login Google/Apple
Supabase project URL: https://ocwakwtzliledabccvgc.supabase.co
Publishable key: publica, puede vivir en environment
Service role: prohibida en frontend
Database/RLS: consumida indirectamente via backend o SDK cuando se habilite
```

## Firebase / Google Sign-In

```txt
Firebase project: master-ia-83f09
Android app: com.menorca.aiagent
iOS app: com.danny-armijos.menorca-ai-agent
Android config: android/app/google-services.json
iOS config: ios/App/App/GoogleService-Info.plist
OAuth Web Client ID: 804358190687-071h3gve8rt605sc8m05igqrp0tdr5dg.apps.googleusercontent.com
OAuth iOS Client ID: 804358190687-1jgo41tfqn5bvcsh7o1n6bt1nhn8kg5e.apps.googleusercontent.com
iOS reversed client ID: com.googleusercontent.apps.804358190687-1jgo41tfqn5bvcsh7o1n6bt1nhn8kg5e
iOS Info.plist Google keys: GIDClientID, GIDServerClientID
Google native nonce: disabled; Supabase Google provider has Skip nonce checks enabled for iOS native login
Android SHA-1 debug: 66:D6:73:71:E5:C2:66:48:AF:61:39:A7:1C:25:0D:1E:F5:54:67:19
```

Redirect URLs requeridas:

```txt
http://localhost:8100/auth/callback
com.menorca.aiagent://auth/callback
com.danny-armijos.menorca-ai-agent://auth/callback
```

## API keys

No guardar secretos en frontend.

Permitido:

```txt
Supabase publishable key
```

Prohibido:

```env
SUPABASE_SERVICE_ROLE_KEY
DEEPSEEK_API_KEY
GEMINI_API_KEY
GROQ_API_KEY
OPENAI_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

Las claves compartidas previamente en chat deben rotarse.

## RAG y datos

El frontend no se conecta directamente a Milvus. El RAG vive en backend.

```txt
Milvus: base vectorial backend
Supabase Postgres: datos relacionales backend/Supabase
Frontend: consume resultados por API REST
```

Datos que mostrara la app:

- Clima de Menorca por dia y franjas mañana/tarde/noche.
- Horarios de buses TMSA.
- Restaurantes abiertos.
- Supermercados abiertos.
- Calas, playas y lugares exoticos.

## Tests y calidad

```txt
Karma: ~6.4.0
Jasmine: ~5.1.0
ESLint: ^9.16.0
Playwright CLI: usado via npx para validacion visual
```

## Roadmap tecnologico

- Stripe Checkout.
- Notificaciones Capacitor.
- Voz/STT/TTS.
- Mapas/listas de lugares.
- Chat del agente turistico.
- Onboarding.
- Cuotas guest/user/paid.
- Ratings.
