# Endpoints para Subida de Archivos PDF

Este documento detalla todos los endpoints implementados para la subida, actualización y eliminación de archivos PDF en el sistema.

---

## 📄 **Candidatos - CVs**

### 1. Subir/Actualizar CV
```
POST /api/candidatos/cv
```
- **Autenticación**: Requerida (Token JWT)
- **Rol**: Candidato
- **Body**: `form-data`
  - `cv` (File): Archivo PDF del CV
- **Descripción**: Sube o actualiza el CV del candidato. Si ya existía un CV, elimina el anterior.

**Ejemplo Postman**:
```
Method: POST
URL: http://localhost:5000/api/candidatos/cv
Headers:
  Authorization: Bearer {token}
Body: form-data
  cv: [Seleccionar archivo PDF]
```

### 2. Eliminar CV
```
DELETE /api/candidatos/cv
```
- **Autenticación**: Requerida (Token JWT)
- **Rol**: Candidato
- **Descripción**: Elimina el CV del candidato de Firebase Storage y actualiza la BD.

---

## 📋 **Documentos de Verificación**

### 1. Crear y Subir Documento
```
POST /api/documentos
```
- **Autenticación**: Requerida (Token JWT)
- **Rol**: Candidato
- **Body**: `form-data`
  - `documento` (File): Archivo PDF del documento
  - `tipo_documento` (Text): titulo, certificado, antecedentes, carta_recomendacion, identificacion, comprobante_domicilio
  - `nombre_documento` (Text): Nombre descriptivo
  - `descripcion` (Text, opcional): Descripción adicional
  - `es_obligatorio` (Boolean, opcional): true/false
  - `id_postulacion` (Number, opcional): ID de la postulación asociada

**Ejemplo Postman**:
```
Method: POST
URL: http://localhost:5000/api/documentos
Headers:
  Authorization: Bearer {token}
Body: form-data
  documento: [Archivo PDF]
  tipo_documento: titulo
  nombre_documento: Título de Ingeniero en Sistemas
  descripcion: Universidad XYZ
  es_obligatorio: true
```

### 2. Actualizar Archivo de Documento Existente
```
PUT /api/documentos/:id/archivo
```
- **Autenticación**: Requerida (Token JWT)
- **Rol**: Candidato
- **Parámetros**: `id` (ID del documento)
- **Body**: `form-data`
  - `documento` (File): Nuevo archivo PDF
- **Descripción**: Actualiza el archivo PDF de un documento existente. Elimina el archivo anterior.

### 3. Eliminar Solo el Archivo (mantiene registro)
```
DELETE /api/documentos/:id/archivo
```
- **Autenticación**: Requerida (Token JWT)
- **Rol**: Candidato
- **Parámetros**: `id` (ID del documento)
- **Descripción**: Elimina el archivo PDF pero mantiene el registro del documento en la BD.

### 4. Eliminar Documento Completo
```
DELETE /api/documentos/:id
```
- **Autenticación**: Requerida (Token JWT)
- **Rol**: Candidato
- **Parámetros**: `id` (ID del documento)
- **Descripción**: Elimina el documento completo (registro + archivo).

---

## 🔧 **Pruebas Técnicas**

### 1. Subir Instrucciones (Empresa)
```
POST /api/pruebas-tecnicas/:id/instrucciones
```
- **Autenticación**: Requerida (Token JWT)
- **Rol**: Empresa
- **Parámetros**: `id` (ID de la prueba técnica)
- **Body**: `form-data`
  - `instrucciones` (File): Archivo PDF con instrucciones
- **Descripción**: La empresa sube las instrucciones detalladas de la prueba técnica.

**Ejemplo Postman**:
```
Method: POST
URL: http://localhost:5000/api/pruebas-tecnicas/5/instrucciones
Headers:
  Authorization: Bearer {token_empresa}
Body: form-data
  instrucciones: [Archivo PDF]
```

### 2. Subir Respuesta (Candidato)
```
POST /api/pruebas-tecnicas/:id/respuesta
```
- **Autenticación**: Requerida (Token JWT)
- **Rol**: Candidato
- **Parámetros**: `id` (ID de la prueba técnica)
- **Body**: `form-data`
  - `respuesta` (File): Archivo PDF con la respuesta/entrega
- **Descripción**: El candidato entrega su respuesta a la prueba técnica. Si ya tenía una respuesta, se reemplaza.

**Ejemplo Postman**:
```
Method: POST
URL: http://localhost:5000/api/pruebas-tecnicas/5/respuesta
Headers:
  Authorization: Bearer {token_candidato}
Body: form-data
  respuesta: [Archivo PDF]
```

---

## 🏥 **Pruebas Médicas**

### 1. Subir Resultado Médico
```
POST /api/pruebas-medicas/:id/resultado
```
- **Autenticación**: Requerida (Token JWT)
- **Rol**: Empresa
- **Parámetros**: `id` (ID de la prueba médica)
- **Body**: `form-data`
  - `resultado` (File): Archivo PDF del resultado médico
  - `fecha_realizacion` (Text, opcional): YYYY-MM-DD
  - `fecha_resultado` (Text, opcional): YYYY-MM-DD
  - `resultado` (Text, opcional): apto, no_apto, apto_con_restricciones, pendiente
  - `observaciones` (Text, opcional): Observaciones generales
  - `restricciones` (Text, opcional): Si aplica
  - `medico_responsable` (Text, opcional): Nombre del médico
  - `institucion_medica` (Text, opcional): Nombre de la institución
  - `valido_hasta` (Text, opcional): YYYY-MM-DD

**Ejemplo Postman**:
```
Method: POST
URL: http://localhost:5000/api/pruebas-medicas/3/resultado
Headers:
  Authorization: Bearer {token_empresa}
Body: form-data
  resultado: [Archivo PDF]
  fecha_realizacion: 2024-10-25
  resultado: apto
  medico_responsable: Dr. Juan Pérez
  institucion_medica: Clínica Central
```

---

## 📁 **Estructura de Carpetas en Firebase Storage**

Los archivos se organizan de la siguiente manera:

```
arco21.firebasestorage.app/
├── cvs/
│   └── {uuid}.pdf
│
├── documentos/
│   ├── titulo/
│   │   └── {uuid}.pdf
│   ├── certificado/
│   │   └── {uuid}.pdf
│   ├── antecedentes/
│   │   └── {uuid}.pdf
│   ├── carta_recomendacion/
│   │   └── {uuid}.pdf
│   ├── identificacion/
│   │   └── {uuid}.pdf
│   └── comprobante_domicilio/
│       └── {uuid}.pdf
│
├── pruebas-tecnicas/
│   ├── instrucciones/
│   │   └── {uuid}.pdf
│   └── respuestas/
│       └── {uuid}.pdf
│
├── pruebas-medicas/
│   └── {uuid}.pdf
│
└── test/
    └── {uuid}.pdf (solo para pruebas)
```

---

## ✅ **Validaciones Aplicadas**

Todos los endpoints tienen las siguientes validaciones:

1. **Autenticación**: Verificación de token JWT
2. **Autorización**: Verificación de rol (Candidato/Empresa)
3. **Tipo de archivo**: Solo se permiten archivos PDF
4. **Tamaño máximo**: 10MB por archivo (configurable en `.env`)
5. **MIME type**: `application/pdf`

---

## 🔐 **Headers Requeridos**

Todos los endpoints (excepto `/api/test/*`) requieren:

```
Authorization: Bearer {tu_token_jwt}
Content-Type: multipart/form-data (automático en Postman con form-data)
```

---

## 📊 **Respuestas Estándar**

### Éxito (200/201):
```json
{
  "success": true,
  "message": "Archivo subido exitosamente",
  "data": {
    "id": 123,
    "archivo_url": "https://storage.googleapis.com/arco21.firebasestorage.app/cvs/uuid.pdf",
    "file_info": {
      "fileName": "cvs/uuid.pdf",
      "size": 125678,
      "originalName": "mi-cv.pdf"
    }
  }
}
```

### Error (400):
```json
{
  "success": false,
  "message": "Solo se permiten archivos PDF"
}
```

### Error (401):
```json
{
  "success": false,
  "message": "Token no proporcionado o inválido"
}
```

### Error (403):
```json
{
  "success": false,
  "message": "No tienes permiso para realizar esta acción"
}
```

---

## 🧪 **Endpoints de Prueba**

Para probar Firebase Storage sin necesidad de autenticación:

```
GET  /api/test/info                    # Verificar configuración
POST /api/test/upload                  # Subir 1 PDF
POST /api/test/upload-multiple         # Subir múltiples PDFs
GET  /api/test/file-exists?fileName=   # Verificar existencia
DELETE /api/test/delete-file           # Eliminar archivo
```

Ver `PRUEBAS_FIREBASE_POSTMAN.md` para más detalles.

---

## 📝 **Flujos de Uso Comunes**

### Flujo 1: Candidato sube su CV
```
1. Login: POST /api/auth/login
2. Guardar token JWT
3. Subir CV: POST /api/candidatos/cv (con token)
4. Verificar perfil: GET /api/candidatos/mi-perfil
```

### Flujo 2: Candidato sube documentos
```
1. Login como candidato
2. Subir título: POST /api/documentos
   - tipo_documento: titulo
   - documento: [PDF]
3. Subir certificado: POST /api/documentos
   - tipo_documento: certificado
   - documento: [PDF]
4. Ver mis documentos: GET /api/documentos/mis-documentos
```

### Flujo 3: Prueba Técnica (Empresa → Candidato)
```
1. Empresa asigna prueba: POST /api/pruebas-tecnicas
2. Empresa sube instrucciones: POST /api/pruebas-tecnicas/:id/instrucciones
3. Candidato descarga instrucciones (desde la URL)
4. Candidato sube respuesta: POST /api/pruebas-tecnicas/:id/respuesta
5. Empresa revisa respuesta y evalúa: PUT /api/pruebas-tecnicas/:id/evaluar
```

### Flujo 4: Resultado Médico
```
1. Empresa solicita prueba: POST /api/pruebas-medicas
2. Candidato realiza examen médico (externo)
3. Empresa sube resultado: POST /api/pruebas-medicas/:id/resultado
4. Candidato puede ver: GET /api/pruebas-medicas/mis-pruebas
```

---

## 🛠️ **Configuración Requerida**

Antes de usar estos endpoints, asegúrate de:

1. ✅ Firebase Storage configurado (ver `CONFIGURACION_FIREBASE.md`)
2. ✅ `firebase-credentials.json` en la raíz del proyecto
3. ✅ Variables en `.env`:
   ```env
   FIREBASE_STORAGE_BUCKET=arco21.firebasestorage.app
   MAX_FILE_SIZE=10485760
   ```
4. ✅ Servidor corriendo: `npm start`

---

## 🔄 **Próximos Endpoints a Implementar**

- [ ] Generación de reportes en PDF
- [ ] Subida de logos de empresas
- [ ] Subida de avatares de usuarios
- [ ] Subida de documentos de eventos
- [ ] Subida de material de inducción

---

## 📞 **Soporte**

Si tienes problemas:
1. Revisa `CONFIGURACION_FIREBASE.md`
2. Revisa `PRUEBAS_FIREBASE_POSTMAN.md`
3. Verifica los logs del servidor
4. Verifica en Firebase Console que los archivos se suben

---

**Última actualización**: 27 de Octubre, 2024
