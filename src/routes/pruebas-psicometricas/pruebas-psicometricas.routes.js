const express = require('express');
const router = express.Router();
const pruebasController = require('../../controllers/pruebas-psicometricas/pruebas.controller');
const { verificarToken, esCandidato, esEmpresa, esAdministrador } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

/**
 * @route   POST /api/pruebas-psicometricas
 * @desc    Crear una prueba psicométrica
 * @access  Privado (Admin o Empresa)
 */
router.post('/', verificarToken, sanitizeInput, pruebasController.crearPrueba);

/**
 * @route   GET /api/pruebas-psicometricas
 * @desc    Obtener todas las pruebas disponibles
 * @access  Privado
 */
router.get('/', verificarToken, pruebasController.obtenerPruebas);

/**
 * @route   GET /api/pruebas-psicometricas/:id
 * @desc    Obtener una prueba completa con preguntas
 * @access  Privado
 */
router.get('/:id', verificarToken, validateId(), pruebasController.obtenerPruebaCompleta);

/**
 * @route   PUT /api/pruebas-psicometricas/:id
 * @desc    Actualizar una prueba
 * @access  Privado (Admin o Empresa)
 */
router.put('/:id', verificarToken, validateId(), sanitizeInput, pruebasController.actualizarPrueba);

/**
 * @route   DELETE /api/pruebas-psicometricas/:id
 * @desc    Eliminar una prueba
 * @access  Privado (Admin o Empresa)
 */
router.delete('/:id', verificarToken, validateId(), pruebasController.eliminarPrueba);

/**
 * @route   POST /api/pruebas-psicometricas/preguntas
 * @desc    Crear una pregunta para una prueba
 * @access  Privado (Admin o Empresa)
 */
router.post('/preguntas', verificarToken, sanitizeInput, pruebasController.crearPregunta);

/**
 * @route   PUT /api/pruebas-psicometricas/preguntas/:id
 * @desc    Actualizar una pregunta
 * @access  Privado (Admin o Empresa)
 */
router.put('/preguntas/:id', verificarToken, validateId(), sanitizeInput, pruebasController.actualizarPregunta);

/**
 * @route   DELETE /api/pruebas-psicometricas/preguntas/:id
 * @desc    Eliminar una pregunta
 * @access  Privado (Admin o Empresa)
 */
router.delete('/preguntas/:id', verificarToken, validateId(), pruebasController.eliminarPregunta);

/**
 * @route   POST /api/pruebas-psicometricas/asignar
 * @desc    Asignar prueba a un candidato
 * @access  Privado (Empresa)
 */
router.post('/asignar', verificarToken, esEmpresa, sanitizeInput, pruebasController.asignarPrueba);

/**
 * @route   GET /api/pruebas-psicometricas/mis-asignaciones
 * @desc    Obtener pruebas asignadas a mí
 * @access  Privado (Candidato)
 */
router.get('/mis-asignaciones', verificarToken, esCandidato, pruebasController.misPruebasAsignadas);

/**
 * @route   POST /api/pruebas-psicometricas/iniciar/:id_asignacion
 * @desc    Iniciar una prueba
 * @access  Privado (Candidato)
 */
router.post('/iniciar/:id_asignacion', verificarToken, esCandidato, validateId('id_asignacion'), pruebasController.iniciarPrueba);

/**
 * @route   POST /api/pruebas-psicometricas/respuesta
 * @desc    Guardar respuesta de candidato
 * @access  Privado (Candidato)
 */
router.post('/respuesta', verificarToken, esCandidato, sanitizeInput, pruebasController.guardarRespuesta);

/**
 * @route   POST /api/pruebas-psicometricas/finalizar/:id_asignacion
 * @desc    Finalizar prueba y calcular resultado
 * @access  Privado (Candidato)
 */
router.post('/finalizar/:id_asignacion', verificarToken, esCandidato, validateId('id_asignacion'), pruebasController.finalizarPrueba);

/**
 * @route   GET /api/pruebas-psicometricas/resultado/:id_asignacion
 * @desc    Obtener resultado de una prueba
 * @access  Privado
 */
router.get('/resultado/:id_asignacion', verificarToken, validateId('id_asignacion'), pruebasController.obtenerResultado);

module.exports = router;
