const { HistorialActividad, Usuario } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const { Op } = require('sequelize');

/**
 * Registrar actividad en el historial (automático o manual)
 */
const registrarActividad = async (req, res) => {
    try {
        const {
            id_usuario,
            accion,
            tabla_afectada,
            registro_id,
            descripcion,
            datos_anteriores,
            datos_nuevos,
            ip_address,
            user_agent
        } = req.body;

        const nuevaActividad = await HistorialActividad.create({
            id_usuario: id_usuario || req.userId,
            accion,
            tabla_afectada,
            registro_id,
            descripcion,
            datos_anteriores,
            datos_nuevos,
            ip_address: ip_address || req.ip,
            user_agent: user_agent || req.get('user-agent')
        });

        return ResponseUtil.created(res, nuevaActividad, 'Actividad registrada exitosamente');

    } catch (error) {
        console.error('Error al registrar actividad:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener historial de actividades con filtros (admin)
 */
const obtenerHistorial = async (req, res) => {
    try {
        const {
            id_usuario,
            accion,
            tabla_afectada,
            fecha_inicio,
            fecha_fin,
            page = 1,
            limit = 50
        } = req.query;

        const where = {};

        if (id_usuario) where.id_usuario = id_usuario;
        if (accion) where.accion = accion;
        if (tabla_afectada) where.tabla_afectada = tabla_afectada;

        if (fecha_inicio || fecha_fin) {
            where.fecha = {};
            if (fecha_inicio) where.fecha[Op.gte] = new Date(fecha_inicio);
            if (fecha_fin) where.fecha[Op.lte] = new Date(fecha_fin);
        }

        const offset = (page - 1) * limit;

        const { count, rows: historial } = await HistorialActividad.findAndCountAll({
            where,
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre', 'email', 'id_rol']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['fecha', 'DESC']]
        });

        return ResponseUtil.success(res, {
            historial,
            paginacion: {
                total: count,
                pagina_actual: parseInt(page),
                total_paginas: Math.ceil(count / limit),
                registros_por_pagina: parseInt(limit)
            }
        }, 'Historial obtenido exitosamente');

    } catch (error) {
        console.error('Error al obtener historial:', error);
        return ResponseUtil.serverError(res, 'Error al obtener historial', error);
    }
};

/**
 * Obtener historial de un usuario específico (admin)
 */
const obtenerHistorialUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { limit = 100 } = req.query;

        const historial = await HistorialActividad.findAll({
            where: { id_usuario },
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre', 'email']
            }],
            limit: parseInt(limit),
            order: [['fecha', 'DESC']]
        });

        return ResponseUtil.success(res, historial, 'Historial del usuario obtenido exitosamente');

    } catch (error) {
        console.error('Error al obtener historial del usuario:', error);
        return ResponseUtil.serverError(res, 'Error al obtener historial del usuario', error);
    }
};

/**
 * Obtener actividades por tabla afectada (admin)
 */
const obtenerHistorialPorTabla = async (req, res) => {
    try {
        const { tabla } = req.params;
        const { registro_id, limit = 100 } = req.query;

        const where = { tabla_afectada: tabla };
        if (registro_id) where.registro_id = registro_id;

        const historial = await HistorialActividad.findAll({
            where,
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre', 'email']
            }],
            limit: parseInt(limit),
            order: [['fecha', 'DESC']]
        });

        return ResponseUtil.success(res, historial, 'Historial de la tabla obtenido exitosamente');

    } catch (error) {
        console.error('Error al obtener historial de la tabla:', error);
        return ResponseUtil.serverError(res, 'Error al obtener historial de la tabla', error);
    }
};

/**
 * Limpiar historial antiguo (admin)
 */
const limpiarHistorial = async (req, res) => {
    try {
        const { dias = 90 } = req.body;

        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - dias);

        const registrosEliminados = await HistorialActividad.destroy({
            where: {
                fecha: {
                    [Op.lt]: fechaLimite
                }
            }
        });

        return ResponseUtil.success(res, {
            registros_eliminados: registrosEliminados,
            fecha_limite: fechaLimite
        }, `Historial limpiado exitosamente (${registrosEliminados} registros eliminados)`);

    } catch (error) {
        console.error('Error al limpiar historial:', error);
        return ResponseUtil.serverError(res, 'Error al limpiar historial', error);
    }
};

/**
 * Obtener estadísticas de actividad (admin)
 */
const obtenerEstadisticas = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        const where = {};
        if (fecha_inicio || fecha_fin) {
            where.fecha = {};
            if (fecha_inicio) where.fecha[Op.gte] = new Date(fecha_inicio);
            if (fecha_fin) where.fecha[Op.lte] = new Date(fecha_fin);
        }

        const actividades = await HistorialActividad.findAll({ where });

        const estadisticas = {
            total_actividades: actividades.length,
            por_accion: {
                crear: actividades.filter(a => a.accion === 'crear').length,
                actualizar: actividades.filter(a => a.accion === 'actualizar').length,
                eliminar: actividades.filter(a => a.accion === 'eliminar').length,
                login: actividades.filter(a => a.accion === 'login').length,
                logout: actividades.filter(a => a.accion === 'logout').length
            },
            por_tabla: actividades.reduce((acc, a) => {
                acc[a.tabla_afectada] = (acc[a.tabla_afectada] || 0) + 1;
                return acc;
            }, {}),
            usuarios_mas_activos: await obtenerUsuariosMasActivos(where, 10)
        };

        return ResponseUtil.success(res, estadisticas, 'Estadísticas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener estadísticas', error);
    }
};

// Helper function
const obtenerUsuariosMasActivos = async (where, limit = 10) => {
    const { sequelize } = require('../../models');

    const resultados = await HistorialActividad.findAll({
        where,
        attributes: [
            'id_usuario',
            [sequelize.fn('COUNT', sequelize.col('id_usuario')), 'total_actividades']
        ],
        include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'email']
        }],
        group: ['id_usuario'],
        order: [[sequelize.literal('total_actividades'), 'DESC']],
        limit
    });

    return resultados;
};

module.exports = {
    registrarActividad,
    obtenerHistorial,
    obtenerHistorialUsuario,
    obtenerHistorialPorTabla,
    limpiarHistorial,
    obtenerEstadisticas
};
