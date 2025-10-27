const express = require('express');
const router = express.Router();
const documentosController = require('../../controllers/documentos/documentos.controller');
const { verificarToken, esCandidato, esEmpresa, esAdministrador } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');

/**
 * @route   POST /api/documentos
 * @desc    Subir un documento
 * @access  Privado (Candidato)
 */
router.post('/', verificarToken, esCandidato, sanitizeInput, documentosController.subirDocumento);

/**
 * @route   GET /api/documentos/mis-documentos
 * @desc    Obtener mis documentos
 * @access  Privado (Candidato)
 */
router.get('/mis-documentos', verificarToken, esCandidato, documentosController.misDocumentos);

/**
 * @route   GET /api/documentos/candidato/:id_candidato
 * @desc    Obtener documentos de un candidato
 * @access  Privado (Empresa o Admin)
 */
router.get('/candidato/:id_candidato', verificarToken, validateId('id_candidato'), documentosController.obtenerDocumentosCandidato);

/**
 * @route   PUT /api/documentos/:id/verificar
 * @desc    Verificar un documento
 * @access  Privado (Empresa o Admin)
 */
router.put('/:id/verificar', verificarToken, validateId(), sanitizeInput, documentosController.verificarDocumento);

/**
 * @route   PUT /api/documentos/:id
 * @desc    Actualizar documento
 * @access  Privado (Candidato)
 */
router.put('/:id', verificarToken, esCandidato, validateId(), sanitizeInput, documentosController.actualizarDocumento);

/**
 * @route   DELETE /api/documentos/:id
 * @desc    Eliminar documento
 * @access  Privado (Candidato)
 */
router.delete('/:id', verificarToken, esCandidato, validateId(), documentosController.eliminarDocumento);

module.exports = router;
