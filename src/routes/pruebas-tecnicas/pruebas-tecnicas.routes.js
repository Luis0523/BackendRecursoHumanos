const express = require('express');
const router = express.Router();
const pruebasTecnicasController = require('../../controllers/pruebas-tecnicas/pruebas-tecnicas.controller');
const { verificarToken, esCandidato, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

/**
 * @route   POST /api/pruebas-tecnicas
 * @desc    Asignar prueba técnica
 * @access  Privado (Empresa)
 */
router.post('/', verificarToken, esEmpresa, sanitizeInput, pruebasTecnicasController.asignarPruebaTecnica);

/**
 * @route   GET /api/pruebas-tecnicas/mis-pruebas
 * @desc    Obtener mis pruebas técnicas
 * @access  Privado (Candidato)
 */
router.get('/mis-pruebas', verificarToken, esCandidato, pruebasTecnicasController.misPruebasTecnicas);

/**
 * @route   GET /api/pruebas-tecnicas/candidato/:id_candidato
 * @desc    Obtener pruebas técnicas de un candidato
 * @access  Privado (Empresa)
 */
router.get('/candidato/:id_candidato', verificarToken, esEmpresa, validateId('id_candidato'), pruebasTecnicasController.pruebasTecnicasCandidato);

/**
 * @route   PUT /api/pruebas-tecnicas/:id/entregar
 * @desc    Entregar prueba técnica
 * @access  Privado (Candidato)
 */
router.put('/:id/entregar', verificarToken, esCandidato, validateId(), sanitizeInput, pruebasTecnicasController.entregarPrueba);

/**
 * @route   PUT /api/pruebas-tecnicas/:id/evaluar
 * @desc    Evaluar prueba técnica
 * @access  Privado (Empresa)
 */
router.put('/:id/evaluar', verificarToken, esEmpresa, validateId(), sanitizeInput, pruebasTecnicasController.evaluarPrueba);

module.exports = router;
