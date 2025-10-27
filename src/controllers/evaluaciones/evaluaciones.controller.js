const { EvaluacionPostContratacion, Candidato, Vacante, Postulacion, Usuario, Empresa } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');

/**
 * Crear evaluación post-contratación (empresa)
 */
const crearEvaluacion = async (req, res) => {
    try {
        const {
            id_candidato,
            id_vacante,
            id_postulacion,
            fecha_inicio_laboral,
            fecha_fin_periodo_prueba,
            puesto,
            departamento,
            salario_acordado
        } = req.body;

        // Verificar que la vacante pertenezca a la empresa
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const vacante = await Vacante.findByPk(id_vacante);
        if (!vacante || vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para crear evaluaciones para esta vacante');
        }

        const nuevaEvaluacion = await EvaluacionPostContratacion.create({
            id_candidato,
            id_vacante,
            id_postulacion,
            fecha_inicio_laboral,
            fecha_fin_periodo_prueba,
            puesto,
            departamento,
            salario_acordado,
            numero_evaluacion: 1,
            evaluador_id: req.userId
        });

        return ResponseUtil.created(res, nuevaEvaluacion, 'Evaluación creada exitosamente');

    } catch (error) {
        console.error('Error al crear evaluación:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener evaluaciones de un candidato
 */
const evaluacionesCandidato = async (req, res) => {
    try {
        const { id_candidato } = req.params;

        const evaluaciones = await EvaluacionPostContratacion.findAll({
            where: { id_candidato },
            include: [
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
            order: [['fecha_evaluacion', 'DESC']]
        });

        return ResponseUtil.success(res, evaluaciones, 'Evaluaciones obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener evaluaciones:', error);
        return ResponseUtil.serverError(res, 'Error al obtener evaluaciones', error);
    }
};

/**
 * Obtener evaluaciones de mi empresa
 */
const evaluacionesPorEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const evaluaciones = await EvaluacionPostContratacion.findAll({
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
                        attributes: ['nombre', 'email']
                    }]
                },
                {
                    model: Usuario,
                    as: 'evaluador',
                    attributes: ['nombre']
                }
            ],
            order: [['fecha_evaluacion', 'DESC']]
        });

        return ResponseUtil.success(res, evaluaciones, 'Evaluaciones obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener evaluaciones:', error);
        return ResponseUtil.serverError(res, 'Error al obtener evaluaciones', error);
    }
};

/**
 * Actualizar evaluación con feedback (empresa)
 */
const actualizarEvaluacion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            numero_evaluacion,
            desempeño_general,
            puntualidad,
            calidad_trabajo,
            trabajo_equipo,
            adaptacion_cultura,
            cumplimiento_objetivos,
            aspectos_positivos,
            areas_mejora,
            logros_periodo,
            objetivos_siguiente_periodo,
            decision,
            motivo_decision,
            requiere_capacitacion,
            areas_capacitacion,
            plan_mejora,
            observaciones_generales
        } = req.body;

        const evaluacion = await EvaluacionPostContratacion.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!evaluacion) {
            return ResponseUtil.notFound(res, 'Evaluación no encontrada');
        }

        // Verificar permisos
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || evaluacion.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para actualizar esta evaluación');
        }

        await evaluacion.update({
            numero_evaluacion,
            fecha_evaluacion: new Date(),
            desempeño_general,
            puntualidad,
            calidad_trabajo,
            trabajo_equipo,
            adaptacion_cultura,
            cumplimiento_objetivos,
            aspectos_positivos,
            areas_mejora,
            logros_periodo,
            objetivos_siguiente_periodo,
            decision,
            motivo_decision,
            fecha_decision: decision ? new Date() : null,
            requiere_capacitacion,
            areas_capacitacion,
            plan_mejora,
            observaciones_generales,
            evaluador_id: req.userId
        });

        return ResponseUtil.success(res, evaluacion, 'Evaluación actualizada exitosamente');

    } catch (error) {
        console.error('Error al actualizar evaluación:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener una evaluación específica
 */
const obtenerEvaluacion = async (req, res) => {
    try {
        const { id } = req.params;

        const evaluacion = await EvaluacionPostContratacion.findByPk(id, {
            include: [
                {
                    model: Candidato,
                    as: 'candidato',
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['nombre', 'email', 'telefono']
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
            ]
        });

        if (!evaluacion) {
            return ResponseUtil.notFound(res, 'Evaluación no encontrada');
        }

        return ResponseUtil.success(res, evaluacion, 'Evaluación obtenida exitosamente');

    } catch (error) {
        console.error('Error al obtener evaluación:', error);
        return ResponseUtil.serverError(res, 'Error al obtener evaluación', error);
    }
};

/**
 * Tomar decisión final sobre el candidato (empresa)
 */
const tomarDecision = async (req, res) => {
    try {
        const { id } = req.params;
        const { decision, motivo_decision } = req.body;

        const evaluacion = await EvaluacionPostContratacion.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!evaluacion) {
            return ResponseUtil.notFound(res, 'Evaluación no encontrada');
        }

        // Verificar permisos
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || evaluacion.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para tomar decisiones sobre esta evaluación');
        }

        await evaluacion.update({
            decision,
            motivo_decision,
            fecha_decision: new Date()
        });

        return ResponseUtil.success(res, evaluacion, 'Decisión registrada exitosamente');

    } catch (error) {
        console.error('Error al tomar decisión:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Eliminar evaluación (empresa)
 */
const eliminarEvaluacion = async (req, res) => {
    try {
        const { id } = req.params;

        const evaluacion = await EvaluacionPostContratacion.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!evaluacion) {
            return ResponseUtil.notFound(res, 'Evaluación no encontrada');
        }

        // Verificar permisos
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || evaluacion.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para eliminar esta evaluación');
        }

        await evaluacion.destroy();

        return ResponseUtil.success(res, null, 'Evaluación eliminada exitosamente');

    } catch (error) {
        console.error('Error al eliminar evaluación:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar evaluación', error);
    }
};

/**
 * Obtener estadísticas de evaluaciones (empresa)
 */
const obtenerEstadisticas = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const evaluaciones = await EvaluacionPostContratacion.findAll({
            include: [{
                model: Vacante,
                as: 'vacante',
                where: { id_empresa: empresa.id },
                attributes: []
            }]
        });

        const estadisticas = {
            total_evaluaciones: evaluaciones.length,
            continuan: evaluaciones.filter(e => e.decision === 'continua').length,
            no_continuan: evaluaciones.filter(e => e.decision === 'no_continua').length,
            periodo_extendido: evaluaciones.filter(e => e.decision === 'extender_periodo_prueba').length,
            promovidos: evaluaciones.filter(e => e.decision === 'promover').length,
            pendientes: evaluaciones.filter(e => !e.decision).length,
            requieren_capacitacion: evaluaciones.filter(e => e.requiere_capacitacion).length,
            promedios: {
                desempeño_general: calcularPromedio(evaluaciones, 'desempeño_general'),
                puntualidad: calcularPromedio(evaluaciones, 'puntualidad'),
                calidad_trabajo: calcularPromedio(evaluaciones, 'calidad_trabajo'),
                trabajo_equipo: calcularPromedio(evaluaciones, 'trabajo_equipo'),
                adaptacion_cultura: calcularPromedio(evaluaciones, 'adaptacion_cultura'),
                cumplimiento_objetivos: calcularPromedio(evaluaciones, 'cumplimiento_objetivos')
            }
        };

        return ResponseUtil.success(res, estadisticas, 'Estadísticas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener estadísticas', error);
    }
};

// Helper function
const calcularPromedio = (evaluaciones, campo) => {
    const valores = evaluaciones.filter(e => e[campo]).map(e => e[campo]);
    if (valores.length === 0) return 0;
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
};

module.exports = {
    crearEvaluacion,
    evaluacionesCandidato,
    evaluacionesPorEmpresa,
    obtenerEvaluacion,
    actualizarEvaluacion,
    tomarDecision,
    eliminarEvaluacion,
    obtenerEstadisticas
};
