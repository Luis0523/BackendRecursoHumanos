const express = require('express');
const router = express.Router();
const pruebasTecnicasController = require('../../controllers/pruebas-tecnicas/pruebas-tecnicas.controller');
const { verificarToken, esCandidato, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');
const { uploadSinglePdf } = require('../../middlewares/multer.middleware');

/**
 * @route   POST /api/pruebas-tecnicas
 * @desc    Asignar prueba técnica
 * @access  Privado (Empresa)
 */
router.post('/', verificarToken, esEmpresa, sanitizeInput, pruebasTecnicasController.asignarPruebaTecnica);

/**
 * @route   GET /api/pruebas-tecnicas
 * @desc    Obtener todas las pruebas técnicas de la empresa
 * @access  Privado (Empresa)
 */
router.get('/', verificarToken, esEmpresa, pruebasTecnicasController.todasPruebasTecnicas);

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

/**
 * @route   POST /api/pruebas-tecnicas/:id/instrucciones
 * @desc    Subir archivo de instrucciones para una prueba técnica
 * @access  Privado (Empresa)
 */
router.post('/:id/instrucciones', verificarToken, esEmpresa, validateId(), uploadSinglePdf('instrucciones'), pruebasTecnicasController.subirInstrucciones);

/**
 * @route   POST /api/pruebas-tecnicas/:id/respuesta
 * @desc    Subir archivo de respuesta para una prueba técnica
 * @access  Privado (Candidato)
 */
router.post('/:id/respuesta', verificarToken, esCandidato, validateId(), uploadSinglePdf('respuesta'), pruebasTecnicasController.subirRespuesta);

/**
 * @route   POST /api/pruebas-tecnicas/:id/evaluacion
 * @desc    Subir PDF de evaluación con resultados
 * @access  Privado (Empresa)
 */
router.post('/:id/evaluacion', verificarToken, esEmpresa, validateId(), uploadSinglePdf('evaluacion'), pruebasTecnicasController.subirEvaluacion);

module.exports = router;
