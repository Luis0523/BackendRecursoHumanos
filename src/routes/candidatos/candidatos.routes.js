const express = require('express');
const router = express.Router();
const candidatosController = require('../../controllers/candidatos/candidatos.controller');
const { verificarToken, esCandidato, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

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

module.exports = router;
