# Configuración de Firebase Storage

Este documento explica cómo configurar Firebase Storage para el manejo de archivos PDF (CVs, reportes, documentos) en la Plataforma de Gestión de Talento Humano.

## 📋 Requisitos Previos

1. Cuenta de Google/Firebase
2. Proyecto creado en Firebase Console

---

## 🚀 Paso 1: Configurar Firebase Console

### 1.1 Crear/Acceder al Proyecto
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID** (ejemplo: `plataforma-rrhh-2024`)

### 1.2 Activar Firebase Storage
1. En el menú lateral, selecciona **"Storage"** (Almacenamiento)
2. Haz clic en **"Comenzar"** o **"Get Started"**
3. Acepta las reglas de seguridad predeterminadas (las modificaremos después)
4. Selecciona una ubicación para tu bucket (ej: `us-central1`)
5. Anota el nombre de tu bucket (ejemplo: `plataforma-rrhh-2024.appspot.com`)

### 1.3 Configurar Reglas de Seguridad
Reemplaza las reglas de Firebase Storage con las siguientes:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Carpeta de CVs - solo lectura/escritura autenticada
    match /cvs/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Carpeta de reportes - solo lectura/escritura autenticada
    match /reportes/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Carpeta de documentos - solo lectura/escritura autenticada
    match /documentos/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Otras carpetas - solo lectura/escritura autenticada
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

**Nota**: Como estamos usando Firebase Admin SDK desde el backend, estas reglas se aplicarán solo para acceso directo. El Admin SDK tiene acceso completo.

---

## 🔑 Paso 2: Obtener Credenciales del Proyecto

### 2.1 Generar Clave Privada
1. En Firebase Console, ve a **⚙️ Configuración del proyecto** (ícono de engranaje)
2. Selecciona la pestaña **"Cuentas de servicio"** o **"Service accounts"**
3. Haz clic en **"Generar nueva clave privada"** o **"Generate new private key"**
4. Confirma haciendo clic en **"Generar clave"**
5. Se descargará un archivo JSON con las credenciales

### 2.2 Renombrar y Guardar el Archivo
1. Renombra el archivo descargado a: **`firebase-credentials.json`**
2. Mueve el archivo a la raíz del proyecto backend:
   ```
   /backend/firebase-credentials.json
   ```

**⚠️ IMPORTANTE**: Este archivo **NUNCA** debe ser subido a Git. Ya está configurado en `.gitignore`.

El archivo tendrá una estructura similar a:
```json
{
  "type": "service_account",
  "project_id": "tu-proyecto-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@tu-proyecto-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

---

## ⚙️ Paso 3: Configurar Variables de Entorno

Edita el archivo **`.env`** en la raíz del proyecto:

```env
# Firebase Storage Configuration
FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com

# Configuración de archivos
MAX_FILE_SIZE=10485760    # 10MB en bytes
ALLOWED_FILE_TYPES=application/pdf
```

Reemplaza `tu-proyecto-id.appspot.com` con el nombre real de tu bucket de Firebase Storage.

---

## 📝 Paso 4: Uso en Controllers

### Ejemplo 1: Subir CV de Candidato

```javascript
const { uploadFile, generateUniqueFileName } = require('../utils/firebase.util');

const subirCV = async (req, res) => {
  try {
    // El archivo viene de req.file (gracias a multer middleware)
    const file = req.file;

    // Generar nombre único en la carpeta 'cvs'
    const fileName = generateUniqueFileName(file.originalname, 'cvs');

    // Subir a Firebase Storage
    const uploadResult = await uploadFile(
      file.buffer,
      fileName,
      file.mimetype
    );

    // Guardar URL en la base de datos
    const candidato = await Candidato.findByPk(req.candidatoId);
    candidato.cv_url = uploadResult.url;
    await candidato.save();

    return res.status(200).json({
      success: true,
      message: 'CV subido correctamente',
      data: {
        url: uploadResult.url,
        fileName: uploadResult.fileName
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Ejemplo 2: Route con Middleware de Multer

```javascript
const { uploadSinglePdf } = require('../middlewares/multer.middleware');
const { subirCV } = require('../controllers/candidatos/candidatos.controller');

// El middleware uploadSinglePdf('cv') maneja la validación del PDF
router.post('/candidatos/cv', uploadSinglePdf('cv'), subirCV);
```

### Ejemplo 3: Generar Reporte PDF

```javascript
const { uploadFile, generateUniqueFileName } = require('../utils/firebase.util');

const generarReporte = async (req, res) => {
  try {
    // Aquí generas el PDF (con alguna librería como pdfkit, puppeteer, etc.)
    const pdfBuffer = await generarPdfReporte(req.body);

    // Generar nombre único
    const fileName = generateUniqueFileName('reporte-vacantes.pdf', 'reportes');

    // Subir a Firebase
    const uploadResult = await uploadFile(pdfBuffer, fileName);

    // Guardar registro en BD
    await Reporte.create({
      tipo_reporte: 'VACANTES',
      formato: 'PDF',
      url_archivo: uploadResult.url,
      generado_por: req.usuarioId
    });

    return res.status(200).json({
      success: true,
      message: 'Reporte generado correctamente',
      data: { url: uploadResult.url }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Ejemplo 4: Eliminar Archivo

```javascript
const { deleteFile, extractFileNameFromUrl } = require('../utils/firebase.util');

const eliminarCV = async (req, res) => {
  try {
    const candidato = await Candidato.findByPk(req.params.id);

    if (candidato.cv_url) {
      // Extraer nombre del archivo de la URL
      const fileName = extractFileNameFromUrl(candidato.cv_url);

      // Eliminar de Firebase Storage
      await deleteFile(fileName);

      // Actualizar BD
      candidato.cv_url = null;
      await candidato.save();
    }

    return res.status(200).json({
      success: true,
      message: 'CV eliminado correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

---

## 🛠️ Funciones Disponibles

### `firebase.util.js`

| Función | Descripción | Parámetros |
|---------|-------------|------------|
| `uploadFile(buffer, fileName, contentType)` | Sube un archivo a Firebase Storage | `buffer`: Buffer del archivo<br>`fileName`: Ruta/nombre (ej: 'cvs/abc.pdf')<br>`contentType`: Tipo MIME |
| `generateUniqueFileName(originalName, folder)` | Genera nombre único con UUID | `originalName`: Nombre original<br>`folder`: Carpeta (ej: 'cvs', 'reportes') |
| `deleteFile(fileName)` | Elimina archivo de Storage | `fileName`: Ruta completa del archivo |
| `getSignedDownloadUrl(fileName, expiresInMinutes)` | Genera URL temporal firmada | `fileName`: Ruta del archivo<br>`expiresInMinutes`: Tiempo de expiración |
| `extractFileNameFromUrl(url)` | Extrae nombre de archivo de URL | `url`: URL completa de Firebase Storage |
| `validatePdfFile(file)` | Valida que sea PDF y tamaño | `file`: Objeto file de multer |
| `fileExists(fileName)` | Verifica si existe el archivo | `fileName`: Ruta del archivo |
| `getFileMetadata(fileName)` | Obtiene metadata del archivo | `fileName`: Ruta del archivo |

### `multer.middleware.js`

| Middleware | Descripción | Uso |
|------------|-------------|-----|
| `uploadSinglePdf(fieldName)` | Recibe 1 PDF (requerido) | `uploadSinglePdf('cv')` |
| `uploadMultiplePdfs(fieldName, maxCount)` | Recibe múltiples PDFs | `uploadMultiplePdfs('documentos', 5)` |
| `uploadOptionalPdf(fieldName)` | Recibe 1 PDF (opcional) | `uploadOptionalPdf('cv')` |

---

## 📂 Estructura de Carpetas en Firebase Storage

```
plataforma-rrhh-2024.appspot.com/
├── cvs/
│   ├── uuid-123.pdf
│   ├── uuid-456.pdf
│   └── ...
├── reportes/
│   ├── uuid-789.pdf
│   └── ...
├── documentos/
│   ├── titulos/
│   │   └── uuid-abc.pdf
│   ├── certificados/
│   │   └── uuid-def.pdf
│   └── ...
└── pruebas-tecnicas/
    └── ...
```

---

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Firebase Console
- [ ] Firebase Storage activado
- [ ] Reglas de seguridad configuradas
- [ ] Credenciales descargadas (`firebase-credentials.json`)
- [ ] Archivo de credenciales en `/backend/firebase-credentials.json`
- [ ] Variable `FIREBASE_STORAGE_BUCKET` configurada en `.env`
- [ ] Variable `MAX_FILE_SIZE` configurada en `.env`
- [ ] Verificar que `firebase-credentials.json` está en `.gitignore`
- [ ] Dependencia `firebase-admin` instalada
- [ ] Prueba de subida de archivo exitosa

---

## 🔒 Seguridad

**Buenas prácticas**:
1. **Nunca** subas `firebase-credentials.json` a Git
2. Usa URLs firmadas temporales para archivos sensibles
3. Valida siempre el tipo y tamaño del archivo antes de subir
4. Implementa límites de rate limiting en tus endpoints
5. Registra todas las operaciones de archivos en `historial_actividad`
6. Verifica permisos de usuario antes de permitir descargas

---

## 🧪 Probar la Configuración

Puedes probar usando Postman o curl:

```bash
curl -X POST http://localhost:5000/api/candidatos/cv \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -F "cv=@/ruta/a/tu/cv.pdf"
```

---

## ❓ Troubleshooting

### Error: "No se pudo inicializar Firebase Storage"
- Verifica que `firebase-credentials.json` existe en la raíz del proyecto
- Verifica que el JSON tiene el formato correcto

### Error: "El archivo excede el tamaño máximo"
- Aumenta `MAX_FILE_SIZE` en `.env` (en bytes)
- 10MB = 10485760 bytes

### Error: "Solo se permiten archivos PDF"
- Asegúrate de que el archivo tiene extensión `.pdf`
- Verifica el MIME type del archivo

### Error: "Permission denied"
- Verifica las reglas de seguridad en Firebase Console
- Asegúrate de que el Admin SDK tiene permisos

---

## 📚 Recursos Adicionales

- [Documentación Firebase Storage](https://firebase.google.com/docs/storage)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Multer Documentation](https://github.com/expressjs/multer)
