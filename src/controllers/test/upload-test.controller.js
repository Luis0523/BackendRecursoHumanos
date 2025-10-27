const { uploadFile, generateUniqueFileName, deleteFile, fileExists } = require('../../utils/firebase.util');
const { success, created, error: errorResponse } = require('../../utils/response.util');

/**
 * Test: Subir un archivo PDF a Firebase Storage
 * POST /api/test/upload
 */
const testUploadPdf = async (req, res) => {
  try {
    // El archivo viene del middleware multer
    const file = req.file;

    if (!file) {
      return errorResponse(res, 'No se proporcionó ningún archivo', 400);
    }

    console.log('📄 Archivo recibido:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    // Generar nombre único en carpeta 'test'
    const fileName = generateUniqueFileName(file.originalname, 'test');

    console.log('📤 Subiendo a Firebase Storage:', fileName);

    // Subir a Firebase Storage
    const uploadResult = await uploadFile(
      file.buffer,
      fileName,
      file.mimetype
    );

    console.log('✅ Archivo subido exitosamente');

    return created(res, 'Archivo PDF subido exitosamente a Firebase Storage', {
      fileName: uploadResult.fileName,
      url: uploadResult.url,
      size: uploadResult.size,
      sizeKB: `${(uploadResult.size / 1024).toFixed(2)} KB`,
      originalName: file.originalname,
    });
  } catch (err) {
    console.error('❌ Error al subir archivo:', err);
    return errorResponse(res, `Error al subir archivo: ${err.message}`, 500);
  }
};

/**
 * Test: Subir múltiples archivos PDF
 * POST /api/test/upload-multiple
 */
const testUploadMultiplePdfs = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return errorResponse(res, 'No se proporcionaron archivos', 400);
    }

    console.log(`📄 ${files.length} archivo(s) recibido(s)`);

    const uploadResults = [];

    // Subir cada archivo
    for (const file of files) {
      const fileName = generateUniqueFileName(file.originalname, 'test-multiple');

      console.log(`📤 Subiendo: ${file.originalname}`);

      const uploadResult = await uploadFile(
        file.buffer,
        fileName,
        file.mimetype
      );

      uploadResults.push({
        originalName: file.originalname,
        fileName: uploadResult.fileName,
        url: uploadResult.url,
        size: uploadResult.size,
      });
    }

    console.log(`✅ ${uploadResults.length} archivo(s) subido(s) exitosamente`);

    return created(res, `${uploadResults.length} archivo(s) subido(s) exitosamente`, {
      files: uploadResults,
      total: uploadResults.length,
    });
  } catch (err) {
    console.error('❌ Error al subir archivos:', err);
    return errorResponse(res, `Error al subir archivos: ${err.message}`, 500);
  }
};

/**
 * Test: Verificar si un archivo existe
 * GET /api/test/file-exists?fileName=test/uuid.pdf
 */
const testFileExists = async (req, res) => {
  try {
    const { fileName } = req.query;

    if (!fileName) {
      return errorResponse(res, 'Debes proporcionar el parámetro fileName', 400);
    }

    const exists = await fileExists(fileName);

    return success(res, 'Verificación completada', {
      fileName,
      exists,
      message: exists ? 'El archivo existe' : 'El archivo no existe',
    });
  } catch (err) {
    console.error('❌ Error al verificar archivo:', err);
    return errorResponse(res, `Error al verificar archivo: ${err.message}`, 500);
  }
};

/**
 * Test: Eliminar un archivo
 * DELETE /api/test/delete-file
 * Body: { "fileName": "test/uuid.pdf" }
 */
const testDeleteFile = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return errorResponse(res, 'Debes proporcionar el fileName en el body', 400);
    }

    console.log(`🗑️ Eliminando archivo: ${fileName}`);

    const deleted = await deleteFile(fileName);

    if (deleted) {
      console.log('✅ Archivo eliminado exitosamente');
      return success(res, 'Archivo eliminado exitosamente', {
        fileName,
        deleted: true,
      });
    } else {
      return errorResponse(res, 'No se pudo eliminar el archivo', 500);
    }
  } catch (err) {
    console.error('❌ Error al eliminar archivo:', err);
    return errorResponse(res, `Error al eliminar archivo: ${err.message}`, 500);
  }
};

/**
 * Test: Información del sistema de archivos
 * GET /api/test/info
 */
const testInfo = async (req, res) => {
  try {
    return success(res, 'Información del sistema de archivos', {
      bucket: process.env.FIREBASE_STORAGE_BUCKET,
      maxFileSize: `${(parseInt(process.env.MAX_FILE_SIZE) / 1024 / 1024).toFixed(2)} MB`,
      allowedTypes: process.env.ALLOWED_FILE_TYPES,
      configured: !!process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  testUploadPdf,
  testUploadMultiplePdfs,
  testFileExists,
  testDeleteFile,
  testInfo,
};
