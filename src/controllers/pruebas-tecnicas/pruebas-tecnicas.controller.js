const { PruebaTecnica, Candidato, Vacante, Postulacion, Usuario, Empresa } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const { uploadFile, generateUniqueFileName, deleteFile, extractFileNameFromUrl } = require('../../utils/firebase.util');

/**
 * Asignar prueba técnica (empresa)
 */
const asignarPruebaTecnica = async (req, res) => {
    try {
        const {
            id_candidato,
            id_vacante,
            id_postulacion,
            tipo_prueba,
            nombre_prueba,
            descripcion,
            instrucciones,
            fecha_limite,
            archivo_instrucciones_url
        } = req.body;

        const nuevaPrueba = await PruebaTecnica.create({
            id_candidato,
            id_vacante,
            id_postulacion,
            tipo_prueba,
            nombre_prueba,
            descripcion,
            instrucciones,
            fecha_asignacion: new Date(),
            fecha_limite,
            archivo_instrucciones_url,
            estado: 'asignada',
            resultado: 'pendiente'
        });

        return ResponseUtil.created(res, nuevaPrueba, 'Prueba técnica asignada exitosamente');

    } catch (error) {
        console.error('Error al asignar prueba técnica:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener todas las pruebas técnicas de la empresa
 */
const todasPruebasTecnicas = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const vacantes = await Vacante.findAll({
            where: { id_empresa: empresa.id },
            attributes: ['id']
        });

        const idsVacantes = vacantes.map(v => v.id);
        const { Op } = require('sequelize');

        const pruebas = await PruebaTecnica.findAll({
            where: {
                [Op.or]: [
                    { id_vacante: { [Op.in]: idsVacantes } }
                ]
            },
            include: [
                {
                    model: Candidato,
                    as: 'candidato',
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['nombre', 'email']
                    }]
                },
                {
                    model: Vacante,
                    as: 'vacante',
                    attributes: ['titulo']
                },
                {
                    model: Usuario,
                    as: 'evaluador',
                    attributes: ['nombre', 'email']
                }
            ],
            order: [['fecha_asignacion', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas técnicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas técnicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas técnicas', error);
    }
};

/**
 * Obtener mis pruebas técnicas (candidato)
 */
const misPruebasTecnicas = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const pruebas = await PruebaTecnica.findAll({
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
            order: [['fecha_asignacion', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas técnicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas técnicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas técnicas', error);
    }
};

/**
 * Entregar prueba técnica (candidato)
 */
const entregarPrueba = async (req, res) => {
    try {
        const { id } = req.params;
        const { archivo_respuesta_url } = req.body;

        const prueba = await PruebaTecnica.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba técnica no encontrada');
        }

        // Verificar que la prueba pertenezca al candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato || prueba.id_candidato !== candidato.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para entregar esta prueba');
        }

        if (prueba.estado === 'evaluada') {
            return ResponseUtil.error(res, 'Esta prueba ya fue evaluada', 400);
        }

        await prueba.update({
            archivo_respuesta_url,
            fecha_entrega: new Date(),
            estado: 'entregada'
        });

        return ResponseUtil.success(res, prueba, 'Prueba entregada exitosamente');

    } catch (error) {
        console.error('Error al entregar prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Evaluar prueba técnica (empresa)
 */
const evaluarPrueba = async (req, res) => {
    try {
        const { id } = req.params;
        const { puntaje, resultado, comentarios_evaluador, aspectos_positivos, aspectos_negativos } = req.body;

        const prueba = await PruebaTecnica.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba técnica no encontrada');
        }

        // Verificar permisos (empresa)
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || prueba.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para evaluar esta prueba');
        }

        await prueba.update({
            puntaje,
            resultado,
            comentarios_evaluador,
            aspectos_positivos,
            aspectos_negativos,
            fecha_evaluacion: new Date(),
            evaluador_id: req.userId,
            estado: 'evaluada'
        });

        return ResponseUtil.success(res, prueba, 'Prueba evaluada exitosamente');

    } catch (error) {
        console.error('Error al evaluar prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener pruebas técnicas de un candidato (empresa)
 */
const pruebasTecnicasCandidato = async (req, res) => {
    try {
        const { id_candidato } = req.params;

        const pruebas = await PruebaTecnica.findAll({
            where: { id_candidato },
            include: [
                {
                    model: Usuario,
                    as: 'evaluador',
                    attributes: ['nombre', 'email']
                }
            ],
            order: [['fecha_asignacion', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas técnicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas técnicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas técnicas', error);
    }
};

/**
 * Subir archivo de instrucciones para una prueba técnica (empresa)
 * POST /api/pruebas-tecnicas/:id/instrucciones
 */
const subirInstrucciones = async (req, res) => {
    try {
        const { id } = req.params;

        const prueba = await PruebaTecnica.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba técnica no encontrada');
        }

        // Verificar que sea la empresa que asignó la prueba
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || prueba.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para modificar esta prueba');
        }

        const file = req.file;

        if (!file) {
            return ResponseUtil.badRequest(res, 'Debes proporcionar un archivo PDF');
        }

        // Si ya tenía instrucciones, eliminar el archivo anterior
        if (prueba.archivo_instrucciones_url) {
            try {
                const oldFileName = extractFileNameFromUrl(prueba.archivo_instrucciones_url);
                await deleteFile(oldFileName);
                console.log('Instrucciones anteriores eliminadas:', oldFileName);
            } catch (deleteError) {
                console.error('Error al eliminar archivo anterior:', deleteError);
            }
        }

        // Generar nombre único en carpeta 'pruebas-tecnicas/instrucciones'
        const fileName = generateUniqueFileName(file.originalname, 'pruebas-tecnicas/instrucciones');

        console.log('Subiendo instrucciones:', fileName);

        // Subir a Firebase Storage
        const uploadResult = await uploadFile(
            file.buffer,
            fileName,
            file.mimetype
        );

        // Actualizar prueba
        await prueba.update({
            archivo_instrucciones_url: uploadResult.url
        });

        console.log('Instrucciones subidas para prueba:', prueba.id);

        return ResponseUtil.success(res, {
            ...prueba.toJSON(),
            file_info: {
                fileName: uploadResult.fileName,
                size: uploadResult.size,
                originalName: file.originalname
            }
        }, 'Instrucciones subidas exitosamente');

    } catch (error) {
        console.error('Error al subir instrucciones:', error);
        return ResponseUtil.serverError(res, 'Error al subir instrucciones', error);
    }
};

/**
 * Subir archivo de respuesta para una prueba técnica (candidato)
 * POST /api/pruebas-tecnicas/:id/respuesta
 */
const subirRespuesta = async (req, res) => {
    try {
        const { id } = req.params;

        const prueba = await PruebaTecnica.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba técnica no encontrada');
        }

        // Verificar que la prueba pertenezca al candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato || prueba.id_candidato !== candidato.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para entregar esta prueba');
        }

        if (prueba.estado === 'evaluada') {
            return ResponseUtil.error(res, 'Esta prueba ya fue evaluada, no puedes modificar tu respuesta', 400);
        }

        const file = req.file;

        if (!file) {
            return ResponseUtil.badRequest(res, 'Debes proporcionar un archivo PDF con tu respuesta');
        }

        // Si ya tenía respuesta, eliminar el archivo anterior
        if (prueba.archivo_respuesta_url) {
            try {
                const oldFileName = extractFileNameFromUrl(prueba.archivo_respuesta_url);
                await deleteFile(oldFileName);
                console.log('Respuesta anterior eliminada:', oldFileName);
            } catch (deleteError) {
                console.error('Error al eliminar archivo anterior:', deleteError);
            }
        }

        // Generar nombre único en carpeta 'pruebas-tecnicas/respuestas'
        const fileName = generateUniqueFileName(file.originalname, 'pruebas-tecnicas/respuestas');

        console.log('Subiendo respuesta:', fileName);

        // Subir a Firebase Storage
        const uploadResult = await uploadFile(
            file.buffer,
            fileName,
            file.mimetype
        );

        // Actualizar prueba
        await prueba.update({
            archivo_respuesta_url: uploadResult.url,
            fecha_entrega: new Date(),
            estado: 'entregada'
        });

        console.log('Respuesta subida para prueba:', prueba.id);

        return ResponseUtil.success(res, {
            ...prueba.toJSON(),
            file_info: {
                fileName: uploadResult.fileName,
                size: uploadResult.size,
                originalName: file.originalname
            }
        }, 'Respuesta entregada exitosamente');

    } catch (error) {
        console.error('Error al subir respuesta:', error);
        return ResponseUtil.serverError(res, 'Error al subir respuesta', error);
    }
};

/**
 * Subir PDF de evaluación (empresa)
 */
const subirEvaluacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { puntaje, resultado, comentarios_evaluador } = req.body;

        const prueba = await PruebaTecnica.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba técnica no encontrada');
        }

        // Verificar permisos
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || prueba.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para evaluar esta prueba');
        }

        const file = req.file;
        if (!file) {
            return ResponseUtil.error(res, 'No se proporcionó archivo', 400);
        }

        // Validar que sea PDF
        if (!file.mimetype.includes('pdf')) {
            return ResponseUtil.error(res, 'Solo se permiten archivos PDF', 400);
        }

        // Si ya existe un archivo, eliminarlo
        if (prueba.archivo_evaluacion_url) {
            try {
                const oldFileName = extractFileNameFromUrl(prueba.archivo_evaluacion_url);
                await deleteFile(oldFileName);
            } catch (error) {
                console.error('Error al eliminar archivo anterior:', error);
            }
        }

        const fileName = generateUniqueFileName(file.originalname, 'evaluaciones-tecnicas');
        const uploadResult = await uploadFile(
            file.buffer,
            fileName,
            file.mimetype
        );

        await prueba.update({
            archivo_evaluacion_url: uploadResult.url,
            puntaje: puntaje || prueba.puntaje,
            resultado: resultado || prueba.resultado,
            comentarios_evaluador: comentarios_evaluador || prueba.comentarios_evaluador,
            fecha_evaluacion: new Date(),
            evaluador_id: req.userId,
            estado: 'evaluada'
        });

        return ResponseUtil.success(res, {
            ...prueba.toJSON(),
            file_info: {
                fileName: uploadResult.fileName,
                size: uploadResult.size,
                originalName: file.originalname
            }
        }, 'Evaluación subida exitosamente');

    } catch (error) {
        console.error('Error al subir evaluación:', error);
        return ResponseUtil.serverError(res, 'Error al subir evaluación', error);
    }
};

module.exports = {
    asignarPruebaTecnica,
    todasPruebasTecnicas,
    misPruebasTecnicas,
    entregarPrueba,
    evaluarPrueba,
    pruebasTecnicasCandidato,
    subirInstrucciones,
    subirRespuesta,
    subirEvaluacion
};
