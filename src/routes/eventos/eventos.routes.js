const express = require('express');
const router = express.Router();
const eventosController = require('../../controllers/eventos/eventos.controller');
const { verificarToken, esCandidato, esEmpresa } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

/**
 * @route   POST /api/eventos
 * @desc    Crear evento
 * @access  Privado
 */
router.post('/', verificarToken, sanitizeInput, eventosController.crearEvento);

/**
 * @route   GET /api/eventos
 * @desc    Obtener todos los eventos (con filtros)
 * @access  Privado
 */
router.get('/', verificarToken, eventosController.obtenerEventos);

/**
 * @route   GET /api/eventos/mis-eventos
 * @desc    Obtener mis eventos
 * @access  Privado (Candidato)
 */
router.get('/mis-eventos', verificarToken, esCandidato, eventosController.misEventos);

/**
 * @route   GET /api/eventos/empresa
 * @desc    Obtener eventos de mi empresa
 * @access  Privado (Empresa)
 */
router.get('/empresa', verificarToken, esEmpresa, eventosController.eventosPorEmpresa);

/**
 * @route   PUT /api/eventos/:id
 * @desc    Actualizar evento
 * @access  Privado
 */
router.put('/:id', verificarToken, validateId(), sanitizeInput, eventosController.actualizarEvento);

/**
 * @route   PATCH /api/eventos/:id/estado
 * @desc    Cambiar estado del evento
 * @access  Privado
 */
router.patch('/:id/estado', verificarToken, validateId(), sanitizeInput, eventosController.cambiarEstadoEvento);

/**
 * @route   DELETE /api/eventos/:id
 * @desc    Eliminar evento
 * @access  Privado
 */
router.delete('/:id', verificarToken, validateId(), eventosController.eliminarEvento);

module.exports = router;
