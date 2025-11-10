const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./src/models');

const apiRoutes = require('./src/routes');
const app = express();

// ==================== CONFIGURACIÓN DE CORS ====================
// Configurar CORS para permitir peticiones desde el frontend
const corsOptions = {
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5501'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
        app.listen(PORT, () => {
            console.log('🚀 Servidor corriendo en http://localhost:' + PORT);
            console.log('✅ Base de datos conectada');
            console.log('🌐 CORS habilitado para:', corsOptions.origin);
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