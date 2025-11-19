const { EvaluacionPeriodoPrueba, Contratacion, Candidato, Usuario, Empresa } = require('../../models');
const ResponseUtil = require('../../utils/response.util');

/**
 * Crear evaluación de periodo de prueba
 */
const crearEvaluacion = async (req, res) => {
    try {
        const {
            id_contratacion,
            tipo_evaluacion,
            puntualidad,
            cumplimiento_objetivos,
            adaptacion_equipo,
            habilidades_tecnicas,
            actitud_compromiso,
            comentarios_supervisor,
            fortalezas,
            areas_mejora,
            recomendacion
        } = req.body;

        const contratacion = await Contratacion.findByPk(id_contratacion);
        if (!contratacion) {
            return ResponseUtil.notFound(res, 'Contratación no encontrada');
        }

        // Verificar permisos
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || contratacion.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso');
        }

        const evaluacion = await EvaluacionPeriodoPrueba.create({
            id_contratacion,
            tipo_evaluacion,
            puntualidad,
            cumplimiento_objetivos,
            adaptacion_equipo,
            habilidades_tecnicas,
            actitud_compromiso,
            comentarios_supervisor,
            fortalezas,
            areas_mejora,
            recomendacion,
            evaluado_por: req.userId
        });

        return ResponseUtil.created(res, evaluacion, 'Evaluación creada exitosamente');

    } catch (error) {
        console.error('Error al crear evaluación:', error);
        return ResponseUtil.serverError(res, 'Error al crear evaluación', error);
    }
};

/**
 * Obtener evaluaciones de una contratación
 */
const obtenerEvaluaciones = async (req, res) => {
    try {
        const { id_contratacion } = req.params;

        const evaluaciones = await EvaluacionPeriodoPrueba.findAll({
            where: { id_contratacion },
            include: [{
                model: Usuario,
                as: 'evaluador',
                attributes: ['nombre', 'email']
            }],
            order: [['fecha_evaluacion', 'DESC']]
        });

        return ResponseUtil.success(res, evaluaciones);

    } catch (error) {
        console.error('Error al obtener evaluaciones:', error);
        return ResponseUtil.serverError(res, 'Error al obtener evaluaciones', error);
    }
};

/**
 * Finalizar periodo de prueba
 */
const finalizarPeriodoPrueba = async (req, res) => {
    try {
        const { id_contratacion } = req.params;
        const { decision, observaciones } = req.body; // decision: 'aprobar', 'extender', 'no_renovar'

        const contratacion = await Contratacion.findByPk(id_contratacion);
        if (!contratacion) {
            return ResponseUtil.notFound(res, 'Contratación no encontrada');
        }

        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || contratacion.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso');
        }

        if (decision === 'aprobar') {
            await contratacion.update({ estado: 'planilla' });
            
            // Crear registro en planilla
            const { EmpleadoPlanilla } = require('../../models');
            await EmpleadoPlanilla.create({
                id_contratacion: id_contratacion,
                fecha_ingreso_planilla: new Date()
            });

        } else if (decision === 'extender') {
            const nuevaFecha = new Date(contratacion.fecha_fin_periodo_prueba);
            nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
            await contratacion.update({ 
                fecha_fin_periodo_prueba: nuevaFecha,
                notas: `${contratacion.notas || ''}\nExtensión: ${observaciones}`
            });

        } else if (decision === 'no_renovar') {
            await contratacion.update({ 
                estado: 'finalizado',
                notas: `${contratacion.notas || ''}\nNo renovado: ${observaciones}`
            });
        }

        return ResponseUtil.success(res, contratacion, 'Periodo de prueba finalizado');

    } catch (error) {
        console.error('Error al finalizar periodo:', error);
        return ResponseUtil.serverError(res, 'Error al finalizar periodo', error);
    }
};

module.exports = {
    crearEvaluacion,
    obtenerEvaluaciones,
    finalizarPeriodoPrueba
};
