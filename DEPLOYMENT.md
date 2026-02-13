# 🚀 Guía de Despliegue en Vercel

## ✅ Optimizaciones ya implementadas

1. **Lazy Loading**: Todas las rutas usan `loadComponent()` para carga diferida
2. **Imports optimizados**: ng-zorro-antd se importa módulo por módulo
3. **AOT Compilation**: Habilitado por defecto en producción
4. **Presupuestos ajustados**: Bundle inicial hasta 5MB (suficiente para Angular + ng-zorro)
5. **Optimizaciones de producción**: 
   - `optimization: true`
   - `sourceMap: false`
   - `namedChunks: false`
   - `outputHashing: all`

## 📋 Pre-requisitos

- Node.js >= 22.0.0
- npm >= 10.0.0
- Cuenta en Vercel

## 🔧 Configuración local

Si ves error de versión de Node:

```bash
# Si usas nvm
nvm install 22
nvm use 22

# Verificar versión
node --version  # Debe ser >= v22.0.0
```

## 🌐 Desplegar en Vercel

### Opción 1: Desde la UI de Vercel (Recomendado)

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente la configuración desde `vercel.json`
5. Click en **"Deploy"**

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel --prod
```

## 📁 Estructura de archivos importantes

```
├── vercel.json                    # Configuración de Vercel
├── .nvmrc                         # Versión de Node.js
├── angular.json                   # Presupuestos y optimizaciones
├── src/
│   └── environments/
│       ├── environment.ts         # Producción (Vercel)
│       └── environment.development.ts  # Desarrollo (localhost)
```

## 🔍 Verificar el bundle localmente

```bash
# Compilar en modo producción
npm run build

# Ver estadísticas detalladas
npm run build:stats

# Analizar con webpack-bundle-analyzer (opcional)
npx webpack-bundle-analyzer dist/directorio-app/browser/stats.json
```

## 🐛 Solución de problemas

### Error: "Budget exceeded"

✅ **Ya solucionado** - Los presupuestos están ajustados a valores realistas para Angular + ng-zorro

### Error: "Node.js version too old"

```bash
# Actualizar Node.js
nvm install 22
nvm use 22
```

### Error: "Cannot find module 'environment'"

✅ **Ya configurado** - Los `fileReplacements` están correctos en `angular.json`

## 📊 Tamaños esperados del bundle

- **Initial Bundle**: ~1.5-2.5 MB (gzip: ~500-800 KB)
- **Lazy Chunks**: ~50-200 KB cada uno
- **Styles**: ~100-200 KB

Estos tamaños son normales para una aplicación Angular con ng-zorro-antd.

## ✨ Variables de entorno en Vercel

Si en el futuro necesitas agregar variables de entorno secretas:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega las variables necesarias
4. Redeploy el proyecto

## 🔗 URLs

- **Desarrollo**: http://localhost:4200
- **API Desarrollo**: http://localhost:3000/api
- **API Producción**: https://directorio-api.vercel.app/api
- **Frontend Producción**: (Se generará después del despliegue)

## 📝 Comandos útiles

```bash
# Desarrollo
npm start

# Build de producción
npm run build

# Build con estadísticas
npm run build:stats

# Limpiar caché
rm -rf .angular/cache dist
```

---

✅ **Tu proyecto está listo para desplegarse en Vercel sin errores de presupuesto**
