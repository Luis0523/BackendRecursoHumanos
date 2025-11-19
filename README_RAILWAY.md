# 🚂 Backend - Listo para Railway

## 📌 Resumen Rápido

El backend ya está **100% configurado** para despliegue en Railway. Se realizaron las siguientes modificaciones:

### ✅ Cambios Realizados:

1. **Firebase**: Ahora lee credenciales desde variable de entorno `FIREBASE_CREDENTIALS`
2. **CORS**: Configurado para aceptar cualquier origen en producción
3. **Documentación**: Guías completas de despliegue creadas

---

## 🎯 Pasos para Desplegar (Resumen)

### 1️⃣ En Railway:
- Crear proyecto nuevo
- Conectar repositorio GitHub
- Agregar MySQL database

### 2️⃣ Configurar Variables de Entorno:

**COPIAR ESTAS VARIABLES EN RAILWAY:**

```env
# Base de datos (copiar del MySQL de Railway)
DB_HOST=xxxx.railway.app
DB_USER=root
DB_PASSWORD=xxxx
DB_NAME=railway
DB_PORT=3306

# Servidor
PORT=5010
NODE_ENV=production

# Seguridad (IMPORTANTE: generar nuevo JWT_SECRET)
JWT_SECRET=<genera-uno-nuevo-seguro>
JWT_EXPIRES_IN=24h

# Firebase Storage
FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
FIREBASE_CREDENTIALS=<pegar-JSON-completo-de-firebase-credentials>

# IA
OPENAI_API_KEY=sk-proj-tu-api-key

# Opcional
FRONTEND_URL=https://tu-frontend.vercel.app
```

### 3️⃣ Deploy:
Railway despliega automáticamente → ¡Listo!

---

## 📚 Documentación Completa

- **`CHECKLIST_RAILWAY.md`** - Lista paso a paso con checkboxes
- **`RAILWAY_DEPLOY_GUIDE.md`** - Guía detallada completa
- **`RESUMEN_CONFIGURACION_RAILWAY.md`** - Cambios técnicos realizados
- **`.env.example`** - Ejemplo de todas las variables

---

## ⚡ Comandos Útiles

### Generar JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Ver Firebase Credentials:
```bash
cat firebase-credentials.json
```

### Probar API en producción:
```bash
curl https://tu-proyecto.up.railway.app/health
```

---

## 🚨 ¡IMPORTANTE!

### Para FIREBASE_CREDENTIALS:
1. Abrir `firebase-credentials.json`
2. Copiar **TODO** el contenido (JSON completo)
3. Pegarlo como valor de `FIREBASE_CREDENTIALS` en Railway
4. **Ejemplo del formato:**
   ```json
   {"type":"service_account","project_id":"tu-proyecto","private_key_id":"abc...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"firebase-adminsdk@..."}
   ```

### Generar nuevo JWT_SECRET:
**NO uses** el del `.env.example`. Genera uno nuevo con el comando de arriba.

---

## ✅ Verificación

Después del deploy, verifica en los logs:
```
✓ Firebase Storage inicializado correctamente
Conexión a base de datos MySQL establecida exitosamente  
Servidor corriendo en puerto 5010
```

---

## 🎉 ¡Eso es todo!

El backend está listo para Railway. Solo falta:
1. Subir a GitHub
2. Conectar con Railway
3. Configurar variables de entorno
4. Dejar que Railway haga el resto

**¡Mucha suerte con el despliegue! 🚀**
