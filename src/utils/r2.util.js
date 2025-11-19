const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

// Configuración del cliente S3 para Cloudflare R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Genera un nombre único para el archivo
 * @param {string} originalName - Nombre original del archivo
 * @param {string} prefix - Prefijo/carpeta (ej: 'cvs', 'reportes-medicos')
 * @returns {string} Nombre único del archivo
 */
const generateUniqueFileName = (originalName, prefix = '') => {
  const extension = originalName.split('.').pop();
  const uniqueName = `${crypto.randomUUID()}.${extension}`;
  return prefix ? `${prefix}/${uniqueName}` : uniqueName;
};

/**
 * Sube un archivo a Cloudflare R2
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} fileName - Nombre del archivo en R2
 * @param {string} contentType - Tipo MIME del archivo
 * @returns {Promise<Object>} Objeto con información del archivo subido
 */
const uploadFile = async (fileBuffer, fileName, contentType = 'application/pdf') => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    return {
      success: true,
      fileName: fileName,
      url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
      size: fileBuffer.length,
    };
  } catch (error) {
    console.error('Error al subir archivo a R2:', error);
    throw new Error('Error al subir archivo a almacenamiento en la nube');
  }
};

/**
 * Genera una URL firmada temporal para descargar un archivo privado
 * @param {string} fileName - Nombre del archivo en R2
 * @param {number} expiresIn - Tiempo de expiración en segundos (default: 1 hora)
 * @returns {Promise<string>} URL firmada
 */
const getSignedDownloadUrl = async (fileName, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Error al generar URL firmada:', error);
    throw new Error('Error al generar enlace de descarga');
  }
};

/**
 * Elimina un archivo de R2
 * @param {string} fileName - Nombre del archivo en R2
 * @returns {Promise<boolean>} true si se eliminó exitosamente
 */
const deleteFile = async (fileName) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo de R2:', error);
    throw new Error('Error al eliminar archivo de almacenamiento');
  }
};

/**
 * Extrae el nombre del archivo de una URL completa
 * @param {string} url - URL completa del archivo
 * @returns {string} Nombre del archivo (key en R2)
 */
const extractFileNameFromUrl = (url) => {
  if (!url) return null;

  // Si es una URL completa, extraer solo el path
  if (url.includes('r2.cloudflarestorage.com')) {
    const urlParts = url.split('/');
    return urlParts.slice(3).join('/'); // Obtiene todo después del dominio
  }

  // Si ya es solo el nombre/path del archivo
  return url;
};

/**
 * Valida que el archivo sea un PDF
 * @param {Object} file - Objeto file de multer
 * @returns {boolean} true si es válido
 */
const validatePdfFile = (file) => {
  const allowedMimeTypes = ['application/pdf'];
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // 5MB default

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Solo se permiten archivos PDF');
  }

  if (file.size > maxSize) {
    throw new Error(`El archivo excede el tamaño máximo permitido de ${maxSize / 1024 / 1024}MB`);
  }

  return true;
};

module.exports = {
  r2Client,
  uploadFile,
  getSignedDownloadUrl,
  deleteFile,
  generateUniqueFileName,
  extractFileNameFromUrl,
  validatePdfFile,
};
