const iaService = require('../services/ia.service');
const { Postulacion, Candidato, Usuario, Vacante } = require('../models');
const { PruebaAsignada, Respuesta, PreguntaPrueba, OpcionRespuesta, PruebaPsicometrica } = require('../models');

/**
 * Analizar compatibilidad entre candidato y vacante
 */
exports.analizarCompatibilidad = async (req, res) => {
    try {
        const { id_postulacion } = req.params;
        const idEmpresa = req.usuario.id_empresa || req.usuario.empresaId;

        console.log('Usuario:', req.usuario);
        console.log('ID Empresa:', idEmpresa);

        // Verificar que el servicio de IA esté disponible
        if (!iaService.isDisponible()) {
            return res.status(503).json({
                success: false,
                message: 'Servicio de IA no disponible. Configure OPENAI_API_KEY en las variables de entorno.'
            });
        }

        // Obtener la postulación con candidato y vacante
        const postulacion = await Postulacion.findOne({
            where: { id: id_postulacion },
            include: [
                {
                    model: Candidato,
                    as: 'candidato',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nombre', 'email']
                        }
                    ]
                },
                {
                    model: Vacante,
                    as: 'vacante',
                    ...(idEmpresa && { where: { id_empresa: idEmpresa } })
                }
            ]
        });

        if (!postulacion) {
            return res.status(404).json({
                success: false,
                message: 'Postulación no encontrada'
            });
        }

        // Preparar datos del candidato
        const candidatoData = {
            nombre: postulacion.candidato.usuario.nombre,
            titulo_profesional: postulacion.candidato.titulo_profesional,
            años_experiencia: postulacion.candidato.años_experiencia,
            perfil: postulacion.candidato.perfil,
            salario_esperado: postulacion.candidato.salario_esperado,
            disponibilidad: postulacion.candidato.disponibilidad,
            ciudad: postulacion.candidato.ciudad,
            pais: postulacion.candidato.pais
        };

        // Preparar datos de la vacante
        const vacanteData = {
            titulo: postulacion.vacante.titulo,
            descripcion: postulacion.vacante.descripcion,
            requisitos: postulacion.vacante.requisitos,
            salario_min: postulacion.vacante.salario_min,
            salario_max: postulacion.vacante.salario_max,
            ubicacion: postulacion.vacante.ubicacion,
            tipo_empleo: postulacion.vacante.tipo_empleo
        };

        // Realizar análisis con IA
        const resultado = await iaService.analizarCompatibilidadCandidato(candidatoData, vacanteData);

        // Guardar el análisis en notas de la postulación
        const notasActuales = postulacion.notas || '';
        const nuevasNotas = `${notasActuales}\n\n--- Análisis IA (${new Date().toLocaleString()}) ---\nCompatibilidad: ${resultado.analisis.porcentaje_compatibilidad}%\n${resultado.analisis.resumen}`;
        
        await postulacion.update({
            notas: nuevasNotas.trim()
        });

        res.json({
            success: true,
            message: 'Análisis completado exitosamente',
            analisis: resultado.analisis,
            tokens_usados: resultado.tokens_usados
        });

    } catch (error) {
        console.error('Error al analizar compatibilidad:', error);
        res.status(500).json({
            success: false,
            message: 'Error al analizar compatibilidad',
            error: error.message
        });
    }
};

/**
 * Analizar respuestas de prueba psicométrica
 */
exports.analizarPruebaPsicometrica = async (req, res) => {
    try {
        const { id_asignacion } = req.params;
        const idEmpresa = req.usuario.id_empresa || req.usuario.empresaId;

        if (!iaService.isDisponible()) {
            return res.status(503).json({
                success: false,
                message: 'Servicio de IA no disponible'
            });
        }

        // Obtener la asignación con todas las respuestas
        const asignacion = await PruebaAsignada.findOne({
            where: { id: id_asignacion },
            include: [
                {
                    model: PruebaPsicometrica,
                    as: 'prueba',
                    ...(idEmpresa && { where: { id_empresa: idEmpresa } })
                },
                {
                    model: Respuesta,
                    as: 'respuestas',
                    include: [
                        {
                            model: PreguntaPrueba,
                            as: 'pregunta'
                        },
                        {
                            model: OpcionRespuesta,
                            as: 'opcion_seleccionada'
                        }
                    ]
                }
            ]
        });

        if (!asignacion) {
            return res.status(404).json({
                success: false,
                message: 'Asignación de prueba no encontrada'
            });
        }

        if (asignacion.estado !== 'completada') {
            return res.status(400).json({
                success: false,
                message: 'La prueba no ha sido completada aún'
            });
        }

        // Preparar datos de la prueba
        const pruebaData = {
            nombre: asignacion.prueba.nombre,
            descripcion: asignacion.prueba.descripcion
        };

        // Realizar análisis con IA
        const resultado = await iaService.analizarRespuestasPsicometricas(pruebaData, asignacion.respuestas);

        // Guardar el análisis en observaciones de la asignación
        await asignacion.update({
            observaciones: JSON.stringify(resultado.analisis)
        });

        res.json({
            success: true,
            message: 'Análisis completado exitosamente',
            analisis: resultado.analisis,
            tokens_usados: resultado.tokens_usados
        });

    } catch (error) {
        console.error('Error al analizar prueba psicométrica:', error);
        res.status(500).json({
            success: false,
            message: 'Error al analizar prueba',
            error: error.message
        });
    }
};

/**
 * Generar preguntas de entrevista
 */
exports.generarPreguntasEntrevista = async (req, res) => {
    try {
        const { id_postulacion } = req.params;
        const idEmpresa = req.usuario.id_empresa || req.usuario.empresaId;

        if (!iaService.isDisponible()) {
            return res.status(503).json({
                success: false,
                message: 'Servicio de IA no disponible'
            });
        }

        // Obtener la postulación
        const postulacion = await Postulacion.findOne({
            where: { id: id_postulacion },
            include: [
                {
                    model: Candidato,
                    as: 'candidato',
                    include: [
                        {
                            model: Usuario,
                            as: 'usuario',
                            attributes: ['nombre']
                        }
                    ]
                },
                {
                    model: Vacante,
                    as: 'vacante',
                    ...(idEmpresa && { where: { id_empresa: idEmpresa } })
                }
            ]
        });

        if (!postulacion) {
            return res.status(404).json({
                success: false,
                message: 'Postulación no encontrada'
            });
        }

        // Preparar datos
        const candidatoData = {
            titulo_profesional: postulacion.candidato.titulo_profesional,
            años_experiencia: postulacion.candidato.años_experiencia,
            perfil: postulacion.candidato.perfil
        };

        const vacanteData = {
            titulo: postulacion.vacante.titulo,
            descripcion: postulacion.vacante.descripcion,
            requisitos: postulacion.vacante.requisitos
        };

        // Generar preguntas con IA
        const resultado = await iaService.generarPreguntasEntrevista(candidatoData, vacanteData);

        res.json({
            success: true,
            message: 'Preguntas generadas exitosamente',
            preguntas: resultado.preguntas,
            tokens_usados: resultado.tokens_usados
        });

    } catch (error) {
        console.error('Error al generar preguntas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar preguntas',
            error: error.message
        });
    }
};

/**
 * Verificar estado del servicio de IA
 */
exports.verificarEstado = async (req, res) => {
    try {
        const disponible = iaService.isDisponible();
        
        res.json({
            success: true,
            disponible,
            mensaje: disponible 
                ? 'Servicio de IA disponible' 
                : 'Servicio de IA no configurado. Configure OPENAI_API_KEY.'
        });

    } catch (error) {
        console.error('Error al verificar estado de IA:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar estado',
            error: error.message
        });
    }
};
