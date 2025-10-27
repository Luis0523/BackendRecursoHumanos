const {
    Reporte,
    Usuario,
    Vacante,
    Postulacion,
    Candidato,
    Empresa,
    Entrevista,
    EvaluacionPostContratacion
} = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const { Op } = require('sequelize');

/**
 * Generar un nuevo reporte (admin o empresa)
 */
const generarReporte = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            tipo_reporte,
            parametros,
            formato_salida
        } = req.body;

        // Generar los datos del reporte según el tipo
        let datos_reporte = {};

        switch (tipo_reporte) {
            case 'vacantes':
                datos_reporte = await generarReporteVacantes(parametros);
                break;
            case 'postulaciones':
                datos_reporte = await generarReportePostulaciones(parametros);
                break;
            case 'candidatos':
                datos_reporte = await generarReporteCandidatos(parametros);
                break;
            case 'entrevistas':
                datos_reporte = await generarReporteEntrevistas(parametros);
                break;
            case 'evaluaciones':
                datos_reporte = await generarReporteEvaluaciones(parametros);
                break;
            case 'actividad':
                datos_reporte = await generarReporteActividad(parametros);
                break;
            default:
                return ResponseUtil.error(res, 'Tipo de reporte no válido', 400);
        }

        const nuevoReporte = await Reporte.create({
            nombre,
            descripcion,
            tipo_reporte,
            generado_por: req.userId,
            parametros,
            datos_reporte,
            formato_salida: formato_salida || 'json',
            estado: 'completado'
        });

        return ResponseUtil.created(res, nuevoReporte, 'Reporte generado exitosamente');

    } catch (error) {
        console.error('Error al generar reporte:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener todos los reportes (admin)
 */
const obtenerReportes = async (req, res) => {
    try {
        const { tipo_reporte, estado, page = 1, limit = 20 } = req.query;

        const where = {};
        if (tipo_reporte) where.tipo_reporte = tipo_reporte;
        if (estado) where.estado = estado;

        const offset = (page - 1) * limit;

        const { count, rows: reportes } = await Reporte.findAndCountAll({
            where,
            include: [{
                model: Usuario,
                as: 'generador',
                attributes: ['nombre', 'email']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['fecha_generacion', 'DESC']]
        });

        return ResponseUtil.success(res, {
            reportes,
            paginacion: {
                total: count,
                pagina_actual: parseInt(page),
                total_paginas: Math.ceil(count / limit),
                registros_por_pagina: parseInt(limit)
            }
        }, 'Reportes obtenidos exitosamente');

    } catch (error) {
        console.error('Error al obtener reportes:', error);
        return ResponseUtil.serverError(res, 'Error al obtener reportes', error);
    }
};

/**
 * Obtener un reporte específico (admin)
 */
const obtenerReporte = async (req, res) => {
    try {
        const { id } = req.params;

        const reporte = await Reporte.findByPk(id, {
            include: [{
                model: Usuario,
                as: 'generador',
                attributes: ['nombre', 'email']
            }]
        });

        if (!reporte) {
            return ResponseUtil.notFound(res, 'Reporte no encontrado');
        }

        return ResponseUtil.success(res, reporte, 'Reporte obtenido exitosamente');

    } catch (error) {
        console.error('Error al obtener reporte:', error);
        return ResponseUtil.serverError(res, 'Error al obtener reporte', error);
    }
};

/**
 * Eliminar un reporte (admin)
 */
const eliminarReporte = async (req, res) => {
    try {
        const { id } = req.params;

        const reporte = await Reporte.findByPk(id);
        if (!reporte) {
            return ResponseUtil.notFound(res, 'Reporte no encontrado');
        }

        await reporte.destroy();

        return ResponseUtil.success(res, null, 'Reporte eliminado exitosamente');

    } catch (error) {
        console.error('Error al eliminar reporte:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar reporte', error);
    }
};

/**
 * Obtener reportes por tipo (admin)
 */
const reportesPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params;

        const reportes = await Reporte.findAll({
            where: { tipo_reporte: tipo },
            include: [{
                model: Usuario,
                as: 'generador',
                attributes: ['nombre', 'email']
            }],
            order: [['fecha_generacion', 'DESC']],
            limit: 50
        });

        return ResponseUtil.success(res, reportes, `Reportes de tipo ${tipo} obtenidos exitosamente`);

    } catch (error) {
        console.error('Error al obtener reportes por tipo:', error);
        return ResponseUtil.serverError(res, 'Error al obtener reportes por tipo', error);
    }
};

// ============================================================
// FUNCIONES HELPER PARA GENERAR DIFERENTES TIPOS DE REPORTES
// ============================================================

const generarReporteVacantes = async (parametros = {}) => {
    const { fecha_inicio, fecha_fin, id_empresa } = parametros;

    const where = {};
    if (id_empresa) where.id_empresa = id_empresa;
    if (fecha_inicio || fecha_fin) {
        where.fecha_publicacion = {};
        if (fecha_inicio) where.fecha_publicacion[Op.gte] = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_publicacion[Op.lte] = new Date(fecha_fin);
    }

    const vacantes = await Vacante.findAll({
        where,
        include: [
            {
                model: Empresa,
                as: 'empresa',
                attributes: ['nombre_empresa', 'sector']
            },
            {
                model: Postulacion,
                as: 'postulaciones',
                attributes: ['id', 'estado']
            }
        ]
    });

    return {
        total_vacantes: vacantes.length,
        por_estado: {
            activas: vacantes.filter(v => v.estado === 'activa').length,
            pausadas: vacantes.filter(v => v.estado === 'pausada').length,
            cerradas: vacantes.filter(v => v.estado === 'cerrada').length
        },
        total_postulaciones: vacantes.reduce((sum, v) => sum + v.postulaciones.length, 0),
        vacantes: vacantes.map(v => ({
            id: v.id,
            titulo: v.titulo,
            empresa: v.empresa?.nombre_empresa,
            estado: v.estado,
            postulaciones: v.postulaciones.length,
            fecha_publicacion: v.fecha_publicacion
        }))
    };
};

const generarReportePostulaciones = async (parametros = {}) => {
    const { fecha_inicio, fecha_fin, estado } = parametros;

    const where = {};
    if (estado) where.estado = estado;
    if (fecha_inicio || fecha_fin) {
        where.fecha_postulacion = {};
        if (fecha_inicio) where.fecha_postulacion[Op.gte] = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_postulacion[Op.lte] = new Date(fecha_fin);
    }

    const postulaciones = await Postulacion.findAll({
        where,
        include: [
            {
                model: Vacante,
                as: 'vacante',
                attributes: ['titulo']
            },
            {
                model: Candidato,
                as: 'candidato',
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['nombre', 'email']
                }]
            }
        ]
    });

    return {
        total_postulaciones: postulaciones.length,
        por_estado: {
            pendiente: postulaciones.filter(p => p.estado === 'pendiente').length,
            en_revision: postulaciones.filter(p => p.estado === 'en_revision').length,
            preseleccionado: postulaciones.filter(p => p.estado === 'preseleccionado').length,
            rechazado: postulaciones.filter(p => p.estado === 'rechazado').length,
            contratado: postulaciones.filter(p => p.estado === 'contratado').length
        },
        postulaciones: postulaciones.map(p => ({
            id: p.id,
            vacante: p.vacante?.titulo,
            candidato: p.candidato?.usuario?.nombre,
            estado: p.estado,
            fecha_postulacion: p.fecha_postulacion
        }))
    };
};

const generarReporteCandidatos = async (parametros = {}) => {
    const { pais, nivel_educacion } = parametros;

    const where = {};
    if (pais) where.pais = pais;
    if (nivel_educacion) where.nivel_educacion = nivel_educacion;

    const candidatos = await Candidato.findAll({
        where,
        include: [
            {
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre', 'email']
            },
            {
                model: Postulacion,
                as: 'postulaciones',
                attributes: ['id', 'estado']
            }
        ]
    });

    return {
        total_candidatos: candidatos.length,
        por_nivel_educacion: candidatos.reduce((acc, c) => {
            acc[c.nivel_educacion] = (acc[c.nivel_educacion] || 0) + 1;
            return acc;
        }, {}),
        por_pais: candidatos.reduce((acc, c) => {
            acc[c.pais] = (acc[c.pais] || 0) + 1;
            return acc;
        }, {}),
        candidatos: candidatos.map(c => ({
            id: c.id,
            nombre: c.usuario?.nombre,
            email: c.usuario?.email,
            nivel_educacion: c.nivel_educacion,
            pais: c.pais,
            postulaciones: c.postulaciones.length
        }))
    };
};

const generarReporteEntrevistas = async (parametros = {}) => {
    const { fecha_inicio, fecha_fin, estado } = parametros;

    const where = {};
    if (estado) where.estado = estado;
    if (fecha_inicio || fecha_fin) {
        where.fecha = {};
        if (fecha_inicio) where.fecha[Op.gte] = new Date(fecha_inicio);
        if (fecha_fin) where.fecha[Op.lte] = new Date(fecha_fin);
    }

    const entrevistas = await Entrevista.findAll({
        where,
        include: [
            {
                model: Candidato,
                as: 'candidato',
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['nombre']
                }]
            },
            {
                model: Vacante,
                as: 'vacante',
                attributes: ['titulo']
            }
        ]
    });

    return {
        total_entrevistas: entrevistas.length,
        por_tipo: {
            telefonica: entrevistas.filter(e => e.tipo === 'telefonica').length,
            presencial: entrevistas.filter(e => e.tipo === 'presencial').length,
            videoconferencia: entrevistas.filter(e => e.tipo === 'videoconferencia').length
        },
        por_estado: {
            programada: entrevistas.filter(e => e.estado === 'programada').length,
            completada: entrevistas.filter(e => e.estado === 'completada').length,
            cancelada: entrevistas.filter(e => e.estado === 'cancelada').length
        },
        entrevistas: entrevistas.map(e => ({
            id: e.id,
            candidato: e.candidato?.usuario?.nombre,
            vacante: e.vacante?.titulo,
            tipo: e.tipo,
            estado: e.estado,
            fecha: e.fecha
        }))
    };
};

const generarReporteEvaluaciones = async (parametros = {}) => {
    const { fecha_inicio, fecha_fin } = parametros;

    const where = {};
    if (fecha_inicio || fecha_fin) {
        where.fecha_evaluacion = {};
        if (fecha_inicio) where.fecha_evaluacion[Op.gte] = new Date(fecha_inicio);
        if (fecha_fin) where.fecha_evaluacion[Op.lte] = new Date(fecha_fin);
    }

    const evaluaciones = await EvaluacionPostContratacion.findAll({
        where,
        include: [
            {
                model: Candidato,
                as: 'candidato',
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['nombre']
                }]
            },
            {
                model: Vacante,
                as: 'vacante',
                attributes: ['titulo']
            }
        ]
    });

    return {
        total_evaluaciones: evaluaciones.length,
        por_decision: {
            continua: evaluaciones.filter(e => e.decision === 'continua').length,
            no_continua: evaluaciones.filter(e => e.decision === 'no_continua').length,
            extender_periodo_prueba: evaluaciones.filter(e => e.decision === 'extender_periodo_prueba').length,
            promover: evaluaciones.filter(e => e.decision === 'promover').length
        },
        promedio_desempeño: calcularPromedio(evaluaciones, 'desempeño_general'),
        evaluaciones: evaluaciones.map(e => ({
            id: e.id,
            candidato: e.candidato?.usuario?.nombre,
            puesto: e.puesto,
            decision: e.decision,
            desempeño_general: e.desempeño_general,
            fecha_evaluacion: e.fecha_evaluacion
        }))
    };
};

const generarReporteActividad = async (parametros = {}) => {
    const { HistorialActividad } = require('../../models');
    const { fecha_inicio, fecha_fin } = parametros;

    const where = {};
    if (fecha_inicio || fecha_fin) {
        where.fecha = {};
        if (fecha_inicio) where.fecha[Op.gte] = new Date(fecha_inicio);
        if (fecha_fin) where.fecha[Op.lte] = new Date(fecha_fin);
    }

    const actividades = await HistorialActividad.findAll({ where });

    return {
        total_actividades: actividades.length,
        por_accion: {
            crear: actividades.filter(a => a.accion === 'crear').length,
            actualizar: actividades.filter(a => a.accion === 'actualizar').length,
            eliminar: actividades.filter(a => a.accion === 'eliminar').length,
            login: actividades.filter(a => a.accion === 'login').length
        },
        por_tabla: actividades.reduce((acc, a) => {
            acc[a.tabla_afectada] = (acc[a.tabla_afectada] || 0) + 1;
            return acc;
        }, {})
    };
};

// Helper function
const calcularPromedio = (items, campo) => {
    const valores = items.filter(i => i[campo]).map(i => i[campo]);
    if (valores.length === 0) return 0;
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
};

module.exports = {
    generarReporte,
    obtenerReportes,
    obtenerReporte,
    eliminarReporte,
    reportesPorTipo
};
