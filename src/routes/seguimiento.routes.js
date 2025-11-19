const express = require('express');
const router = express.Router();
const seguimientoController = require('../controllers/seguimiento.controller');
const { verificarToken, esEmpresa } = require('../middlewares/auth.middleware');

// Obtener seguimiento global de candidatos
router.get('/', verificarToken, esEmpresa, seguimientoController.obtenerSeguimientoGlobal);

// Obtener estadísticas de reclutamiento
router.get('/estadisticas', verificarToken, esEmpresa, seguimientoController.obtenerEstadisticasReclutamiento);

module.exports = router;
