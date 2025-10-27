const { Evento, Candidato, Vacante, Empresa, Postulacion, Usuario } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const { Op } = require('sequelize');

/**
 * Crear evento
 */
const crearEvento = async (req, res) => {
    try {
        const {
            id_postulacion,
            id_candidato,
            id_vacante,
            tipo_evento,
            titulo,
            descripcion,
            fecha_hora_inicio,
            fecha_hora_fin,
            duracion_minutos,
            ubicacion,
            modalidad,
            participantes,
            notas
        } = req.body;

        const nuevoEvento = await Evento.create({
            id_postulacion,
            id_candidato,
            id_vacante,
            id_empresa: req.body.id_empresa, // Si se proporciona
            tipo_evento,
            titulo,
            descripcion,
            fecha_hora_inicio,
            fecha_hora_fin,
            duracion_minutos,
            ubicacion,
            modalidad,
            organizador_id: req.userId,
            participantes,
            estado: 'programado',
            recordatorios_enviados: false,
            notas
        });

        return ResponseUtil.created(res, nuevoEvento, 'Evento creado exitosamente');

    } catch (error) {
        console.error('Error al crear evento:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener todos los eventos (con filtros)
 */
const obtenerEventos = async (req, res) => {
    try {
        const { tipo_evento, estado, fecha_desde, fecha_hasta } = req.query;

        const where = {};
        if (tipo_evento) where.tipo_evento = tipo_evento;
        if (estado) where.estado = estado;

        if (fecha_desde && fecha_hasta) {
            where.fecha_hora_inicio = {
                [Op.between]: [new Date(fecha_desde), new Date(fecha_hasta)]
            };
        }

        const eventos = await Evento.findAll({
            where,
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
                    as: 'organizador',
                    attributes: ['nombre', 'email']
                }
            ],
            order: [['fecha_hora_inicio', 'ASC']]
        });

        return ResponseUtil.success(res, eventos, 'Eventos obtenidos exitosamente');

    } catch (error) {
        console.error('Error al obtener eventos:', error);
        return ResponseUtil.serverError(res, 'Error al obtener eventos', error);
    }
};

/**
 * Obtener mis eventos (candidato)
 */
const misEventos = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const eventos = await Evento.findAll({
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
                },
                {
                    model: Usuario,
                    as: 'organizador',
                    attributes: ['nombre', 'email']
                }
            ],
            order: [['fecha_hora_inicio', 'ASC']]
        });

        return ResponseUtil.success(res, eventos, 'Eventos obtenidos exitosamente');

    } catch (error) {
        console.error('Error al obtener eventos:', error);
        return ResponseUtil.serverError(res, 'Error al obtener eventos', error);
    }
};

/**
 * Obtener eventos de mi empresa (empresa)
 */
const eventosPorEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const eventos = await Evento.findAll({
            where: { id_empresa: empresa.id },
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
                }
            ],
            order: [['fecha_hora_inicio', 'ASC']]
        });

        return ResponseUtil.success(res, eventos, 'Eventos obtenidos exitosamente');

    } catch (error) {
        console.error('Error al obtener eventos:', error);
        return ResponseUtil.serverError(res, 'Error al obtener eventos', error);
    }
};

/**
 * Actualizar evento
 */
const actualizarEvento = async (req, res) => {
    try {
        const { id } = req.params;

        const evento = await Evento.findByPk(id);
        if (!evento) {
            return ResponseUtil.notFound(res, 'Evento no encontrado');
        }

        // Verificar que el usuario sea el organizador
        if (evento.organizador_id !== req.userId) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para actualizar este evento');
        }

        await evento.update(req.body);

        return ResponseUtil.success(res, evento, 'Evento actualizado exitosamente');

    } catch (error) {
        console.error('Error al actualizar evento:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Cambiar estado del evento
 */
const cambiarEstadoEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const evento = await Evento.findByPk(id);
        if (!evento) {
            return ResponseUtil.notFound(res, 'Evento no encontrado');
        }

        if (evento.organizador_id !== req.userId) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para cambiar el estado');
        }

        await evento.update({ estado });

        return ResponseUtil.success(res, evento, 'Estado actualizado exitosamente');

    } catch (error) {
        console.error('Error al cambiar estado:', error);
        return ResponseUtil.serverError(res, 'Error al cambiar estado', error);
    }
};

/**
 * Eliminar evento
 */
const eliminarEvento = async (req, res) => {
    try {
        const { id } = req.params;

        const evento = await Evento.findByPk(id);
        if (!evento) {
            return ResponseUtil.notFound(res, 'Evento no encontrado');
        }

        if (evento.organizador_id !== req.userId) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para eliminar este evento');
        }

        await evento.destroy();

        return ResponseUtil.success(res, null, 'Evento eliminado exitosamente');

    } catch (error) {
        console.error('Error al eliminar evento:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar evento', error);
    }
};

module.exports = {
    crearEvento,
    obtenerEventos,
    misEventos,
    eventosPorEmpresa,
    actualizarEvento,
    cambiarEstadoEvento,
    eliminarEvento
};
