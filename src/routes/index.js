const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth/auth.routes');
const vacantesRoutes = require('./vacantes/vacantes.routes');
const empresasRoutes = require('./empresas/empresas.routes');
const candidatosRoutes = require('./candidatos/candidatos.routes');
const pruebasPsicometricasRoutes = require('./pruebas-psicometricas/pruebas-psicometricas.routes');
const pruebasTecnicasRoutes = require('./pruebas-tecnicas/pruebas-tecnicas.routes');
const pruebasMedicasRoutes = require('./pruebas-medicas/pruebas-medicas.routes');
const entrevistasRoutes = require('./entrevistas/entrevistas.routes');
const eventosRoutes = require('./eventos/eventos.routes');
const documentosRoutes = require('./documentos/documentos.routes');
const evaluacionesRoutes = require('./evaluaciones/evaluaciones.routes');

const adminRoutes = require('./admin/admin.routes');

// ============================================================
// DEFINIR RUTAS
// ============================================================

/**
 * Ruta de bienvenida
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de Gestión de Talento Humano',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            vacantes: '/api/vacantes',
            empresas: '/api/empresas',
            candidatos: '/api/candidatos',
            pruebas_psicometricas: '/api/pruebas-psicometricas',
            pruebas_tecnicas: '/api/pruebas-tecnicas',
            pruebas_medicas: '/api/pruebas-medicas',
            entrevistas: '/api/entrevistas',
            eventos: '/api/eventos',
            documentos: '/api/documentos',
            evaluaciones: '/api/evaluaciones',
            admin: '/api/admin'
        }
    });
});

// Montar rutas
router.use('/auth', authRoutes);
router.use('/vacantes', vacantesRoutes);
router.use('/empresas', empresasRoutes);
router.use('/candidatos', candidatosRoutes);
router.use('/pruebas-psicometricas', pruebasPsicometricasRoutes);
router.use('/pruebas-tecnicas', pruebasTecnicasRoutes);
router.use('/pruebas-medicas', pruebasMedicasRoutes);
router.use('/entrevistas', entrevistasRoutes);
router.use('/eventos', eventosRoutes);
router.use('/documentos', documentosRoutes);
router.use('/evaluaciones', evaluacionesRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
