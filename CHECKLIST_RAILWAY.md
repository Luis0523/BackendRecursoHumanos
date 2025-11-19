# ✅ Checklist de Despliegue a Railway

## 🎯 Pre-Despliegue (Ya Completado)

- [x] Firebase configurado para leer desde variable de entorno
- [x] CORS configurado para producción
- [x] `.gitignore` incluye archivos sensibles
- [x] `railway.json` configurado
- [x] Scripts de `package.json` correctos
- [x] Documentación creada
- [x] `.env.example` actualizado

---

## 📋 Checklist para Ti (Antes de Subir)

### 1. Preparación Local
- [ ] Hacer commit de todos los cambios
- [ ] Push al repositorio de GitHub
- [ ] Tener a mano el archivo `firebase-credentials.json`
- [ ] Tener a mano tu API Key de OpenAI

### 2. Crear Cuenta y Proyecto en Railway
- [ ] Crear cuenta en https://railway.app
- [ ] Crear nuevo proyecto
- [ ] Conectar con GitHub

### 3. Configurar Base de Datos MySQL
- [ ] Agregar servicio MySQL en Railway
- [ ] Copiar credenciales generadas:
  - [ ] DB_HOST
  - [ ] DB_USER
  - [ ] DB_PASSWORD
  - [ ] DB_NAME
  - [ ] DB_PORT

### 4. Configurar Variables de Entorno en Railway

#### Esenciales (OBLIGATORIAS):
- [ ] `DB_HOST` = *(del MySQL de Railway)*
- [ ] `DB_USER` = *(del MySQL de Railway)*
- [ ] `DB_PASSWORD` = *(del MySQL de Railway)*
- [ ] `DB_NAME` = *(del MySQL de Railway)*
- [ ] `DB_PORT` = *(del MySQL de Railway)*
- [ ] `PORT` = `5010`
- [ ] `NODE_ENV` = `production`
- [ ] `JWT_SECRET` = *(genera uno nuevo y seguro)*
- [ ] `JWT_EXPIRES_IN` = `24h`
- [ ] `FIREBASE_STORAGE_BUCKET` = `tu-proyecto.firebasestorage.app`
- [ ] `FIREBASE_CREDENTIALS` = *(pegar JSON completo)*
- [ ] `OPENAI_API_KEY` = `sk-proj-...`

#### Opcionales:
- [ ] `FRONTEND_URL` = *(URL de tu frontend en producción)*
- [ ] `MAX_FILE_SIZE` = `10485760`
- [ ] `ALLOWED_FILE_TYPES` = `application/pdf`

### 5. Despliegue
- [ ] Railway hace build automáticamente
- [ ] Esperar a que termine el deployment
- [ ] Copiar la URL generada (ej: `https://tu-proyecto.up.railway.app`)

### 6. Verificación Post-Despliegue
- [ ] Revisar logs en Railway - buscar:
  - [ ] `✓ Firebase Storage inicializado correctamente`
  - [ ] `Conexión a base de datos MySQL establecida`
  - [ ] `Servidor corriendo en puerto 5010`
- [ ] Probar endpoint de health: `GET /health`
- [ ] Probar registro de usuario: `POST /api/auth/registro`
- [ ] Probar login: `POST /api/auth/login`
- [ ] Probar subida de archivos (si es posible)

### 7. Actualizar Frontend
- [ ] Cambiar URL del API en el código del frontend
- [ ] De `http://localhost:5010/api` 
- [ ] A `https://tu-proyecto.up.railway.app/api`
- [ ] Hacer commit y push del frontend

---

## 🔥 Comandos Útiles

### Generar JWT Secret Seguro
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Ver contenido de Firebase Credentials
```bash
cat firebase-credentials.json
```

### Probar API después del deploy
```bash
# Health check
curl https://tu-proyecto.up.railway.app/health

# Registro
curl -X POST https://tu-proyecto.up.railway.app/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com","contraseña":"Pass123!","tipo_usuario":"candidato"}'
```

---

## 🚨 Recordatorios Importantes

1. **FIREBASE_CREDENTIALS debe ser el JSON completo en una línea**
   ```
   {"type":"service_account","project_id":"...","private_key":"..."}
   ```

2. **Genera un JWT_SECRET nuevo - NO uses el del ejemplo**

3. **El archivo firebase-credentials.json NO debe estar en GitHub**

4. **NODE_ENV=production es importante para CORS**

5. **Guarda la URL de Railway para usarla en el frontend**

---

## 📞 ¿Problemas?

Consulta:
- `RAILWAY_DEPLOY_GUIDE.md` - Guía detallada
- `RESUMEN_CONFIGURACION_RAILWAY.md` - Resumen de cambios
- Logs de Railway en la sección "Deployments"

---

**¡Éxito! 🎉**
