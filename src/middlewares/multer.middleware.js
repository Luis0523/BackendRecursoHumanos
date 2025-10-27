const multer = require('multer');
const { validatePdfFile } = require('../utils/firebase.util');

// Configuración de multer para manejar archivos en memoria
const storage = multer.memoryStorage();

// Filtro para aceptar solo PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false);
  }
};

// Configuración base de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB default
  },
});

/**
 * Middleware para subir un solo archivo PDF
 * @param {string} fieldName - Nombre del campo en el formulario
 */
const uploadSinglePdf = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Error de Multer
        if (err.code === 'LIMIT_FILE_SIZE') {
          const maxSizeMB = (parseInt(process.env.MAX_FILE_SIZE) || 10485760) / 1024 / 1024;
          return res.status(400).json({
            success: false,
            message: `El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB`,
          });
        }
        return res.status(400).json({
          success: false,
          message: `Error al subir archivo: ${err.message}`,
        });
      } else if (err) {
        // Otro tipo de error
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Si se requiere archivo pero no se envió
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionó ningún archivo PDF',
        });
      }

      // Validación adicional del archivo
      try {
        validatePdfFile(req.file);
        next();
      } catch (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
    });
  };
};

/**
 * Middleware para subir múltiples archivos PDF
 * @param {string} fieldName - Nombre del campo en el formulario
 * @param {number} maxCount - Número máximo de archivos (default: 5)
 */
const uploadMultiplePdfs = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);

    multipleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Error de Multer
        if (err.code === 'LIMIT_FILE_SIZE') {
          const maxSizeMB = (parseInt(process.env.MAX_FILE_SIZE) || 10485760) / 1024 / 1024;
          return res.status(400).json({
            success: false,
            message: `Uno o más archivos exceden el tamaño máximo permitido de ${maxSizeMB}MB`,
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: `Se excedió el número máximo de archivos permitidos (${maxCount})`,
          });
        }
        return res.status(400).json({
          success: false,
          message: `Error al subir archivos: ${err.message}`,
        });
      } else if (err) {
        // Otro tipo de error
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Si se requiere archivos pero no se enviaron
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionaron archivos PDF',
        });
      }

      // Validación adicional de todos los archivos
      try {
        req.files.forEach(file => validatePdfFile(file));
        next();
      } catch (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
    });
  };
};

/**
 * Middleware opcional para archivos PDF (no es requerido)
 * @param {string} fieldName - Nombre del campo en el formulario
 */
const uploadOptionalPdf = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const maxSizeMB = (parseInt(process.env.MAX_FILE_SIZE) || 10485760) / 1024 / 1024;
          return res.status(400).json({
            success: false,
            message: `El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB`,
          });
        }
        return res.status(400).json({
          success: false,
          message: `Error al subir archivo: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Si hay archivo, validarlo
      if (req.file) {
        try {
          validatePdfFile(req.file);
        } catch (validationError) {
          return res.status(400).json({
            success: false,
            message: validationError.message,
          });
        }
      }

      // Continuar aunque no haya archivo (es opcional)
      next();
    });
  };
};

module.exports = {
  uploadSinglePdf,
  uploadMultiplePdfs,
  uploadOptionalPdf,
};
