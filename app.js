const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./src/models');

const apiRoutes = require('./src/routes');
const app = express();

// ==================== CONFIGURACIÓN DE CORS ====================
// Configurar CORS para permitir peticiones desde el frontend
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (como Postman, aplicaciones móviles, etc.)
        if (!origin) return callback(null, true);
        
        // Lista blanca de orígenes para desarrollo
        const allowedOrigins = [
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5501',
            'http://localhost:5501'
        ];
        
        // Si hay una variable de entorno con la URL del frontend en producción, agregarla
        if (process.env.FRONTEND_URL) {
            allowedOrigins.push(process.env.FRONTEND_URL);
        }
        
        // Si estamos en producción, permitir cualquier origen (Railway, Vercel, Netlify, etc.)
        if (process.env.NODE_ENV === 'production') {
            return callback(null, true);
        }
        
        // En desarrollo, verificar lista blanca pero ser permisivo
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Permitir de todas formas en desarrollo para facilitar testing
            callback(null, true);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));

// ==================== MIDDLEWARES ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== RUTAS ====================
app.use('/api', apiRoutes);

// Ruta de health check (opcional pero útil)
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// ==================== SINCRONIZACIÓN DE BASE DE DATOS ====================
sequelize.sync({ alter: false })
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log('🚀 Servidor corriendo en puerto:', PORT);
            console.log('✅ Base de datos conectada');
            console.log('🌐 CORS habilitado - Modo:', process.env.NODE_ENV || 'development');
            if (process.env.NODE_ENV === 'production') {
                console.log('🔓 Permitiendo todos los orígenes (producción)');
            }
        });
    })
    .catch((err) => {
        console.error('❌ Error al conectar la base de datos:', err);
        process.exit(1);
    });

// ==================== MIDDLEWARE DE MANEJO DE ERRORES ====================
// Ruta no encontrada (404)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Middleware de errores generales
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || 'Error en el servidor',
        error: process.env.NODE_ENV === 'development' ? {
            message: err.message,
            stack: err.stack
        } : undefined
    });
});