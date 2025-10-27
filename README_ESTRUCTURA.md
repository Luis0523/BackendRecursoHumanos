# Plataforma de Gestión de Talento Humano - Backend

Sistema completo de gestión de recursos humanos con funcionalidades de reclutamiento, pruebas psicométricas, técnicas y médicas, entrevistas y seguimiento post-contratación.

## Estructura del Proyecto

```
backend/
├── app.js                    # Punto de entrada de la aplicación
├── .env                      # Variables de entorno
├── package.json
├── db/
│   └── db.js                 # Configuración de Sequelize
├── SQL/
│   ├── schema_gestion_talento.sql   # Schema de la base de datos
│   └── datos.sql             # Datos iniciales
└── src/
    ├── models/               # Modelos de Sequelize (20 modelos)
    │   ├── index.js          # ⭐ Exporta todos los modelos y define relaciones
    │   ├── auth/
    │   ├── empresas/
    │   ├── candidatos/
    │   ├── vacantes/
    │   ├── pruebas-psicometricas/
    │   ├── pruebas-tecnicas/
    │   ├── pruebas-medicas/
    │   ├── entrevistas/
    │   ├── eventos/
    │   ├── documentos/
    │   ├── evaluaciones/
    │   └── admin/
    │
    ├── controllers/          # Lógica de negocio
    │   ├── auth/
    │   ├── empresas/
    │   ├── candidatos/
    │   ├── vacantes/
    │   └── ... (otros módulos)
    │
    ├── routes/              # Definición de rutas
    │   ├── index.js         # ⭐ Router maestro
    │   ├── auth/
    │   ├── empresas/
    │   ├── candidatos/
    │   ├── vacantes/
    │   └── ... (otros módulos)
    │
    ├── middlewares/         # Middlewares personalizados
    │   ├── auth.middleware.js
    │   └── validation.middleware.js
    │
    ├── utils/               # Utilidades
    │   ├── response.util.js
    │   ├── errors.util.js
    │   └── jwt.util.js
    │
    ├── config/              # Configuraciones
    │   └── constants.js
    │
    └── validators/          # Validadores (para expandir)
        └── ... (por módulo)
```

## Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos

Crea la base de datos ejecutando el script SQL:
```bash
mysql -u root -p < SQL/schema_gestion_talento.sql
```

O usando MySQL Workbench/phpMyAdmin, importa el archivo `SQL/schema_gestion_talento.sql`

### 3. Configurar variables de entorno

Edita el archivo `.env` con tus configuraciones:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=gestion_talento_humano
DB_PORT=3306
PORT=5000

JWT_SECRET=cambia_esto_por_una_clave_segura
JWT_EXPIRES_IN=24h

NODE_ENV=development
```

### 4. Ejecutar el servidor

```bash
# Modo desarrollo (con nodemon)
npm start

# O modo producción
node app.js
```

El servidor estará disponible en `http://localhost:5000`

## Endpoints Principales

### Autenticación (`/api/auth`)
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/perfil` - Obtener perfil (requiere token)
- `PUT /api/auth/perfil` - Actualizar perfil
- `PUT /api/auth/cambiar-contraseña` - Cambiar contraseña
- `POST /api/auth/solicitar-recuperacion` - Solicitar recuperación de contraseña
- `POST /api/auth/restablecer-contraseña` - Restablecer contraseña

### Vacantes (`/api/vacantes`)
- `GET /api/vacantes` - Obtener todas las vacantes (público)
- `GET /api/vacantes/:id` - Obtener vacante por ID
- `POST /api/vacantes` - Crear vacante (solo empresas)
- `PUT /api/vacantes/:id` - Actualizar vacante (solo empresas)
- `DELETE /api/vacantes/:id` - Eliminar vacante (solo empresas)
- `GET /api/vacantes/mis-vacantes` - Vacantes de mi empresa
- `POST /api/vacantes/postularse` - Postularse (solo candidatos)
- `GET /api/vacantes/mis-postulaciones` - Mis postulaciones (solo candidatos)
- `GET /api/vacantes/:id_vacante/postulaciones` - Postulaciones de una vacante (solo empresas)

### Empresas (`/api/empresas`)
- `GET /api/empresas` - Obtener todas las empresas
- `GET /api/empresas/:id` - Obtener empresa por ID
- `GET /api/empresas/mi-empresa` - Mi empresa (solo empresas)
- `PUT /api/empresas` - Actualizar mi empresa

### Candidatos (`/api/candidatos`)
- `GET /api/candidatos/mi-perfil` - Mi perfil (solo candidatos)
- `PUT /api/candidatos` - Actualizar mi perfil (solo candidatos)
- `GET /api/candidatos/:id` - Obtener candidato por ID
- `GET /api/candidatos/buscar` - Buscar candidatos (solo empresas)

## Roles y Permisos

### Roles disponibles:
1. **administrador** - Acceso completo al sistema
2. **empresa** - Puede publicar vacantes y gestionar candidatos
3. **candidato** - Puede postularse y realizar pruebas

### Middlewares de autenticación:
- `verificarToken` - Verifica que el usuario esté autenticado
- `esAdministrador` - Solo administradores
- `esEmpresa` - Solo empresas
- `esCandidato` - Solo candidatos
- `verificarRol(...roles)` - Verifica múltiples roles

## Módulos del Sistema

### ✅ Implementados (base)
1. **Autenticación** - Login, registro, recuperación de contraseña
2. **Empresas** - Gestión de perfiles empresariales
3. **Candidatos** - Gestión de perfiles de candidatos
4. **Vacantes** - Publicación y gestión de vacantes
5. **Postulaciones** - Sistema de postulaciones

### 📋 Por implementar (controllers y routes básicos listos para extender)
6. **Pruebas Psicométricas** - Sistema completo de evaluaciones psicológicas
7. **Pruebas Técnicas** - Evaluaciones técnicas (código, Excel, etc.)
8. **Pruebas Médicas** - Gestión de exámenes médicos
9. **Entrevistas** - Programación y evaluación de entrevistas
10. **Eventos** - Calendario de eventos (entrevistas, firmas, inducciones)
11. **Documentos** - Verificación de documentos del candidato
12. **Evaluaciones Post-Contratación** - Seguimiento durante periodo de prueba
13. **Admin** - Historial de actividad y reportes

## Modelos de la Base de Datos (20 tablas)

### Autenticación
- Roles
- Usuarios

### Perfiles
- Empresas
- Candidatos

### Vacantes y Postulaciones
- Vacantes
- Postulaciones

### Pruebas Psicométricas (6 tablas)
- Pruebas
- Preguntas
- Opciones_Respuesta
- Asignaciones_Prueba
- Respuestas_Candidato
- Resultados_Prueba

### Evaluaciones Adicionales
- Pruebas_Tecnicas
- Pruebas_Medicas
- Entrevistas

### Gestión
- Eventos
- Verificacion_Documentos
- Evaluacion_Post_Contratacion

### Administración
- Historial_Actividad
- Reportes

## Tecnologías

- **Node.js** + **Express 5.1**
- **MySQL** + **Sequelize ORM**
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas
- **CORS** configurado

## Ejemplo de Uso

### 1. Registrar un usuario

```bash
POST http://localhost:5000/api/auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contraseña": "password123",
  "telefono": "12345678",
  "rol": "candidato"
}
```

### 2. Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "contraseña": "password123"
}
```

Respuesta:
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "candidato"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Usar el token en requests autenticados

```bash
GET http://localhost:5000/api/auth/perfil
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Próximos Pasos

1. **Implementar controllers y routes** para los módulos restantes
2. **Agregar validadores** con Joi o express-validator
3. **Implementar sistema de archivos** para CV, documentos, etc.
4. **Agregar sistema de emails** para notificaciones
5. **Implementar reportes y analytics**
6. **Tests unitarios y de integración**
7. **Documentación con Swagger**

## Contribuciones

Este es un proyecto en desarrollo activo. Los módulos principales están implementados y funcionando. Los demás módulos tienen sus modelos y estructura lista para ser extendida.

## Soporte

Para dudas o problemas, revisa la documentación o contacta al equipo de desarrollo.
