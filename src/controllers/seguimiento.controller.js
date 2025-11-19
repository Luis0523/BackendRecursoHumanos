const {
    Postulacion,
    Candidato,
    Usuario,
    Vacante,
    AsignacionPrueba,
    Prueba,
    RespuestaCandidato,
    PruebaMedica,
    PruebaTecnica,
    Contratacion,
    EmpleadoPlanilla,
    Empresa
} = require('../models');
const ResponseUtil = require('../utils/response.util');

/**
 * Obtener seguimiento global de candidatos
 */
const obtenerSeguimientoGlobal = async (req, res) => {
    try {
        console.log('🔍 Iniciando obtenerSeguimientoGlobal, userId:', req.userId);
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        console.log('🏢 Empresa encontrada:', empresa ? empresa.id : 'No encontrada');
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const { estado } = req.query;

        // Filtro por estado
        const wherePostulacion = {};
        if (estado) wherePostulacion.estado = estado;

        // Obtener todas las postulaciones con toda la información relacionada
        // Nota: Postulacion no tiene id_empresa, se filtra a través de Vacante
        console.log('📋 Buscando postulaciones con filtro:', wherePostulacion);
        const postulaciones = await Postulacion.findAll({
            where: wherePostulacion,
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
                    attributes: ['id', 'titulo'],
                    where: { id_empresa: empresa.id },
                    required: true
                }
            ],
            order: [['fecha_postulacion', 'DESC']]
        });
        console.log('✅ Postulaciones encontradas:', postulaciones.length);

        // Enriquecer con información de pruebas
        console.log('🔄 Procesando seguimiento de candidatos...');
        const seguimiento = await Promise.all(postulaciones.map(async (postulacion, index) => {
            console.log(`  📝 Procesando postulación ${index + 1}/${postulaciones.length}`);
            const candidatoId = postulacion.candidato.id;
            const postulacionData = postulacion.toJSON();

            // 1. Pruebas Psicométricas
            const asignaciones = await AsignacionPrueba.findAll({
                where: {
                    id_candidato: candidatoId,
                    id_empresa: empresa.id
                },
                include: [{
                    model: Prueba,
                    as: 'prueba'
                }]
            });

            let pruebasPsicometricas = {
                total: asignaciones.length,
                completadas: 0,
                porcentajePromedio: 0
            };

            if (asignaciones.length > 0) {
                const completadas = asignaciones.filter(a => a.estado === 'completada');
                pruebasPsicometricas.completadas = completadas.length;
                
                // Calcular porcentaje promedio
                let sumaTotal = 0;
                for (const asig of completadas) {
                    const respuestas = await RespuestaCandidato.findAll({
                        where: { id_asignacion: asig.id }
                    });
                    if (respuestas.length > 0) {
                        const puntajeTotal = respuestas.reduce((sum, r) => sum + (r.puntaje_obtenido || 0), 0);
                        sumaTotal += puntajeTotal;
                    }
                }
                if (completadas.length > 0) {
                    pruebasPsicometricas.porcentajePromedio = Math.round(sumaTotal / completadas.length);
                }
            }

            // 2. Pruebas Médicas
            const pruebasMedicas = await PruebaMedica.findAll({
                where: {
                    id_candidato: candidatoId
                },
                order: [['fecha_realizacion', 'DESC']],
                limit: 1
            });

            let pruebaMedica = null;
            if (pruebasMedicas.length > 0) {
                pruebaMedica = {
                    realizada: true,
                    porcentaje: pruebasMedicas[0].porcentaje_aptitud,
                    fecha: pruebasMedicas[0].fecha_realizacion
                };
            }

            // 3. Pruebas Técnicas
            const pruebasTecnicas = await PruebaTecnica.findAll({
                where: {
                    id_candidato: candidatoId
                },
                order: [['fecha_evaluacion', 'DESC']],
                limit: 1
            });

            let pruebaTecnica = null;
            if (pruebasTecnicas.length > 0) {
                pruebaTecnica = {
                    realizada: true,
                    porcentaje: pruebasTecnicas[0].puntaje || 0,
                    fecha: pruebasTecnicas[0].fecha_evaluacion
                };
            }

            // 4. Estado de contratación
            const contratacion = await Contratacion.findOne({
                where: { id_candidato: candidatoId },
                include: [{
                    model: EmpleadoPlanilla,
                    as: 'planilla'
                }]
            });

            let estadoContratacion = null;
            if (contratacion) {
                estadoContratacion = {
                    contratado: true,
                    fecha: contratacion.fecha_contratacion,
                    cargo: contratacion.cargo,
                    enPlanilla: !!contratacion.planilla,
                    estado: contratacion.estado,
                    estadoPlanilla: contratacion.planilla ? contratacion.planilla.estado : null
                };
            }

            // Calcular progreso general
            let progreso = 0;
            let etapasCompletadas = 0;
            const totalEtapas = 5; // postulación, psico, médica, técnica, contratación

            // 1. Postulación recibida
            etapasCompletadas += 1;
            progreso = 20;

            // 2. Pruebas psicométricas
            if (pruebasPsicometricas.completadas > 0) {
                etapasCompletadas += 1;
                progreso = 40;
            }

            // 3. Prueba médica
            if (pruebaMedica && pruebaMedica.realizada) {
                etapasCompletadas += 1;
                progreso = 60;
            }

            // 4. Prueba técnica
            if (pruebaTecnica && pruebaTecnica.realizada) {
                etapasCompletadas += 1;
                progreso = 80;
            }

            // 5. Contratación
            if (estadoContratacion && estadoContratacion.contratado) {
                etapasCompletadas += 1;
                progreso = 100;
            }

            return {
                id: postulacionData.id,
                candidato: {
                    id: postulacionData.candidato.id,
                    nombre: postulacionData.candidato.usuario.nombre,
                    email: postulacionData.candidato.usuario.email,
                    telefono: postulacionData.candidato.usuario.telefono,
                    cv_url: postulacionData.candidato.cv_url
                },
                vacante: {
                    id: postulacionData.vacante.id,
                    titulo: postulacionData.vacante.titulo
                },
                estado: postulacionData.estado,
                fechaPostulacion: postulacionData.fecha_postulacion,
                pruebasPsicometricas,
                pruebaMedica,
                pruebaTecnica,
                contratacion: estadoContratacion,
                progreso: {
                    porcentaje: progreso,
                    etapasCompletadas,
                    totalEtapas
                }
            };
        }));

        return ResponseUtil.success(res, seguimiento);

    } catch (error) {
        console.error('❌ Error al obtener seguimiento global:', error);
        console.error('Stack completo:', error.stack);
        return ResponseUtil.serverError(res, 'Error al obtener seguimiento', error);
    }
};

/**
 * Obtener estadísticas del proceso de reclutamiento
 */
const obtenerEstadisticasReclutamiento = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        // Contar postulaciones por estado
        const postulaciones = await Postulacion.findAll({
            where: { id_empresa: empresa.id },
            attributes: ['estado']
        });

        const estadisticas = {
            totalPostulaciones: postulaciones.length,
            porEstado: {
                pendiente: postulaciones.filter(p => p.estado === 'pendiente').length,
                revision: postulaciones.filter(p => p.estado === 'revision').length,
                entrevista: postulaciones.filter(p => p.estado === 'entrevista').length,
                pruebas: postulaciones.filter(p => p.estado === 'pruebas').length,
                rechazado: postulaciones.filter(p => p.estado === 'rechazado').length,
                contratado: postulaciones.filter(p => p.estado === 'contratado').length
            }
        };

        // Empleados en planilla
        const empleados = await EmpleadoPlanilla.findAll({
            include: [{
                model: Contratacion,
                as: 'contratacion',
                where: { id_empresa: empresa.id }
            }]
        });

        estadisticas.empleados = {
            total: empleados.length,
            activos: empleados.filter(e => e.estado === 'activo').length,
            enPeriodoPrueba: empleados.filter(e => e.periodo_prueba_activo).length
        };

        return ResponseUtil.success(res, estadisticas);

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener estadísticas', error);
    }
};

module.exports = {
    obtenerSeguimientoGlobal,
    obtenerEstadisticasReclutamiento
};
