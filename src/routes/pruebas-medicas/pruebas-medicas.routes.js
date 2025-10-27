const express = require('express');
const router = express.Router();
const pruebasMedicasController = require('../../controllers/pruebas-medicas/pruebas-medicas.controller');
const { verificarToken, esCandidato, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

/**
 * @route   POST /api/pruebas-medicas
 * @desc    Solicitar prueba médica
 * @access  Privado (Empresa)
 */
router.post('/', verificarToken, esEmpresa, sanitizeInput, pruebasMedicasController.solicitarPruebaMedica);

/**
 * @route   GET /api/pruebas-medicas/mis-pruebas
 * @desc    Obtener mis pruebas médicas
 * @access  Privado (Candidato)
 */
router.get('/mis-pruebas', verificarToken, esCandidato, pruebasMedicasController.misPruebasMedicas);

/**
 * @route   GET /api/pruebas-medicas/candidato/:id_candidato
 * @desc    Obtener pruebas médicas de un candidato
 * @access  Privado (Empresa)
 */
router.get('/candidato/:id_candidato', verificarToken, esEmpresa, validateId('id_candidato'), pruebasMedicasController.pruebasMedicasCandidato);

/**
 * @route   PUT /api/pruebas-medicas/:id/resultado
 * @desc    Actualizar resultado de prueba médica
 * @access  Privado (Empresa)
 */
router.put('/:id/resultado', verificarToken, esEmpresa, validateId(), sanitizeInput, pruebasMedicasController.actualizarResultado);

/**
 * @route   DELETE /api/pruebas-medicas/:id
 * @desc    Eliminar prueba médica
 * @access  Privado (Empresa)
 */
router.delete('/:id', verificarToken, esEmpresa, validateId(), pruebasMedicasController.eliminarPruebaMedica);

module.exports = router;
