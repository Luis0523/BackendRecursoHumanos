const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Inicializar Firebase Admin con las credenciales
let firebaseInitialized = false;

const initializeFirebase = () => {
  if (firebaseInitialized) return;

  try {
    let serviceAccount;
    
    // Intentar cargar credenciales desde variable de entorno primero (Railway)
    if (process.env.FIREBASE_CREDENTIALS) {
      console.log('📦 Cargando credenciales de Firebase desde variable de entorno...');
      serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    } else {
      // Si no existe la variable, cargar desde archivo local (desarrollo)
      console.log('📦 Cargando credenciales de Firebase desde archivo local...');
      serviceAccount = require('../../firebase-credentials.json');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    firebaseInitialized = true;
    console.log('✓ Firebase Storage inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Firebase:', error.message);
    throw new Error('No se pudo inicializar Firebase Storage. Verifica las credenciales.');
  }
};

// Obtener referencia al bucket de Storage
const getBucket = () => {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  return admin.storage().bucket();
};

/**
 * Genera un nombre único para el archivo
 * @param {string} originalName - Nombre original del archivo
 * @param {string} folder - Carpeta/prefijo (ej: 'cvs', 'reportes', 'documentos')
 * @returns {string} Nombre único del archivo con carpeta
 */
const generateUniqueFileName = (originalName, folder = '') => {
  const extension = originalName.split('.').pop();
  const uniqueName = `${uuidv4()}.${extension}`;
  return folder ? `${folder}/${uniqueName}` : uniqueName;
};

/**
 * Sube un archivo PDF a Firebase Storage
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} fileName - Nombre del archivo en Storage (con carpeta)
 * @param {string} contentType - Tipo MIME del archivo
 * @returns {Promise<Object>} Objeto con información del archivo subido
 */
const uploadFile = async (fileBuffer, fileName, contentType = 'application/pdf') => {
  try {
    const bucket = getBucket();
    const file = bucket.file(fileName);

    // Subir archivo con metadata
    await file.save(fileBuffer, {
      contentType: contentType,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(), // Token para URL pública
      },
    });

    // Hacer el archivo público (opcional, puedes comentar esta línea si quieres archivos privados)
    await file.makePublic();

    // Obtener URL pública
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return {
      success: true,
      fileName: fileName,
      url: publicUrl,
      size: fileBuffer.length,
    };
  } catch (error) {
    console.error('Error al subir archivo a Firebase Storage:', error);
    throw new Error('Error al subir archivo a Firebase Storage');
  }
};

/**
 * Genera una URL firmada temporal para descargar un archivo privado
 * @param {string} fileName - Nombre del archivo en Storage
 * @param {number} expiresInMinutes - Tiempo de expiración en minutos (default: 60)
 * @returns {Promise<string>} URL firmada
 */
const getSignedDownloadUrl = async (fileName, expiresInMinutes = 60) => {
  try {
    const bucket = getBucket();
    const file = bucket.file(fileName);

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });

    return signedUrl;
  } catch (error) {
    console.error('Error al generar URL firmada:', error);
    throw new Error('Error al generar enlace de descarga');
  }
};

/**
 * Elimina un archivo de Firebase Storage
 * @param {string} fileName - Nombre del archivo en Storage
 * @returns {Promise<boolean>} true si se eliminó exitosamente
 */
const deleteFile = async (fileName) => {
  try {
    const bucket = getBucket();
    const file = bucket.file(fileName);

    await file.delete();
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo de Firebase Storage:', error);
    throw new Error('Error al eliminar archivo de almacenamiento');
  }
};

/**
 * Extrae el nombre del archivo de una URL completa de Firebase Storage
 * @param {string} url - URL completa del archivo
 * @returns {string} Nombre del archivo (path en Storage)
 */
const extractFileNameFromUrl = (url) => {
  if (!url) return null;

  // Si es una URL de Firebase Storage
  if (url.includes('storage.googleapis.com')) {
    const urlParts = url.split('/');
    const bucketIndex = urlParts.indexOf(urlParts.find(part => part.includes('.appspot.com')));
    return urlParts.slice(bucketIndex + 1).join('/');
  }

  // Si ya es solo el nombre/path del archivo
  return url;
};

/**
 * Valida que el archivo sea un PDF y cumpla con los requisitos
 * @param {Object} file - Objeto file de multer
 * @returns {boolean} true si es válido
 */
const validatePdfFile = (file) => {
  const allowedMimeTypes = ['application/pdf'];
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB default

  if (!file) {
    throw new Error('No se proporcionó ningún archivo');
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Solo se permiten archivos PDF');
  }

  if (file.size > maxSize) {
    throw new Error(`El archivo excede el tamaño máximo permitido de ${maxSize / 1024 / 1024}MB`);
  }

  return true;
};

/**
 * Verifica si un archivo existe en Firebase Storage
 * @param {string} fileName - Nombre del archivo
 * @returns {Promise<boolean>} true si existe
 */
const fileExists = async (fileName) => {
  try {
    const bucket = getBucket();
    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    console.error('Error al verificar existencia del archivo:', error);
    return false;
  }
};

/**
 * Obtiene metadata de un archivo
 * @param {string} fileName - Nombre del archivo
 * @returns {Promise<Object>} Metadata del archivo
 */
const getFileMetadata = async (fileName) => {
  try {
    const bucket = getBucket();
    const file = bucket.file(fileName);
    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error('Error al obtener metadata del archivo:', error);
    throw new Error('Error al obtener información del archivo');
  }
};

module.exports = {
  initializeFirebase,
  uploadFile,
  getSignedDownloadUrl,
  deleteFile,
  generateUniqueFileName,
  extractFileNameFromUrl,
  validatePdfFile,
  fileExists,
  getFileMetadata,
};
