# Guía de Pruebas: Firebase Storage con Postman

Esta guía te ayudará a probar los endpoints de Firebase Storage usando Postman.

---

## 🚀 Antes de Empezar

### 1. Verificar que el servidor esté corriendo
```bash
npm start
```

El servidor debería estar corriendo en: `http://localhost:5000`

### 2. Verificar configuración
Asegúrate de que:
- ✅ `firebase-credentials.json` está en la raíz del proyecto
- ✅ `.env` tiene configurado `FIREBASE_STORAGE_BUCKET=arco21.firebasestorage.app`
- ✅ El servidor inició sin errores de Firebase

---

## 📋 Endpoints Disponibles para Testing

### 1️⃣ **Obtener Información del Sistema**

**Endpoint:** `GET http://localhost:5000/api/test/info`

**Descripción:** Verifica la configuración de Firebase Storage

**Postman:**
1. Método: `GET`
2. URL: `http://localhost:5000/api/test/info`
3. Click en `Send`

**Respuesta Esperada:**
```json
{
  "success": true,
  "message": "Información del sistema de archivos",
  "data": {
    "bucket": "arco21.firebasestorage.app",
    "maxFileSize": "10.00 MB",
    "allowedTypes": "application/pdf",
    "configured": true
  }
}
```

---

### 2️⃣ **Subir UN Archivo PDF (Principal)**

**Endpoint:** `POST http://localhost:5000/api/test/upload`

**Descripción:** Sube un archivo PDF a Firebase Storage en la carpeta `test/`

**Postman - Paso a Paso:**

1. **Método:** `POST`
2. **URL:** `http://localhost:5000/api/test/upload`
3. **Headers:** No necesitas agregar nada (Postman agrega automáticamente `Content-Type: multipart/form-data`)
4. **Body:**
   - Selecciona la pestaña `Body`
   - Selecciona `form-data`
   - Agrega un campo:
     - **Key:** `file` (tipo: `File` - haz click en el dropdown a la derecha)
     - **Value:** Click en "Select Files" y elige un archivo PDF
5. Click en `Send`

**Respuesta Esperada:**
```json
{
  "success": true,
  "message": "Archivo PDF subido exitosamente a Firebase Storage",
  "data": {
    "fileName": "test/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf",
    "url": "https://storage.googleapis.com/arco21.firebasestorage.app/test/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf",
    "size": 125678,
    "sizeKB": "122.73 KB",
    "originalName": "mi-documento.pdf"
  }
}
```

**Guarda la URL y el fileName de la respuesta para las siguientes pruebas!**

---

### 3️⃣ **Subir MÚLTIPLES Archivos PDF**

**Endpoint:** `POST http://localhost:5000/api/test/upload-multiple`

**Descripción:** Sube hasta 5 archivos PDF a Firebase Storage

**Postman - Paso a Paso:**

1. **Método:** `POST`
2. **URL:** `http://localhost:5000/api/test/upload-multiple`
3. **Body:**
   - Selecciona `form-data`
   - Agrega un campo:
     - **Key:** `files` (tipo: `File`)
     - **Value:** Selecciona múltiples PDFs (puedes agregar el mismo campo varias veces o seleccionar múltiples archivos)
   - Puedes agregar hasta 5 archivos
4. Click en `Send`

**Respuesta Esperada:**
```json
{
  "success": true,
  "message": "3 archivo(s) subido(s) exitosamente",
  "data": {
    "files": [
      {
        "originalName": "doc1.pdf",
        "fileName": "test-multiple/uuid1.pdf",
        "url": "https://storage.googleapis.com/arco21.firebasestorage.app/test-multiple/uuid1.pdf",
        "size": 50000
      },
      {
        "originalName": "doc2.pdf",
        "fileName": "test-multiple/uuid2.pdf",
        "url": "https://storage.googleapis.com/arco21.firebasestorage.app/test-multiple/uuid2.pdf",
        "size": 75000
      },
      {
        "originalName": "doc3.pdf",
        "fileName": "test-multiple/uuid3.pdf",
        "url": "https://storage.googleapis.com/arco21.firebasestorage.app/test-multiple/uuid3.pdf",
        "size": 100000
      }
    ],
    "total": 3
  }
}
```

---

### 4️⃣ **Verificar si un Archivo Existe**

**Endpoint:** `GET http://localhost:5000/api/test/file-exists?fileName=test/uuid.pdf`

**Descripción:** Verifica si un archivo existe en Firebase Storage

**Postman - Paso a Paso:**

1. **Método:** `GET`
2. **URL:** `http://localhost:5000/api/test/file-exists`
3. **Params (Query):**
   - Key: `fileName`
   - Value: `test/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf` (usa el fileName que obtuviste en el paso 2)
4. Click en `Send`

**Respuesta Esperada (si existe):**
```json
{
  "success": true,
  "message": "Verificación completada",
  "data": {
    "fileName": "test/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf",
    "exists": true,
    "message": "El archivo existe"
  }
}
```

**Respuesta Esperada (si NO existe):**
```json
{
  "success": true,
  "message": "Verificación completada",
  "data": {
    "fileName": "test/archivo-inexistente.pdf",
    "exists": false,
    "message": "El archivo no existe"
  }
}
```

---

### 5️⃣ **Eliminar un Archivo**

**Endpoint:** `DELETE http://localhost:5000/api/test/delete-file`

**Descripción:** Elimina un archivo de Firebase Storage

**Postman - Paso a Paso:**

1. **Método:** `DELETE`
2. **URL:** `http://localhost:5000/api/test/delete-file`
3. **Body:**
   - Selecciona `raw`
   - Selecciona `JSON` (en el dropdown a la derecha)
   - Contenido:
     ```json
     {
       "fileName": "test/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf"
     }
     ```
4. Click en `Send`

**Respuesta Esperada:**
```json
{
  "success": true,
  "message": "Archivo eliminado exitosamente",
  "data": {
    "fileName": "test/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf",
    "deleted": true
  }
}
```

---

## 🎯 Flujo Completo de Prueba

### Test 1: Subir y Verificar
```
1. GET /api/test/info                    → Verificar configuración
2. POST /api/test/upload                 → Subir PDF (guardar fileName)
3. GET /api/test/file-exists?fileName=...→ Verificar que existe
4. Abrir la URL en el navegador          → Verificar que se puede descargar
```

### Test 2: Subir y Eliminar
```
1. POST /api/test/upload                 → Subir PDF (guardar fileName)
2. DELETE /api/test/delete-file          → Eliminar archivo
3. GET /api/test/file-exists?fileName=...→ Verificar que ya NO existe
```

### Test 3: Múltiples Archivos
```
1. POST /api/test/upload-multiple        → Subir 3-5 PDFs
2. Verificar cada URL en el navegador    → Todos deberían estar accesibles
```

---

## ⚠️ Posibles Errores y Soluciones

### Error: "No se pudo inicializar Firebase Storage"
**Causa:** `firebase-credentials.json` no existe o tiene formato incorrecto

**Solución:**
1. Verifica que `firebase-credentials.json` está en `/backend/`
2. Verifica que el archivo tiene formato JSON válido
3. Reinicia el servidor

---

### Error: "Solo se permiten archivos PDF"
**Causa:** El archivo no es un PDF o tiene MIME type incorrecto

**Solución:**
1. Verifica que el archivo tenga extensión `.pdf`
2. Usa un archivo PDF real, no un archivo renombrado

---

### Error: "El archivo excede el tamaño máximo permitido de 10MB"
**Causa:** El archivo es mayor a 10MB

**Solución:**
1. Usa un archivo más pequeño
2. O aumenta `MAX_FILE_SIZE` en `.env` (en bytes)

---

### Error: "No se proporcionó ningún archivo"
**Causa:** El campo en Postman no se llama `file` o no está configurado como `File`

**Solución:**
1. Verifica que el campo en Body > form-data se llame exactamente `file`
2. Verifica que el tipo sea `File` (no `Text`)

---

### Error 404: "Cannot GET /api/test/upload"
**Causa:** El servidor no está corriendo o la ruta no está registrada

**Solución:**
1. Reinicia el servidor con `npm start`
2. Verifica que veas el mensaje "✓ Firebase Storage inicializado correctamente" en la consola

---

## 🔍 Verificar en Firebase Console

Para ver los archivos subidos:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `arco21`
3. Ve a **Storage** en el menú lateral
4. Deberías ver las carpetas:
   - `test/` (archivos del endpoint `upload`)
   - `test-multiple/` (archivos del endpoint `upload-multiple`)

---

## 📝 Crear una Colección en Postman

Para facilitar las pruebas, puedes crear una colección:

1. En Postman, click en "New Collection"
2. Nombre: "Firebase Storage - Tests"
3. Agrega los 5 endpoints como requests dentro de la colección
4. Guarda variables de entorno:
   - `baseUrl`: `http://localhost:5000`
   - `fileName`: (actualizar después de cada upload)

---

## ✅ Checklist de Pruebas

- [ ] GET /api/test/info retorna la configuración correcta
- [ ] POST /api/test/upload sube un PDF exitosamente
- [ ] La URL del archivo subido es accesible desde el navegador
- [ ] GET /api/test/file-exists retorna `true` para un archivo existente
- [ ] GET /api/test/file-exists retorna `false` para un archivo inexistente
- [ ] DELETE /api/test/delete-file elimina el archivo correctamente
- [ ] POST /api/test/upload-multiple sube múltiples PDFs
- [ ] Los archivos aparecen en Firebase Console

---

## 🎉 Siguiente Paso

Una vez que las pruebas funcionen correctamente, puedes:

1. Implementar la subida de CVs en el módulo de candidatos
2. Implementar la generación y subida de reportes
3. Implementar la subida de documentos de verificación
4. Eliminar las rutas de prueba en producción

¡Éxito con las pruebas!
