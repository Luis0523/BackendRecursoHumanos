const express = require('express');
const router = express.Router();
const candidatosController = require('../../controllers/candidatos/candidatos.controller');
const { verificarToken, esCandidato, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');
const { uploadSinglePdf } = require('../../middlewares/multer.middleware');

/**
 * @route   GET /api/candidatos/mi-perfil
 * @desc    Obtener mi perfil de candidato
 * @access  Privado (Candidato)
 */
router.get('/mi-perfil', verificarToken, esCandidato, candidatosController.miPerfil);

/**
 * @route   GET /api/candidatos/buscar
 * @desc    Buscar candidatos
 * @access  Privado (Empresa)
 */
router.get('/buscar', verificarToken, esEmpresa, candidatosController.buscarCandidatos);

/**
 * @route   GET /api/candidatos/:id
 * @desc    Obtener candidato por ID
 * @access  Privado
 */
router.get('/:id', verificarToken, validateId(), candidatosController.obtenerCandidatoPorId);

/**
 * @route   PUT /api/candidatos
 * @desc    Actualizar mi perfil de candidato
 * @access  Privado (Candidato)
 */
router.put('/', verificarToken, esCandidato, sanitizeInput, candidatosController.actualizarCandidato);

/**
 * @route   POST /api/candidatos/cv
 * @desc    Subir o actualizar CV del candidato
 * @access  Privado (Candidato)
 */
router.post('/cv', verificarToken, esCandidato, uploadSinglePdf('cv'), candidatosController.subirCV);

/**
 * @route   DELETE /api/candidatos/cv
 * @desc    Eliminar CV del candidato
 * @access  Privado (Candidato)
 */
router.delete('/cv', verificarToken, esCandidato, candidatosController.eliminarCV);

module.exports = router;
