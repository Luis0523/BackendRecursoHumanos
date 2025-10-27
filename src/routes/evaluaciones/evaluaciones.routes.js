const express = require('express');
const router = express.Router();
const evaluacionesController = require('../../controllers/evaluaciones/evaluaciones.controller');
const { verificarToken, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

/**
 * @route   POST /api/evaluaciones
 * @desc    Crear evaluación post-contratación
 * @access  Privado (Empresa)
 */
router.post('/', verificarToken, esEmpresa, sanitizeInput, evaluacionesController.crearEvaluacion);

/**
 * @route   GET /api/evaluaciones/empresa
 * @desc    Obtener evaluaciones de mi empresa
 * @access  Privado (Empresa)
 */
router.get('/empresa', verificarToken, esEmpresa, evaluacionesController.evaluacionesPorEmpresa);

/**
 * @route   GET /api/evaluaciones/estadisticas
 * @desc    Obtener estadísticas de evaluaciones
 * @access  Privado (Empresa)
 */
router.get('/estadisticas', verificarToken, esEmpresa, evaluacionesController.obtenerEstadisticas);

/**
 * @route   GET /api/evaluaciones/candidato/:id_candidato
 * @desc    Obtener evaluaciones de un candidato
 * @access  Privado (Empresa)
 */
router.get('/candidato/:id_candidato', verificarToken, esEmpresa, validateId('id_candidato'), evaluacionesController.evaluacionesCandidato);

/**
 * @route   GET /api/evaluaciones/:id
 * @desc    Obtener una evaluación específica
 * @access  Privado (Empresa)
 */
router.get('/:id', verificarToken, esEmpresa, validateId(), evaluacionesController.obtenerEvaluacion);

/**
 * @route   PUT /api/evaluaciones/:id
 * @desc    Actualizar evaluación con feedback
 * @access  Privado (Empresa)
 */
router.put('/:id', verificarToken, esEmpresa, validateId(), sanitizeInput, evaluacionesController.actualizarEvaluacion);

/**
 * @route   PATCH /api/evaluaciones/:id/decision
 * @desc    Tomar decisión final sobre el candidato
 * @access  Privado (Empresa)
 */
router.patch('/:id/decision', verificarToken, esEmpresa, validateId(), sanitizeInput, evaluacionesController.tomarDecision);

/**
 * @route   DELETE /api/evaluaciones/:id
 * @desc    Eliminar evaluación
 * @access  Privado (Empresa)
 */
router.delete('/:id', verificarToken, esEmpresa, validateId(), evaluacionesController.eliminarEvaluacion);

module.exports = router;
