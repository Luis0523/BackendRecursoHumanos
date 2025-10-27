const express = require('express');
const router = express.Router();
const documentosController = require('../../controllers/documentos/documentos.controller');
const { verificarToken, esCandidato, esEmpresa, esAdministrador } = require('../../middlewares/auth.middleware');
const { validateId, sanitizeInput } = require('../../middlewares/validation.middleware');
const { uploadSinglePdf } = require('../../middlewares/multer.middleware');

/**
 * @route   POST /api/documentos
 * @desc    Crear y subir un documento con archivo PDF
 * @access  Privado (Candidato)
 */
router.post('/', verificarToken, esCandidato, uploadSinglePdf('documento'), documentosController.subirDocumento);

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
 * @desc    Eliminar documento (y su archivo)
 * @access  Privado (Candidato)
 */
router.delete('/:id', verificarToken, esCandidato, validateId(), documentosController.eliminarDocumento);

/**
 * @route   PUT /api/documentos/:id/archivo
 * @desc    Actualizar archivo de un documento existente
 * @access  Privado (Candidato)
 */
router.put('/:id/archivo', verificarToken, esCandidato, validateId(), uploadSinglePdf('documento'), documentosController.actualizarArchivoDocumento);

/**
 * @route   DELETE /api/documentos/:id/archivo
 * @desc    Eliminar solo el archivo de un documento (mantiene el registro)
 * @access  Privado (Candidato)
 */
router.delete('/:id/archivo', verificarToken, esCandidato, validateId(), documentosController.eliminarArchivoDocumento);

module.exports = router;
