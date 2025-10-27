const { VerificacionDocumento, Candidato, Postulacion, Usuario } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');

/**
 * Crear/subir un documento
 */
const subirDocumento = async (req, res) => {
    try {
        const { tipo_documento, nombre_documento, descripcion, archivo_url, es_obligatorio, id_postulacion } = req.body;

        // Obtener candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const nuevoDocumento = await VerificacionDocumento.create({
            id_candidato: candidato.id,
            id_postulacion,
            tipo_documento,
            nombre_documento,
            descripcion,
            archivo_url,
            es_obligatorio: es_obligatorio || false,
            fecha_subida: new Date(),
            estado_verificacion: 'pendiente'
        });

        return ResponseUtil.created(res, nuevoDocumento, 'Documento subido exitosamente');

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
 * Eliminar documento
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

        await documento.destroy();

        return ResponseUtil.success(res, null, 'Documento eliminado exitosamente');

    } catch (error) {
        console.error('Error al eliminar documento:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar documento', error);
    }
};

module.exports = {
    subirDocumento,
    obtenerDocumentosCandidato,
    misDocumentos,
    verificarDocumento,
    actualizarDocumento,
    eliminarDocumento
};
