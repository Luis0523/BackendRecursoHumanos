const { Entrevista, Postulacion, Candidato, Vacante, Usuario, Empresa } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');

/**
 * Crear/programar una entrevista (empresa)
 */
const crearEntrevista = async (req, res) => {
    try {
        const { id_postulacion, id_candidato, id_vacante, tipo_entrevista, fecha_hora, duracion_minutos, ubicacion } = req.body;

        // Verificar que la vacante pertenezca a la empresa del usuario
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const vacante = await Vacante.findByPk(id_vacante);
        if (!vacante || vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para crear entrevistas para esta vacante');
        }

        const nuevaEntrevista = await Entrevista.create({
            id_postulacion,
            id_candidato,
            id_vacante,
            tipo_entrevista,
            fecha_hora,
            duracion_minutos,
            ubicacion,
            entrevistador_id: req.userId,
            estado: 'programada',
            realizada: false
        });

        return ResponseUtil.created(res, nuevaEntrevista, 'Entrevista programada exitosamente');

    } catch (error) {
        console.error('Error al crear entrevista:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener mis entrevistas (candidato)
 */
const misEntrevistas = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const entrevistas = await Entrevista.findAll({
            where: { id_candidato: candidato.id },
            include: [
                {
                    model: Vacante,
                    as: 'vacante',
                    attributes: ['titulo'],
                    include: [{
                        model: Empresa,
                        as: 'empresa',
                        attributes: ['nombre_empresa', 'logo']
                    }]
                },
                {
                    model: Usuario,
                    as: 'entrevistador',
                    attributes: ['nombre', 'email']
                }
            ],
            order: [['fecha_hora', 'ASC']]
        });

        return ResponseUtil.success(res, entrevistas, 'Entrevistas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener entrevistas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener entrevistas', error);
    }
};

/**
 * Obtener entrevistas de mi empresa (empresa)
 */
const entrevistasPorEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const entrevistas = await Entrevista.findAll({
            include: [
                {
                    model: Vacante,
                    as: 'vacante',
                    where: { id_empresa: empresa.id },
                    attributes: ['titulo']
                },
                {
                    model: Candidato,
                    as: 'candidato',
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['nombre', 'email', 'telefono']
                    }]
                }
            ],
            order: [['fecha_hora', 'ASC']]
        });

        return ResponseUtil.success(res, entrevistas, 'Entrevistas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener entrevistas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener entrevistas', error);
    }
};

/**
 * Actualizar entrevista
 */
const actualizarEntrevista = async (req, res) => {
    try {
        const { id } = req.params;

        const entrevista = await Entrevista.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!entrevista) {
            return ResponseUtil.notFound(res, 'Entrevista no encontrada');
        }

        // Verificar permisos (empresa)
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || entrevista.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para actualizar esta entrevista');
        }

        await entrevista.update(req.body);

        return ResponseUtil.success(res, entrevista, 'Entrevista actualizada exitosamente');

    } catch (error) {
        console.error('Error al actualizar entrevista:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Evaluar entrevista (empresa)
 */
const evaluarEntrevista = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            calificacion,
            aspectos_positivos,
            aspectos_negativos,
            habilidades_tecnicas_evaluacion,
            habilidades_blandas_evaluacion,
            recomendacion,
            observaciones,
            siguiente_paso
        } = req.body;

        const entrevista = await Entrevista.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!entrevista) {
            return ResponseUtil.notFound(res, 'Entrevista no encontrada');
        }

        // Verificar permisos
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || entrevista.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para evaluar esta entrevista');
        }

        await entrevista.update({
            calificacion,
            aspectos_positivos,
            aspectos_negativos,
            habilidades_tecnicas_evaluacion,
            habilidades_blandas_evaluacion,
            recomendacion,
            observaciones,
            siguiente_paso,
            estado: 'completada',
            realizada: true,
            fecha_evaluacion: new Date()
        });

        return ResponseUtil.success(res, entrevista, 'Entrevista evaluada exitosamente');

    } catch (error) {
        console.error('Error al evaluar entrevista:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Cancelar entrevista
 */
const cancelarEntrevista = async (req, res) => {
    try {
        const { id } = req.params;

        const entrevista = await Entrevista.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!entrevista) {
            return ResponseUtil.notFound(res, 'Entrevista no encontrada');
        }

        // Verificar permisos (empresa)
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || entrevista.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para cancelar esta entrevista');
        }

        await entrevista.update({ estado: 'cancelada' });

        return ResponseUtil.success(res, entrevista, 'Entrevista cancelada exitosamente');

    } catch (error) {
        console.error('Error al cancelar entrevista:', error);
        return ResponseUtil.serverError(res, 'Error al cancelar entrevista', error);
    }
};

module.exports = {
    crearEntrevista,
    misEntrevistas,
    entrevistasPorEmpresa,
    actualizarEntrevista,
    evaluarEntrevista,
    cancelarEntrevista
};
