const express = require('express');
const router = express.Router();
const empresasController = require('../../controllers/empresas/empresas.controller');
const { verificarToken, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

/**
 * @route   GET /api/empresas
 * @desc    Obtener todas las empresas
 * @access  Público
 */
router.get('/', empresasController.obtenerEmpresas);

/**
 * @route   GET /api/empresas/mi-empresa
 * @desc    Obtener mi empresa
 * @access  Privado (Empresa)
 */
router.get('/mi-empresa', verificarToken, esEmpresa, empresasController.miEmpresa);

/**
 * @route   GET /api/empresas/:id
 * @desc    Obtener empresa por ID
 * @access  Público
 */
router.get('/:id', validateId(), empresasController.obtenerEmpresaPorId);

/**
 * @route   PUT /api/empresas
 * @desc    Actualizar mi empresa
 * @access  Privado (Empresa)
 */
router.put('/', verificarToken, esEmpresa, sanitizeInput, empresasController.actualizarEmpresa);

module.exports = router;
