const express = require('express');
const router = express.Router();
const vacantesController = require('../../controllers/vacantes/vacantes.controller');
const postulacionesController = require('../../controllers/vacantes/postulaciones.controller');
const { verificarToken, esEmpresa, esCandidato } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

// ==================== RUTAS DE VACANTES ====================

/**
 * @route   GET /api/vacantes
 * @desc    Obtener todas las vacantes (con filtros)
 * @access  Público
 */
router.get('/', vacantesController.obtenerVacantes);

/**
 * @route   GET /api/vacantes/mis-vacantes
 * @desc    Obtener vacantes de mi empresa
 * @access  Privado (Empresa)
 */
router.get('/mis-vacantes', verificarToken, esEmpresa, vacantesController.misVacantes);

/**
 * @route   GET /api/vacantes/:id
 * @desc    Obtener una vacante por ID
 * @access  Público
 */
router.get('/:id', validateId(), vacantesController.obtenerVacantePorId);

/**
 * @route   POST /api/vacantes
 * @desc    Crear nueva vacante
 * @access  Privado (Empresa)
 */
router.post('/', verificarToken, esEmpresa, sanitizeInput, vacantesController.crearVacante);

/**
 * @route   PUT /api/vacantes/:id
 * @desc    Actualizar una vacante
 * @access  Privado (Empresa)
 */
router.put('/:id', verificarToken, esEmpresa, validateId(), sanitizeInput, vacantesController.actualizarVacante);

/**
 * @route   DELETE /api/vacantes/:id
 * @desc    Eliminar una vacante
 * @access  Privado (Empresa)
 */
router.delete('/:id', verificarToken, esEmpresa, validateId(), vacantesController.eliminarVacante);

/**
 * @route   PATCH /api/vacantes/:id/estado
 * @desc    Cambiar estado de una vacante
 * @access  Privado (Empresa)
 */
router.patch('/:id/estado', verificarToken, esEmpresa, validateId(), sanitizeInput, vacantesController.cambiarEstado);

// ==================== RUTAS DE POSTULACIONES ====================

/**
 * @route   POST /api/vacantes/postularse
 * @desc    Postularse a una vacante
 * @access  Privado (Candidato)
 */
router.post('/postularse', verificarToken, esCandidato, sanitizeInput, postulacionesController.postularse);

/**
 * @route   GET /api/vacantes/mis-postulaciones
 * @desc    Obtener mis postulaciones
 * @access  Privado (Candidato)
 */
router.get('/mis-postulaciones', verificarToken, esCandidato, postulacionesController.misPostulaciones);

/**
 * @route   GET /api/vacantes/:id_vacante/postulaciones
 * @desc    Obtener postulaciones de una vacante
 * @access  Privado (Empresa)
 */
router.get('/:id_vacante/postulaciones', verificarToken, esEmpresa, validateId('id_vacante'), postulacionesController.postulacionesPorVacante);

/**
 * @route   PUT /api/vacantes/postulaciones/:id
 * @desc    Actualizar estado de una postulación
 * @access  Privado (Empresa)
 */
router.put('/postulaciones/:id', verificarToken, esEmpresa, validateId(), sanitizeInput, postulacionesController.actualizarEstadoPostulacion);

/**
 * @route   DELETE /api/vacantes/postulaciones/:id
 * @desc    Cancelar postulación
 * @access  Privado (Candidato)
 */
router.delete('/postulaciones/:id', verificarToken, esCandidato, validateId(), postulacionesController.cancelarPostulacion);

module.exports = router;
