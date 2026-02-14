# 🔧 Solución al Error CORS

## ❌ Problema
Tu API no permite peticiones desde el frontend desplegado en Vercel porque falta la configuración de CORS.

## ✅ Solución: Configurar CORS en el Backend

### Opción 1: CORS Permisivo (Desarrollo/Testing)

En tu archivo principal del backend (probablemente `server.ts` o `index.ts`), agrega:

```typescript
import cors from 'cors';
import express from 'express';

const app = express();

// Permitir todos los orígenes (solo para desarrollo)
app.use(cors());

// ... resto de tu código
```

### Opción 2: CORS Específico (Producción - Recomendado)

```typescript
import cors from 'cors';
import express from 'express';

const app = express();

// Lista blanca de orígenes permitidos
const allowedOrigins = [
  'http://localhost:4200',  // Desarrollo local
  'https://directorio-ot6aivn49-jesselizcbs-projects.vercel.app',  // Tu frontend en Vercel
  'https://tu-dominio-final.vercel.app'  // Dominio de producción
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (como Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'CORS policy: This origin is not allowed';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// ... resto de tu código
```

### Opción 3: Headers Manuales

Si no usas el paquete `cors`, agrega estos headers manualmente:

```typescript
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:4200',
    'https://directorio-ot6aivn49-jesselizcbs-projects.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

## 📦 Instalar dependencias (si usas Opción 1 o 2)

```bash
npm install cors
npm install --save-dev @types/cors
```

## 🔍 Verificar que funciona

Después de hacer los cambios y redesplegar tu API, verifica:

```bash
curl -I -H "Origin: https://directorio-ot6aivn49-jesselizcbs-projects.vercel.app" \
  https://directorio-api.vercel.app/api/divisions
```

Deberías ver en los headers:
```
Access-Control-Allow-Origin: https://directorio-ot6aivn49-jesselizcbs-projects.vercel.app
```

## 📝 Pasos a seguir:

1. ✅ Agrega la configuración CORS en tu backend
2. ✅ Commit y push los cambios
3. ✅ Espera a que Vercel redeploy tu API automáticamente
4. ✅ Recarga tu frontend

## 🎯 Dominio personalizado (Futuro)

Si configuras un dominio personalizado en Vercel, agrega también ese dominio a la lista de `allowedOrigins`.

## 🔐 Seguridad

**NUNCA uses** `app.use(cors())` sin restricciones en producción. Siempre especifica los orígenes permitidos.

---

**Nota**: Los cambios deben hacerse en el **BACKEND** (directorio-api), no en el frontend.
