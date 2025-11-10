const { Postulacion, Vacante, Candidato, Usuario, Empresa } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');

/**
 * Postularse a una vacante
 */
const postularse = async (req, res) => {
    try {
        const { id_vacante, carta_presentacion } = req.body;

        // Verificar que la vacante existe y está activa
        const vacante = await Vacante.findByPk(id_vacante);
        if (!vacante) {
            return ResponseUtil.notFound(res, 'Vacante no encontrada');
        }

        if (vacante.estado !== 'activa') {
            return ResponseUtil.error(res, 'La vacante no está activa', 400);
        }

        // Obtener candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        // Verificar si ya se postuló
        const postulacionExistente = await Postulacion.findOne({
            where: { id_candidato: candidato.id, id_vacante }
        });

        if (postulacionExistente) {
            return ResponseUtil.error(res, 'Ya te has postulado a esta vacante', 409);
        }

        // Crear postulación
        const nuevaPostulacion = await Postulacion.create({
            id_candidato: candidato.id,
            id_vacante,
            carta_presentacion,
            estado: 'pendiente'
        });

        return ResponseUtil.created(res, nuevaPostulacion, 'Postulación creada exitosamente');

    } catch (error) {
        console.error('Error al crear postulación:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener mis postulaciones (candidato)
 */
const misPostulaciones = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const postulaciones = await Postulacion.findAll({
            where: { id_candidato: candidato.id },
            include: [{
                model: Vacante,
                as: 'vacante',
                include: [{
                    model: Empresa,
                    as: 'empresa',
                    attributes: ['id', 'nombre_empresa', 'logo']
                }]
            }],
            order: [['fecha_postulacion', 'DESC']]
        });

        return ResponseUtil.success(res, postulaciones, 'Postulaciones obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener postulaciones:', error);
        return ResponseUtil.serverError(res, 'Error al obtener postulaciones', error);
    }
};

/**
 * Obtener todas las postulaciones de la empresa
 */
const todasPostulacionesEmpresa = async (req, res) => {
    try {
        // Verificar que tiene una empresa asociada
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        // Obtener todas las postulaciones de las vacantes de esta empresa
        const postulaciones = await Postulacion.findAll({
            include: [
                {
                    model: Candidato,
                    as: 'candidato',
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['id', 'nombre', 'email', 'telefono']
                    }]
                },
                {
                    model: Vacante,
                    as: 'vacante',
                    where: { id_empresa: empresa.id },
                    attributes: ['id', 'titulo', 'ubicacion', 'estado']
                }
            ],
            order: [['fecha_postulacion', 'DESC']]
        });

        return ResponseUtil.success(res, postulaciones, 'Postulaciones obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener postulaciones:', error);
        return ResponseUtil.serverError(res, 'Error al obtener postulaciones', error);
    }
};

/**
 * Obtener postulaciones de una vacante (empresa)
 */
const postulacionesPorVacante = async (req, res) => {
    try {
        const { id_vacante } = req.params;

        // Verificar que la vacante pertenezca a la empresa del usuario
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const vacante = await Vacante.findByPk(id_vacante);
        if (!vacante || vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para ver estas postulaciones');
        }

        const postulaciones = await Postulacion.findAll({
            where: { id_vacante },
            include: [{
                model: Candidato,
                as: 'candidato',
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email', 'telefono']
                }]
            }],
            order: [['fecha_postulacion', 'DESC']]
        });

        return ResponseUtil.success(res, postulaciones, 'Postulaciones obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener postulaciones:', error);
        return ResponseUtil.serverError(res, 'Error al obtener postulaciones', error);
    }
};

/**
 * Actualizar estado de una postulación (empresa)
 */
const actualizarEstadoPostulacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, puntuacion, notas_empresa } = req.body;

        const postulacion = await Postulacion.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!postulacion) {
            return ResponseUtil.notFound(res, 'Postulación no encontrada');
        }

        // Verificar que la vacante pertenezca a la empresa del usuario
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || postulacion.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para actualizar esta postulación');
        }

        await postulacion.update({
            estado,
            puntuacion,
            notas_empresa,
            fecha_cambio_estado: new Date()
        });

        return ResponseUtil.success(res, postulacion, 'Postulación actualizada exitosamente');

    } catch (error) {
        console.error('Error al actualizar postulación:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Cancelar postulación (candidato)
 */
const cancelarPostulacion = async (req, res) => {
    try {
        const { id } = req.params;

        const postulacion = await Postulacion.findByPk(id);
        if (!postulacion) {
            return ResponseUtil.notFound(res, 'Postulación no encontrada');
        }

        // Verificar que la postulación pertenezca al candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato || postulacion.id_candidato !== candidato.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para cancelar esta postulación');
        }

        if (postulacion.estado === 'contratado') {
            return ResponseUtil.error(res, 'No puedes cancelar una postulación ya contratada', 400);
        }

        await postulacion.destroy();

        return ResponseUtil.success(res, null, 'Postulación cancelada exitosamente');

    } catch (error) {
        console.error('Error al cancelar postulación:', error);
        return ResponseUtil.serverError(res, 'Error al cancelar postulación', error);
    }
};

module.exports = {
    postularse,
    misPostulaciones,
    todasPostulacionesEmpresa,
    postulacionesPorVacante,
    actualizarEstadoPostulacion,
    cancelarPostulacion
};
