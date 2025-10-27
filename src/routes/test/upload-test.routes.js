const express = require('express');
const router = express.Router();
const { uploadSinglePdf, uploadMultiplePdfs } = require('../../middlewares/multer.middleware');
const {
  testUploadPdf,
  testUploadMultiplePdfs,
  testFileExists,
  testDeleteFile,
  testInfo,
} = require('../../controllers/test/upload-test.controller');

/**
 * @route   GET /api/test/info
 * @desc    Obtener información de la configuración de Firebase Storage
 * @access  Public (para testing)
 */
router.get('/info', testInfo);

/**
 * @route   POST /api/test/upload
 * @desc    Test: Subir un archivo PDF a Firebase Storage
 * @access  Public (para testing)
 * @body    Form-data con campo "file" conteniendo el PDF
 */
router.post('/upload', uploadSinglePdf('file'), testUploadPdf);

/**
 * @route   POST /api/test/upload-multiple
 * @desc    Test: Subir múltiples archivos PDF
 * @access  Public (para testing)
 * @body    Form-data con campo "files" conteniendo los PDFs
 */
router.post('/upload-multiple', uploadMultiplePdfs('files', 5), testUploadMultiplePdfs);

/**
 * @route   GET /api/test/file-exists
 * @desc    Test: Verificar si un archivo existe en Storage
 * @access  Public (para testing)
 * @query   fileName - Nombre del archivo en Storage (ej: test/uuid.pdf)
 */
router.get('/file-exists', testFileExists);

/**
 * @route   DELETE /api/test/delete-file
 * @desc    Test: Eliminar un archivo de Storage
 * @access  Public (para testing)
 * @body    { "fileName": "test/uuid.pdf" }
 */
router.delete('/delete-file', testDeleteFile);

module.exports = router;
