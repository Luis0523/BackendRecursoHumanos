# 🚂 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar el backend de la Plataforma de Recursos Humanos en Railway.

## 📋 Pre-requisitos

1. Cuenta en [Railway](https://railway.app)
2. Repositorio Git con el código
3. Archivo `firebase-credentials.json` (credenciales de Firebase)
4. API Key de OpenAI (para la funcionalidad de IA)
5. Base de datos MySQL (Railway puede proveerla)

## 🔧 Variables de Entorno Requeridas

Debes configurar las siguientes variables de entorno en Railway:

### 1. Base de Datos
```
DB_HOST=tu-mysql-host.railway.app
DB_USER=root
DB_PASSWORD=tu_password_generado
DB_NAME=railway
DB_PORT=3306
```

### 2. Servidor
```
PORT=5010
NODE_ENV=production
```

### 3. JWT (Autenticación)
```
JWT_SECRET=genera_una_clave_super_segura_y_aleatoria_aqui_2024
JWT_EXPIRES_IN=24h
```

### 4. Firebase Storage
```
FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
```

### 5. Firebase Credentials (IMPORTANTE)
```
FIREBASE_CREDENTIALS=
```
**Instrucciones para FIREBASE_CREDENTIALS:**
1. Abre tu archivo `firebase-credentials.json`
2. Copia **TODO** el contenido (debe ser un JSON completo)
3. Pégalo como el valor de `FIREBASE_CREDENTIALS`
4. Ejemplo del formato:
   ```json
   {"type":"service_account","project_id":"tu-proyecto","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"firebase-adminsdk@tu-proyecto.iam.gserviceaccount.com",...}
   ```

### 6. CORS (Opcional)
```
FRONTEND_URL=https://tu-frontend-en-vercel-o-netlify.app
```

### 7. Configuración de Archivos
```
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf
```

### 8. OpenAI (IA)
```
OPENAI_API_KEY=sk-proj-tu-api-key-de-openai-aqui
```

## 🚀 Pasos para Desplegar

### 1. Crear Nuevo Proyecto en Railway

1. Ve a [Railway](https://railway.app)
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio
5. Selecciona el repositorio del backend

### 2. Agregar Base de Datos MySQL

1. En tu proyecto de Railway, haz clic en "+ New"
2. Selecciona "Database"
3. Elige "MySQL"
4. Railway generará automáticamente las credenciales
5. Copia las variables de conexión (DB_HOST, DB_USER, DB_PASSWORD, etc.)

### 3. Configurar Variables de Entorno

1. Haz clic en tu servicio (backend)
2. Ve a la pestaña "Variables"
3. Agrega una por una todas las variables listadas arriba
4. **IMPORTANTE:** Para `FIREBASE_CREDENTIALS`, asegúrate de pegar el JSON completo en una sola línea

### 4. Configurar Start Command (Opcional)

Si Railway no detecta automáticamente el comando de inicio:

1. Ve a "Settings" de tu servicio
2. En "Start Command" pon: `node app.js`

### 5. Desplegar

1. Railway desplegará automáticamente tu aplicación
2. Espera a que termine el build y deployment
3. Railway te dará una URL pública (ej: `https://tu-proyecto.up.railway.app`)

## 🔍 Verificación del Despliegue

### 1. Revisar Logs
En Railway, ve a la pestaña "Deployments" y luego "View Logs" para verificar:
- ✅ `✓ Firebase Storage inicializado correctamente`
- ✅ `Conexión a base de datos MySQL establecida exitosamente`
- ✅ `Servidor corriendo en puerto XXXX`

### 2. Probar Endpoints

Prueba los siguientes endpoints desde Postman o tu navegador:

**Health Check:**
```
GET https://tu-proyecto.up.railway.app/health
```

**Registro de Usuario:**
```
POST https://tu-proyecto.up.railway.app/api/auth/registro
Content-Type: application/json

{
  "nombre": "Test User",
  "email": "test@example.com",
  "contraseña": "Password123!",
  "tipo_usuario": "candidato"
}
```

## ⚙️ Configuración Adicional

### Conectar Frontend al Backend en Producción

En tu frontend, actualiza la URL del API:

**Desarrollo:**
```javascript
const API_URL = 'http://localhost:5010/api';
```

**Producción:**
```javascript
const API_URL = 'https://tu-proyecto.up.railway.app/api';
```

O mejor aún, usa variables de entorno:
```javascript
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:5010/api';
```

## 🐛 Troubleshooting

### Error: "Cannot find module '../../firebase-credentials.json'"
- **Solución:** Asegúrate de haber configurado la variable `FIREBASE_CREDENTIALS` correctamente.

### Error: "CORS policy"
- **Solución:** Agrega la variable `FRONTEND_URL` con la URL de tu frontend en producción.

### Error: "Connection refused" en base de datos
- **Solución:** Verifica que las variables `DB_HOST`, `DB_USER`, `DB_PASSWORD` estén correctas.

### Error: "OpenAI API key invalid"
- **Solución:** Verifica que tu API key de OpenAI sea válida y esté correctamente configurada.

## 📚 Recursos Adicionales

- [Documentación de Railway](https://docs.railway.app/)
- [Railway MySQL Setup](https://docs.railway.app/databases/mysql)
- [Documentación de Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## 🔐 Seguridad

**IMPORTANTE:**
- ⚠️ NUNCA subas `firebase-credentials.json` a Git
- ⚠️ NUNCA expongas tu `JWT_SECRET` públicamente
- ⚠️ Usa variables de entorno para TODAS las credenciales sensibles
- ⚠️ El archivo `.gitignore` debe incluir `.env` y `firebase-credentials.json`

## ✅ Checklist Final

Antes de considerar el despliegue completo:

- [ ] Base de datos MySQL creada y conectada
- [ ] Todas las variables de entorno configuradas
- [ ] `FIREBASE_CREDENTIALS` configurado correctamente
- [ ] Logs muestran inicialización exitosa
- [ ] Health check endpoint responde
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Subida de archivos funciona
- [ ] Frontend conectado al backend en producción
- [ ] CORS configurado correctamente

---

**¿Problemas?** Revisa los logs en Railway o contacta al equipo de desarrollo.
