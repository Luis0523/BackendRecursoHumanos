const express = require('express');
const router = express.Router();
const entrevistasController = require('../../controllers/entrevistas/entrevistas.controller');
const { verificarToken, esCandidato, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

/**
 * @route   POST /api/entrevistas
 * @desc    Crear/programar una entrevista
 * @access  Privado (Empresa)
 */
router.post('/', verificarToken, esEmpresa, sanitizeInput, entrevistasController.crearEntrevista);

/**
 * @route   GET /api/entrevistas/mis-entrevistas
 * @desc    Obtener mis entrevistas
 * @access  Privado (Candidato)
 */
router.get('/mis-entrevistas', verificarToken, esCandidato, entrevistasController.misEntrevistas);

/**
 * @route   GET /api/entrevistas/empresa
 * @desc    Obtener entrevistas de mi empresa
 * @access  Privado (Empresa)
 */
router.get('/empresa', verificarToken, esEmpresa, entrevistasController.entrevistasPorEmpresa);

/**
 * @route   PUT /api/entrevistas/:id
 * @desc    Actualizar entrevista
 * @access  Privado (Empresa)
 */
router.put('/:id', verificarToken, esEmpresa, validateId(), sanitizeInput, entrevistasController.actualizarEntrevista);

/**
 * @route   PUT /api/entrevistas/:id/evaluar
 * @desc    Evaluar entrevista
 * @access  Privado (Empresa)
 */
router.put('/:id/evaluar', verificarToken, esEmpresa, validateId(), sanitizeInput, entrevistasController.evaluarEntrevista);

/**
 * @route   PATCH /api/entrevistas/:id/cancelar
 * @desc    Cancelar entrevista
 * @access  Privado (Empresa)
 */
router.patch('/:id/cancelar', verificarToken, esEmpresa, validateId(), entrevistasController.cancelarEntrevista);

module.exports = router;
