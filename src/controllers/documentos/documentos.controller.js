const { VerificacionDocumento, Candidato, Postulacion, Usuario } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const { uploadFile, generateUniqueFileName, deleteFile, extractFileNameFromUrl } = require('../../utils/firebase.util');

/**
 * Crear y subir un documento con archivo PDF
 * POST /api/documentos
 */
const subirDocumento = async (req, res) => {
    try {
        const { tipo_documento, nombre_documento, descripcion, es_obligatorio, id_postulacion } = req.body;

        // Obtener candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        // El archivo viene del middleware multer
        const file = req.file;

        if (!file) {
            return ResponseUtil.badRequest(res, 'Debes proporcionar un archivo PDF');
        }

        // Generar nombre único en carpeta 'documentos/{tipo_documento}'
        const folder = `documentos/${tipo_documento}`;
        const fileName = generateUniqueFileName(file.originalname, folder);

        console.log('Subiendo documento:', fileName);

        // Subir a Firebase Storage
        const uploadResult = await uploadFile(
            file.buffer,
            fileName,
            file.mimetype
        );

        const nuevoDocumento = await VerificacionDocumento.create({
            id_candidato: candidato.id,
            id_postulacion,
            tipo_documento,
            nombre_documento,
            descripcion,
            archivo_url: uploadResult.url,
            es_obligatorio: es_obligatorio || false,
            fecha_subida: new Date(),
            estado_verificacion: 'pendiente'
        });

        console.log('Documento creado exitosamente:', nuevoDocumento.id);

        return ResponseUtil.created(res, {
            ...nuevoDocumento.toJSON(),
            file_info: {
                fileName: uploadResult.fileName,
                size: uploadResult.size,
                originalName: file.originalname
            }
        }, 'Documento subido exitosamente');

    } catch (error) {
        console.error('Error al subir documento:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener documentos de un candidato (empresa o admin)
 */
const obtenerDocumentosCandidato = async (req, res) => {
    try {
        const { id_candidato } = req.params;

        const documentos = await VerificacionDocumento.findAll({
            where: { id_candidato },
            include: [{
                model: Usuario,
                as: 'verificador',
                attributes: ['nombre', 'email']
            }],
            order: [['fecha_subida', 'DESC']]
        });

        return ResponseUtil.success(res, documentos, 'Documentos obtenidos exitosamente');

    } catch (error) {
        console.error('Error al obtener documentos:', error);
        return ResponseUtil.serverError(res, 'Error al obtener documentos', error);
    }
};

/**
 * Obtener mis documentos (candidato)
 */
const misDocumentos = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const documentos = await VerificacionDocumento.findAll({
            where: { id_candidato: candidato.id },
            order: [['fecha_subida', 'DESC']]
        });

        return ResponseUtil.success(res, documentos, 'Documentos obtenidos exitosamente');

    } catch (error) {
        console.error('Error al obtener documentos:', error);
        return ResponseUtil.serverError(res, 'Error al obtener documentos', error);
    }
};

/**
 * Verificar un documento (empresa o admin)
 */
const verificarDocumento = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_verificacion, observaciones, motivo_rechazo } = req.body;

        const documento = await VerificacionDocumento.findByPk(id);
        if (!documento) {
            return ResponseUtil.notFound(res, 'Documento no encontrado');
        }

        await documento.update({
            estado_verificacion,
            observaciones,
            motivo_rechazo,
            fecha_verificacion: new Date(),
            verificado_por: req.userId
        });

        return ResponseUtil.success(res, documento, 'Documento verificado exitosamente');

    } catch (error) {
        console.error('Error al verificar documento:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Actualizar documento (candidato)
 */
const actualizarDocumento = async (req, res) => {
    try {
        const { id } = req.params;

        const documento = await VerificacionDocumento.findByPk(id);
        if (!documento) {
            return ResponseUtil.notFound(res, 'Documento no encontrado');
        }

        // Verificar que el documento pertenezca al candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato || documento.id_candidato !== candidato.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para actualizar este documento');
        }

        await documento.update(req.body);

        return ResponseUtil.success(res, documento, 'Documento actualizado exitosamente');

    } catch (error) {
        console.error('Error al actualizar documento:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Eliminar documento (y su archivo)
 */
const eliminarDocumento = async (req, res) => {
    try {
        const { id } = req.params;

        const documento = await VerificacionDocumento.findByPk(id);
        if (!documento) {
            return ResponseUtil.notFound(res, 'Documento no encontrado');
        }

        // Verificar permisos
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato || documento.id_candidato !== candidato.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para eliminar este documento');
        }

        // Eliminar archivo de Firebase Storage si existe
        if (documento.archivo_url) {
            try {
                const fileName = extractFileNameFromUrl(documento.archivo_url);
                await deleteFile(fileName);
                console.log('Archivo eliminado de Storage:', fileName);
            } catch (deleteError) {
                console.error('Error al eliminar archivo:', deleteError);
                // Continuar con la eliminación del registro aunque falle el archivo
            }
        }

        await documento.destroy();

        return ResponseUtil.success(res, null, 'Documento eliminado exitosamente');

    } catch (error) {
        console.error('Error al eliminar documento:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar documento', error);
    }
};

/**
 * Actualizar archivo de un documento existente
 * PUT /api/documentos/:id/archivo
 */
const actualizarArchivoDocumento = async (req, res) => {
    try {
        const { id } = req.params;

        const documento = await VerificacionDocumento.findByPk(id);
        if (!documento) {
            return ResponseUtil.notFound(res, 'Documento no encontrado');
        }

        // Verificar permisos
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato || documento.id_candidato !== candidato.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para actualizar este documento');
        }

        const file = req.file;

        if (!file) {
            return ResponseUtil.badRequest(res, 'Debes proporcionar un archivo PDF');
        }

        // Si ya tenía un archivo, eliminar el anterior
        if (documento.archivo_url) {
            try {
                const oldFileName = extractFileNameFromUrl(documento.archivo_url);
                await deleteFile(oldFileName);
                console.log('Archivo anterior eliminado:', oldFileName);
            } catch (deleteError) {
                console.error('Error al eliminar archivo anterior:', deleteError);
            }
        }

        // Generar nombre único
        const folder = `documentos/${documento.tipo_documento}`;
        const fileName = generateUniqueFileName(file.originalname, folder);

        console.log('Subiendo nuevo archivo:', fileName);

        // Subir nuevo archivo
        const uploadResult = await uploadFile(
            file.buffer,
            fileName,
            file.mimetype
        );

        // Actualizar documento
        await documento.update({
            archivo_url: uploadResult.url,
            fecha_subida: new Date(),
            estado_verificacion: 'pendiente' // Resetear estado porque subió nuevo archivo
        });

        console.log('Archivo actualizado para documento:', documento.id);

        return ResponseUtil.success(res, {
            ...documento.toJSON(),
            file_info: {
                fileName: uploadResult.fileName,
                size: uploadResult.size,
                originalName: file.originalname
            }
        }, 'Archivo actualizado exitosamente');

    } catch (error) {
        console.error('Error al actualizar archivo:', error);
        return ResponseUtil.serverError(res, 'Error al actualizar archivo', error);
    }
};

/**
 * Eliminar solo el archivo de un documento (mantiene el registro)
 * DELETE /api/documentos/:id/archivo
 */
const eliminarArchivoDocumento = async (req, res) => {
    try {
        const { id } = req.params;

        const documento = await VerificacionDocumento.findByPk(id);
        if (!documento) {
            return ResponseUtil.notFound(res, 'Documento no encontrado');
        }

        // Verificar permisos
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato || documento.id_candidato !== candidato.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para modificar este documento');
        }

        if (!documento.archivo_url) {
            return ResponseUtil.badRequest(res, 'Este documento no tiene archivo adjunto');
        }

        // Eliminar archivo de Firebase Storage
        const fileName = extractFileNameFromUrl(documento.archivo_url);
        await deleteFile(fileName);

        // Actualizar registro
        await documento.update({
            archivo_url: null,
            fecha_subida: null,
            estado_verificacion: 'pendiente'
        });

        console.log('Archivo eliminado para documento:', documento.id);

        return ResponseUtil.success(res, documento, 'Archivo eliminado exitosamente');

    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar archivo', error);
    }
};

module.exports = {
    subirDocumento,
    obtenerDocumentosCandidato,
    misDocumentos,
    verificarDocumento,
    actualizarDocumento,
    eliminarDocumento,
    actualizarArchivoDocumento,
    eliminarArchivoDocumento
};
