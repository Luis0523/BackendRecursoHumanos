# 🚂 Guía de Deploy en Railway

## Pasos para desplegar el backend en Railway

### 1. Preparación

Asegúrate de tener:
- ✅ Cuenta en [Railway.app](https://railway.app)
- ✅ Repositorio en GitHub con el código
- ✅ Credenciales de Firebase
- ✅ API Key de OpenAI (opcional)

### 2. Crear proyecto en Railway

1. Ve a [railway.app](https://railway.app) y haz login
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway para acceder a tu GitHub
5. Selecciona tu repositorio
6. Railway detectará automáticamente que es Node.js

### 3. Agregar MySQL

1. En tu proyecto, click en "New"
2. Selecciona "Database" → "MySQL"
3. Railway creará la base de datos automáticamente
4. Anota las credenciales que aparecen en "Variables"

### 4. Configurar Variables de Entorno

En la pestaña "Variables" de tu servicio backend, agrega:

**IMPORTANTE**: Copia las variables del servicio MySQL:
```
DB_HOST=${{MySQL.MYSQLHOST}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_PORT=${{MySQL.MYSQLPORT}}
```

**Variables adicionales** (agregar manualmente):
```
NODE_ENV=production
PORT=5010
JWT_SECRET=tu_clave_super_segura_cambiala_ahora_2024
JWT_EXPIRES_IN=24h
FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
OPENAI_API_KEY=sk-tu-api-key-de-openai
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf
```

### 5. Configurar Firebase

Necesitas subir las credenciales de Firebase:

**Opción A: Variable de entorno (recomendado)**
1. Abre tu archivo `firebase-credentials.json`
2. Copia TODO el contenido
3. En Railway, crea una variable llamada `FIREBASE_CREDENTIALS`
4. Pega el JSON completo como valor
5. Modifica tu código para leer desde esta variable

**Opción B: Incluir en el deploy**
- NO recomendado por seguridad
- Solo si modificas el .gitignore temporalmente

### 6. Deploy

1. Railway comenzará a hacer deploy automáticamente
2. Espera a que termine (puedes ver los logs en "Deployments")
3. Una vez completado, verás "Success" ✅
4. Railway te dará una URL pública

### 7. Verificar el Deploy

1. Copia la URL que te dio Railway (ej: `https://tu-app.railway.app`)
2. Abre en el navegador: `https://tu-app.railway.app/health`
3. Deberías ver:
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2024-..."
}
```

### 8. Actualizar Frontend

En tu frontend, actualiza la URL del API:

**Antes (local):**
```javascript
const API_URL = 'http://localhost:5010/api';
```

**Después (producción):**
```javascript
const API_URL = 'https://tu-app.railway.app/api';
```

O mejor aún, usa variables de entorno:
```javascript
const API_URL = process.env.API_URL || 'http://localhost:5010/api';
```

## 🔍 Troubleshooting

### Error: "Application failed to respond"
- ✅ Verifica que el `PORT` en variables sea correcto
- ✅ Asegura que `app.listen` use `0.0.0.0` como host
- ✅ Revisa los logs en "Deployments"

### Error de conexión a MySQL
- ✅ Verifica que las variables de MySQL estén correctas
- ✅ Usa las referencias `${{MySQL.VARIABLE}}` para conectar servicios
- ✅ Asegura que ambos servicios estén en el mismo proyecto

### Error de Firebase
- ✅ Verifica que `FIREBASE_STORAGE_BUCKET` esté configurado
- ✅ Asegura que las credenciales sean válidas
- ✅ Revisa permisos en Firebase Console

### Error de CORS
- ✅ Ya está configurado para permitir todos los orígenes en producción
- ✅ Verifica que `NODE_ENV=production` esté configurado
- ✅ No necesitas agregar tu dominio manualmente

## 📊 Monitoreo

Railway te permite ver:
- 📈 Logs en tiempo real
- 💻 Uso de recursos (CPU, RAM)
- 🔄 Historial de deployments
- ⚡ Métricas de respuesta

## 💰 Costos

- Railway tiene un plan gratuito con $5 de crédito mensual
- Suficiente para desarrollo y testing
- Para producción, considera el plan Hobby ($5/mes)

## 🔄 Redeploy

Railway hace redeploy automático cuando:
- Haces push a tu rama principal en GitHub
- Cambias variables de entorno
- Haces redeploy manual desde la interfaz

## 🎉 ¡Listo!

Tu backend ahora está en la nube y listo para recibir requests.

URL de ejemplo: `https://tu-proyecto-backend.railway.app`

### Next Steps:
1. ✅ Deploy del frontend (Vercel, Netlify, etc.)
2. ✅ Conectar frontend con backend
3. ✅ Configurar dominio personalizado (opcional)
4. ✅ Configurar monitoring y alertas

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Railway
2. Verifica las variables de entorno
3. Consulta la documentación de Railway: https://docs.railway.app

---

**Nota:** Recuerda NUNCA subir credenciales a GitHub. Usa siempre variables de entorno.
