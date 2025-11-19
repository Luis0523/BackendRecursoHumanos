const { PruebaMedica, Candidato, Postulacion, Vacante, Empresa } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const { uploadFile, generateUniqueFileName, deleteFile, extractFileNameFromUrl } = require('../../utils/firebase.util');

/**
 * Solicitar prueba médica (empresa)
 */
const solicitarPruebaMedica = async (req, res) => {
    try {
        const { id_candidato, id_postulacion, id_vacante, tipo_prueba, nombre_prueba, descripcion } = req.body;

        const nuevaPrueba = await PruebaMedica.create({
            id_candidato,
            id_postulacion,
            id_vacante,
            tipo_prueba,
            nombre_prueba,
            descripcion,
            fecha_solicitud: new Date(),
            estado: 'pendiente',
            resultado: 'pendiente'
        });

        return ResponseUtil.created(res, nuevaPrueba, 'Prueba médica solicitada exitosamente');

    } catch (error) {
        console.error('Error al solicitar prueba médica:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener todas las pruebas médicas de la empresa
 */
const todasPruebasMedicas = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        // Obtener todas las vacantes de la empresa para filtrar pruebas
        const vacantes = await Vacante.findAll({
            where: { id_empresa: empresa.id },
            attributes: ['id']
        });

        const idsVacantes = vacantes.map(v => v.id);

        const pruebas = await PruebaMedica.findAll({
            where: {
                [require('sequelize').Op.or]: [
                    { id_vacante: { [require('sequelize').Op.in]: idsVacantes } }
                ]
            },
            include: [
                {
                    model: Candidato,
                    as: 'candidato',
                    include: [{
                        model: require('../../models').Usuario,
                        as: 'usuario',
                        attributes: ['nombre', 'email']
                    }]
                },
                {
                    model: Vacante,
                    as: 'vacante',
                    attributes: ['titulo']
                }
            ],
            order: [['fecha_solicitud', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas médicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas médicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas médicas', error);
    }
};

/**
 * Obtener mis pruebas médicas (candidato)
 */
const misPruebasMedicas = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const pruebas = await PruebaMedica.findAll({
            where: { id_candidato: candidato.id },
            include: [
                {
                    model: Vacante,
                    as: 'vacante',
                    attributes: ['titulo'],
                    include: [{
                        model: Empresa,
                        as: 'empresa',
                        attributes: ['nombre_empresa']
                    }]
                }
            ],
            order: [['fecha_solicitud', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas médicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas médicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas médicas', error);
    }
};

/**
 * Obtener pruebas médicas de un candidato (empresa)
 */
const pruebasMedicasCandidato = async (req, res) => {
    try {
        const { id_candidato } = req.params;

        const pruebas = await PruebaMedica.findAll({
            where: { id_candidato },
            order: [['fecha_solicitud', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas médicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas médicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas médicas', error);
    }
};

/**
 * Actualizar resultado de prueba médica
 */
const actualizarResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            fecha_realizacion,
            fecha_resultado,
            resultado,
            porcentaje_aptitud,
            observaciones,
            restricciones,
            medico_responsable,
            institucion_medica,
            documento_resultado_url,
            valido_hasta
        } = req.body;

        const prueba = await PruebaMedica.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba médica no encontrada');
        }

        await prueba.update({
            fecha_realizacion,
            fecha_resultado,
            resultado,
            porcentaje_aptitud,
            observaciones,
            restricciones,
            medico_responsable,
            institucion_medica,
            documento_resultado_url,
            estado: 'resultado_recibido',
            valido_hasta
        });

        return ResponseUtil.success(res, prueba, 'Resultado actualizado exitosamente');

    } catch (error) {
        console.error('Error al actualizar resultado:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Eliminar prueba médica (y su archivo)
 */
const eliminarPruebaMedica = async (req, res) => {
    try {
        const { id } = req.params;

        const prueba = await PruebaMedica.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba médica no encontrada');
        }

        // Eliminar archivo de Firebase Storage si existe
        if (prueba.documento_resultado_url) {
            try {
                const fileName = extractFileNameFromUrl(prueba.documento_resultado_url);
                await deleteFile(fileName);
                console.log('Documento médico eliminado de Storage:', fileName);
            } catch (deleteError) {
                console.error('Error al eliminar archivo:', deleteError);
            }
        }

        await prueba.destroy();

        return ResponseUtil.success(res, null, 'Prueba médica eliminada exitosamente');

    } catch (error) {
        console.error('Error al eliminar prueba médica:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar prueba médica', error);
    }
};

/**
 * Subir documento de resultado médico
 * POST /api/pruebas-medicas/:id/resultado
 */
const subirResultadoMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            fecha_realizacion,
            fecha_resultado,
            resultado,
            observaciones,
            restricciones,
            medico_responsable,
            institucion_medica,
            valido_hasta
        } = req.body;

        const prueba = await PruebaMedica.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba médica no encontrada');
        }

        const file = req.file;

        if (!file) {
            return ResponseUtil.badRequest(res, 'Debes proporcionar un archivo PDF con el resultado médico');
        }

        // Si ya tenía resultado, eliminar el archivo anterior
        if (prueba.documento_resultado_url) {
            try {
                const oldFileName = extractFileNameFromUrl(prueba.documento_resultado_url);
                await deleteFile(oldFileName);
                console.log('Resultado médico anterior eliminado:', oldFileName);
            } catch (deleteError) {
                console.error('Error al eliminar archivo anterior:', deleteError);
            }
        }

        // Generar nombre único en carpeta 'pruebas-medicas'
        const fileName = generateUniqueFileName(file.originalname, 'pruebas-medicas');

        console.log('Subiendo resultado médico:', fileName);

        // Subir a Firebase Storage
        const uploadResult = await uploadFile(
            file.buffer,
            fileName,
            file.mimetype
        );

        // Actualizar prueba con datos y archivo
        await prueba.update({
            fecha_realizacion,
            fecha_resultado,
            resultado,
            observaciones,
            restricciones,
            medico_responsable,
            institucion_medica,
            documento_resultado_url: uploadResult.url,
            estado: 'resultado_recibido',
            valido_hasta
        });

        console.log('Resultado médico subido para prueba:', prueba.id);

        return ResponseUtil.success(res, {
            ...prueba.toJSON(),
            file_info: {
                fileName: uploadResult.fileName,
                size: uploadResult.size,
                originalName: file.originalname
            }
        }, 'Resultado médico subido exitosamente');

    } catch (error) {
        console.error('Error al subir resultado médico:', error);
        return ResponseUtil.serverError(res, 'Error al subir resultado médico', error);
    }
};

module.exports = {
    solicitarPruebaMedica,
    todasPruebasMedicas,
    misPruebasMedicas,
    pruebasMedicasCandidato,
    actualizarResultado,
    eliminarPruebaMedica,
    subirResultadoMedico
};
