const { EmpleadoPlanilla, Contratacion, Candidato, Usuario, Empresa, Postulacion, Vacante, AsignacionPrueba, PruebaMedica, PruebaTecnica, RespuestaCandidato } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { Op } = require('sequelize');

/**
 * Obtener todos los empleados en planilla
 */
const obtenerPlanilla = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const { estado } = req.query;
        const whereClausePlanilla = {};
        if (estado) whereClausePlanilla.estado = estado;

        const empleados = await EmpleadoPlanilla.findAll({
            where: whereClausePlanilla,
            include: [{
                model: Contratacion,
                as: 'contratacion',
                where: { id_empresa: empresa.id },
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
                        model: Usuario,
                        as: 'supervisor',
                        attributes: ['nombre', 'email']
                    }
                ]
            }],
            order: [['fecha_ingreso_planilla', 'DESC']]
        });

        return ResponseUtil.success(res, empleados);

    } catch (error) {
        console.error('Error al obtener planilla:', error);
        return ResponseUtil.serverError(res, 'Error al obtener planilla', error);
    }
};

/**
 * Actualizar estado de empleado
 */
const actualizarEstadoEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, fecha_baja, motivo_baja, observaciones_baja } = req.body;

        const empleado = await EmpleadoPlanilla.findByPk(id, {
            include: [{
                model: Contratacion,
                as: 'contratacion'
            }]
        });

        if (!empleado) {
            return ResponseUtil.notFound(res, 'Empleado no encontrado');
        }

        // Verificar permisos
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || empleado.contratacion.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso');
        }

        await empleado.update({
            estado,
            fecha_baja,
            motivo_baja,
            observaciones_baja
        });

        return ResponseUtil.success(res, empleado, 'Estado actualizado');

    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        return ResponseUtil.serverError(res, 'Error al actualizar empleado', error);
    }
};

/**
 * Generar código de empleado automático
 */
const generarCodigoEmpleado = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        // Obtener el último código
        const ultimoEmpleado = await EmpleadoPlanilla.findOne({
            include: [{
                model: Contratacion,
                as: 'contratacion',
                where: { id_empresa: empresa.id }
            }],
            where: {
                codigo_empleado: { [require('sequelize').Op.not]: null }
            },
            order: [['codigo_empleado', 'DESC']]
        });

        let nuevoCodigo;
        if (ultimoEmpleado && ultimoEmpleado.codigo_empleado) {
            const numero = parseInt(ultimoEmpleado.codigo_empleado.replace(/\D/g, '')) + 1;
            nuevoCodigo = `EMP${numero.toString().padStart(4, '0')}`;
        } else {
            nuevoCodigo = 'EMP0001';
        }

        return ResponseUtil.success(res, { codigo: nuevoCodigo });

    } catch (error) {
        console.error('Error al generar código:', error);
        return ResponseUtil.serverError(res, 'Error al generar código', error);
    }
};

/**
 * Obtener empleados en periodo de prueba
 */
const obtenerEmpleadosPeriodoPrueba = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const empleados = await EmpleadoPlanilla.findAll({
            where: { 
                estado: 'activo'
            },
            include: [{
                model: Contratacion,
                as: 'contratacion',
                where: { 
                    id_empresa: empresa.id,
                    estado: 'periodo_prueba'
                },
                include: [
                    {
                        model: Candidato,
                        as: 'candidato',
                        include: [{
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nombre', 'email', 'telefono']
                        }]
                    }
                ]
            }],
            order: [['contratacion', 'fecha_fin_periodo_prueba', 'ASC']]
        });

        // Calcular días restantes y progreso
        const empleadosConProgreso = empleados.map(empleado => {
            const contratacion = empleado.contratacion;
            const hoy = new Date();
            const fechaInicio = new Date(contratacion.fecha_inicio_labores);
            const fechaFin = new Date(contratacion.fecha_fin_periodo_prueba);
            
            const totalDias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
            const diasTranscurridos = Math.ceil((hoy - fechaInicio) / (1000 * 60 * 60 * 24));
            const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
            const progreso = Math.min(100, Math.max(0, (diasTranscurridos / totalDias) * 100));

            return {
                ...empleado.toJSON(),
                diasRestantes: Math.max(0, diasRestantes),
                progreso: Math.round(progreso)
            };
        });

        return ResponseUtil.success(res, empleadosConProgreso);

    } catch (error) {
        console.error('Error al obtener empleados en periodo de prueba:', error);
        return ResponseUtil.serverError(res, 'Error al obtener empleados', error);
    }
};

/**
 * Finalizar periodo de prueba (aprobar/rechazar)
 */
const finalizarPeriodoPrueba = async (req, res) => {
    try {
        const { id } = req.params;
        const { aprobado, observaciones } = req.body;

        const empleado = await EmpleadoPlanilla.findByPk(id, {
            include: [{
                model: Contratacion,
                as: 'contratacion'
            }]
        });

        if (!empleado) {
            return ResponseUtil.notFound(res, 'Empleado no encontrado');
        }

        // Verificar permisos
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || empleado.contratacion.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso');
        }

        // Verificar que esté en periodo de prueba
        if (empleado.contratacion.estado !== 'periodo_prueba') {
            return ResponseUtil.error(res, 'Este empleado no está en periodo de prueba', 400);
        }

        // Actualizar contratación y empleado
        await empleado.contratacion.update({
            estado: aprobado ? 'contratado' : 'rechazado',
            notas: observaciones
        });

        await empleado.update({
            estado: aprobado ? 'activo' : 'inactivo',
            fecha_baja: aprobado ? null : new Date(),
            motivo_baja: aprobado ? null : 'No superó periodo de prueba',
            observaciones_baja: aprobado ? null : observaciones
        });

        return ResponseUtil.success(res, empleado, 
            aprobado ? 'Periodo de prueba aprobado' : 'Periodo de prueba rechazado'
        );

    } catch (error) {
        console.error('Error al finalizar periodo de prueba:', error);
        return ResponseUtil.serverError(res, 'Error al finalizar periodo de prueba', error);
    }
};

/**
 * Obtener seguimiento de todos los candidatos
 */
const obtenerSeguimiento = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        // Obtener todas las postulaciones de la empresa
        const postulaciones = await Postulacion.findAll({
            include: [
                {
                    model: Vacante,
                    as: 'vacante',
                    where: { id_empresa: empresa.id },
                    attributes: ['id', 'titulo']
                },
                {
                    model: Candidato,
                    as: 'candidato',
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['id', 'nombre', 'email', 'telefono']
                    }],
                    attributes: ['id', 'id_usuario', 'cv_url']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Procesar cada postulación para obtener el seguimiento completo
        const seguimiento = await Promise.all(postulaciones.map(async (postulacion) => {
            const candidato = postulacion.candidato;
            
            // Pruebas Psicométricas
            const asignaciones = await AsignacionPrueba.findAll({
                where: { 
                    id_candidato: candidato.id,
                    id_empresa: empresa.id
                }
            });

            let pruebasPsico = {
                total: asignaciones.length,
                completadas: asignaciones.filter(a => a.estado === 'completada').length,
                porcentajePromedio: 0
            };

            if (pruebasPsico.completadas > 0) {
                const respuestas = await RespuestaCandidato.findAll({
                    where: {
                        id_asignacion: asignaciones.map(a => a.id)
                    }
                });
                
                if (respuestas.length > 0) {
                    const totalPuntos = respuestas.reduce((sum, r) => sum + (r.puntaje_obtenido || 0), 0);
                    pruebasPsico.porcentajePromedio = Math.round((totalPuntos / respuestas.length) * 10);
                }
            }

            // Prueba Médica
            const pruebaMedica = await PruebaMedica.findOne({
                where: {
                    id_candidato: candidato.id
                },
                order: [['created_at', 'DESC']]
            });

            // Prueba Técnica
            const pruebaTecnica = await PruebaTecnica.findOne({
                where: {
                    id_candidato: candidato.id
                },
                order: [['created_at', 'DESC']]
            });

            // Contratación
            const contratacion = await Contratacion.findOne({
                where: { 
                    id_candidato: candidato.id,
                    id_empresa: empresa.id
                }
            });

            // Calcular progreso
            let etapasCompletadas = 0;
            const totalEtapas = 5; // CV, Psico, Médica, Técnica, Contratación

            if (candidato.cv_url) etapasCompletadas++;
            if (pruebasPsico.completadas > 0) etapasCompletadas++;
            if (pruebaMedica) etapasCompletadas++;
            if (pruebaTecnica) etapasCompletadas++;
            if (contratacion) etapasCompletadas++;

            const porcentajeProgreso = Math.round((etapasCompletadas / totalEtapas) * 100);

            return {
                id: postulacion.id,
                candidato: {
                    nombre: candidato.usuario.nombre,
                    email: candidato.usuario.email,
                    telefono: candidato.usuario.telefono,
                    cv_url: candidato.cv_url
                },
                vacante: {
                    id: postulacion.vacante.id,
                    titulo: postulacion.vacante.titulo
                },
                estado: postulacion.estado,
                fechaPostulacion: postulacion.created_at,
                pruebasPsicometricas: pruebasPsico,
                pruebaMedica: pruebaMedica ? {
                    porcentaje: pruebaMedica.porcentaje_aprobacion,
                    fecha: pruebaMedica.fecha_evaluacion
                } : null,
                pruebaTecnica: pruebaTecnica ? {
                    porcentaje: pruebaTecnica.porcentaje_aprobacion,
                    fecha: pruebaTecnica.fecha_evaluacion
                } : null,
                contratacion: contratacion ? {
                    fecha: contratacion.fecha_contratacion,
                    cargo: contratacion.cargo
                } : null,
                progreso: {
                    porcentaje: porcentajeProgreso,
                    etapasCompletadas,
                    totalEtapas
                }
            };
        }));

        return ResponseUtil.success(res, seguimiento);

    } catch (error) {
        console.error('Error al obtener seguimiento:', error);
        return ResponseUtil.serverError(res, 'Error al obtener seguimiento', error);
    }
};

module.exports = {
    obtenerPlanilla,
    actualizarEstadoEmpleado,
    generarCodigoEmpleado,
    obtenerEmpleadosPeriodoPrueba,
    finalizarPeriodoPrueba,
    obtenerSeguimiento
};
