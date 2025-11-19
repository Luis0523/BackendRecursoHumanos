# Sistema de Gestión de Talento Humano - Backend

Backend de la plataforma de gestión de recursos humanos con gestión de vacantes, candidatos, pruebas psicométricas, contrataciones y análisis con IA.

## 🚀 Tecnologías

- Node.js + Express
- MySQL + Sequelize ORM
- JWT para autenticación
- Firebase Storage para archivos
- OpenAI API para análisis de candidatos
- CORS habilitado para producción

## 📋 Requisitos

- Node.js 14+
- MySQL 5.7+
- Cuenta de Firebase (para almacenamiento de archivos)
- API Key de OpenAI (opcional, para funcionalidad de IA)

## 🔧 Instalación Local

1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd backend
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
Copiar `.env.example` a `.env` y configurar:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
- `DB_HOST`: Host de la base de datos
- `DB_USER`: Usuario de MySQL
- `DB_PASSWORD`: Contraseña de MySQL
- `DB_NAME`: Nombre de la base de datos
- `JWT_SECRET`: Clave secreta para JWT (cambiar en producción)
- `FIREBASE_STORAGE_BUCKET`: Bucket de Firebase Storage
- `OPENAI_API_KEY`: API Key de OpenAI (opcional)

4. Iniciar servidor
```bash
npm start
```

El servidor estará disponible en `http://localhost:5010`

## 🚂 Deploy en Railway

### Opción 1: Deploy directo desde GitHub

1. Crear cuenta en [Railway.app](https://railway.app/)
2. Conectar tu repositorio de GitHub
3. Seleccionar el proyecto
4. Railway detectará automáticamente que es un proyecto Node.js
5. Configurar las variables de entorno en Railway:
   - Ir a Variables → Add Variables
   - Agregar todas las variables del archivo `.env.example`
   
### Opción 2: Deploy con Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Iniciar proyecto
railway init

# Deploy
railway up
```

### Variables de Entorno Requeridas en Railway

```
NODE_ENV=production
PORT=5010
DB_HOST=<tu-host-mysql>
DB_USER=<usuario>
DB_PASSWORD=<password>
DB_NAME=gestion_talento_humano
DB_PORT=3306
JWT_SECRET=<generar-clave-segura>
JWT_EXPIRES_IN=24h
FIREBASE_STORAGE_BUCKET=<tu-bucket>.firebasestorage.app
OPENAI_API_KEY=<tu-api-key>
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf
```

### Configurar Base de Datos MySQL en Railway

1. En tu proyecto de Railway, agregar un nuevo servicio
2. Seleccionar "MySQL"
3. Railway creará automáticamente las variables:
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`
4. Mapear estas variables a las del proyecto:
   - `DB_HOST=$MYSQLHOST`
   - `DB_USER=$MYSQLUSER`
   - `DB_PASSWORD=$MYSQLPASSWORD`
   - `DB_NAME=$MYSQLDATABASE`
   - `DB_PORT=$MYSQLPORT`

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/     # Controladores
│   ├── models/          # Modelos de Sequelize
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middlewares
│   ├── services/        # Servicios (IA, Firebase)
│   └── config/          # Configuraciones
├── .env                 # Variables de entorno (no subir a git)
├── .env.example         # Ejemplo de variables
├── app.js               # Punto de entrada
├── package.json
└── README.md
```

## 🔐 Seguridad

- JWT para autenticación
- Bcrypt para hashing de contraseñas
- Validación de roles (Empresa, Candidato)
- CORS configurado para producción
- Variables de entorno para credenciales

## 🌐 Endpoints Principales

- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login
- `GET /api/vacantes` - Listar vacantes
- `POST /api/postulaciones` - Crear postulación
- `GET /api/pruebas-psicometricas` - Pruebas psicométricas
- `POST /api/ia/analizar-compatibilidad/:id` - Análisis con IA

## 📝 Notas

- El servidor escucha en el puerto definido en `PORT` (default: 5010)
- CORS está habilitado para todos los orígenes en producción
- Los archivos se almacenan en Firebase Storage
- La IA analiza compatibilidad de candidatos usando OpenAI

## 🐛 Troubleshooting

### Error de conexión a MySQL
- Verificar que las credenciales en `.env` sean correctas
- Asegurar que MySQL esté corriendo
- Verificar que el puerto 3306 esté abierto

### Error de CORS
- Verificar que `NODE_ENV=production` en Railway
- El código ya está configurado para permitir todos los orígenes en producción

### Error de Firebase
- Verificar que `FIREBASE_STORAGE_BUCKET` esté configurado
- Asegurar que las credenciales de Firebase sean correctas

## 📞 Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.
