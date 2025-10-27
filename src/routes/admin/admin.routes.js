const express = require('express');
const router = express.Router();
const historialController = require('../../controllers/admin/historial.controller');
const reportesController = require('../../controllers/admin/reportes.controller');
const { verificarToken, esAdministrador } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

// ============================================================
// RUTAS DE HISTORIAL DE ACTIVIDAD
// ============================================================

/**
 * @route   POST /api/admin/historial
 * @desc    Registrar actividad en el historial
 * @access  Privado (Admin)
 */
router.post('/historial', verificarToken, esAdministrador, sanitizeInput, historialController.registrarActividad);

/**
 * @route   GET /api/admin/historial
 * @desc    Obtener historial de actividades con filtros
 * @access  Privado (Admin)
 */
router.get('/historial', verificarToken, esAdministrador, historialController.obtenerHistorial);

/**
 * @route   GET /api/admin/historial/estadisticas
 * @desc    Obtener estadísticas de actividad
 * @access  Privado (Admin)
 */
router.get('/historial/estadisticas', verificarToken, esAdministrador, historialController.obtenerEstadisticas);

/**
 * @route   GET /api/admin/historial/usuario/:id_usuario
 * @desc    Obtener historial de un usuario específico
 * @access  Privado (Admin)
 */
router.get('/historial/usuario/:id_usuario', verificarToken, esAdministrador, validateId('id_usuario'), historialController.obtenerHistorialUsuario);

/**
 * @route   GET /api/admin/historial/tabla/:tabla
 * @desc    Obtener actividades por tabla afectada
 * @access  Privado (Admin)
 */
router.get('/historial/tabla/:tabla', verificarToken, esAdministrador, historialController.obtenerHistorialPorTabla);

/**
 * @route   DELETE /api/admin/historial/limpiar
 * @desc    Limpiar historial antiguo
 * @access  Privado (Admin)
 */
router.delete('/historial/limpiar', verificarToken, esAdministrador, historialController.limpiarHistorial);

// ============================================================
// RUTAS DE REPORTES
// ============================================================

/**
 * @route   POST /api/admin/reportes
 * @desc    Generar un nuevo reporte
 * @access  Privado (Admin)
 */
router.post('/reportes', verificarToken, esAdministrador, sanitizeInput, reportesController.generarReporte);

/**
 * @route   GET /api/admin/reportes
 * @desc    Obtener todos los reportes
 * @access  Privado (Admin)
 */
router.get('/reportes', verificarToken, esAdministrador, reportesController.obtenerReportes);

/**
 * @route   GET /api/admin/reportes/tipo/:tipo
 * @desc    Obtener reportes por tipo
 * @access  Privado (Admin)
 */
router.get('/reportes/tipo/:tipo', verificarToken, esAdministrador, reportesController.reportesPorTipo);

/**
 * @route   GET /api/admin/reportes/:id
 * @desc    Obtener un reporte específico
 * @access  Privado (Admin)
 */
router.get('/reportes/:id', verificarToken, esAdministrador, validateId(), reportesController.obtenerReporte);

/**
 * @route   DELETE /api/admin/reportes/:id
 * @desc    Eliminar un reporte
 * @access  Privado (Admin)
 */
router.delete('/reportes/:id', verificarToken, esAdministrador, validateId(), reportesController.eliminarReporte);

module.exports = router;
