const {
    Prueba,
    Pregunta,
    OpcionRespuesta,
    AsignacionPrueba,
    RespuestaCandidato,
    ResultadoPrueba,
    Candidato,
    Vacante,
    Empresa,
    Usuario
} = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const { Op } = require('sequelize');

/**
 * Crear una prueba psicométrica (admin o empresa)
 */
const crearPrueba = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            tipo,
            categoria,
            duracion_minutos,
            instrucciones,
            puntaje_minimo_aprobacion,
            es_publica
        } = req.body;

        const nuevaPrueba = await Prueba.create({
            nombre,
            descripcion,
            tipo,
            categoria,
            duracion_minutos,
            instrucciones,
            puntaje_minimo_aprobacion,
            es_publica: es_publica || false,
            creador_id: req.userId,
            estado: 'activa'
        });

        return ResponseUtil.created(res, nuevaPrueba, 'Prueba creada exitosamente');

    } catch (error) {
        console.error('Error al crear prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener todas las pruebas disponibles
 */
const obtenerPruebas = async (req, res) => {
    try {
        const { tipo, estado } = req.query;

        const where = {};
        if (tipo) where.tipo = tipo;
        if (estado) where.estado = estado;

        // Mostrar solo públicas o las creadas por el usuario
        where[Op.or] = [
            { es_publica: true },
            { creador_id: req.userId }
        ];

        const pruebas = await Prueba.findAll({
            where,
            include: [
                {
                    model: Usuario,
                    as: 'creador',
                    attributes: ['nombre']
                },
                {
                    model: Pregunta,
                    as: 'preguntas',
                    attributes: ['id']
                }
            ],
            attributes: { exclude: ['creador_id'] },
            order: [['created_at', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas', error);
    }
};

/**
 * Obtener una prueba con todas sus preguntas y opciones
 */
const obtenerPruebaCompleta = async (req, res) => {
    try {
        const { id } = req.params;

        const prueba = await Prueba.findByPk(id, {
            include: [{
                model: Pregunta,
                as: 'preguntas',
                include: [{
                    model: OpcionRespuesta,
                    as: 'opciones',
                    attributes: { exclude: ['es_correcta', 'puntaje'] } // Ocultar respuestas correctas
                }],
                order: [['orden', 'ASC']]
            }]
        });

        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba no encontrada');
        }

        return ResponseUtil.success(res, prueba, 'Prueba obtenida exitosamente');

    } catch (error) {
        console.error('Error al obtener prueba:', error);
        return ResponseUtil.serverError(res, 'Error al obtener prueba', error);
    }
};

/**
 * Asignar prueba a un candidato (empresa)
 */
const asignarPrueba = async (req, res) => {
    try {
        const { id_candidato, id_prueba, id_vacante, fecha_limite, intentos_permitidos } = req.body;

        // Verificar que la vacante pertenezca a la empresa (si aplica)
        if (id_vacante) {
            const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
            if (!empresa) {
                return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
            }

            const vacante = await Vacante.findByPk(id_vacante);
            if (!vacante || vacante.id_empresa !== empresa.id) {
                return ResponseUtil.forbidden(res, 'No tienes permiso para asignar pruebas a esta vacante');
            }
        }

        // Verificar si ya existe una asignación
        const asignacionExistente = await AsignacionPrueba.findOne({
            where: { id_candidato, id_prueba, id_vacante }
        });

        if (asignacionExistente) {
            return ResponseUtil.error(res, 'El candidato ya tiene esta prueba asignada', 409);
        }

        const asignacion = await AsignacionPrueba.create({
            id_candidato,
            id_prueba,
            id_vacante,
            id_empresa: req.body.id_empresa, // Si se proporciona
            fecha_asignacion: new Date(),
            fecha_limite,
            intentos_permitidos: intentos_permitidos || 1,
            intentos_realizados: 0,
            estado: 'pendiente'
        });

        return ResponseUtil.created(res, asignacion, 'Prueba asignada exitosamente');

    } catch (error) {
        console.error('Error al asignar prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener pruebas asignadas a un candidato
 */
const misPruebasAsignadas = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const asignaciones = await AsignacionPrueba.findAll({
            where: { id_candidato: candidato.id },
            include: [
                {
                    model: Prueba,
                    as: 'prueba',
                    attributes: ['id', 'nombre', 'descripcion', 'tipo', 'duracion_minutos', 'instrucciones']
                },
                {
                    model: Vacante,
                    as: 'vacante',
                    attributes: ['titulo']
                },
                {
                    model: ResultadoPrueba,
                    as: 'resultado',
                    required: false
                }
            ],
            order: [['fecha_asignacion', 'DESC']]
        });

        return ResponseUtil.success(res, asignaciones, 'Pruebas asignadas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas asignadas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas asignadas', error);
    }
};

/**
 * Iniciar una prueba (candidato)
 */
const iniciarPrueba = async (req, res) => {
    try {
        const { id_asignacion } = req.params;

        const asignacion = await AsignacionPrueba.findByPk(id_asignacion);
        if (!asignacion) {
            return ResponseUtil.notFound(res, 'Asignación no encontrada');
        }

        // Verificar que pertenezca al candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato || asignacion.id_candidato !== candidato.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para iniciar esta prueba');
        }

        // Verificar intentos
        if (asignacion.intentos_realizados >= asignacion.intentos_permitidos) {
            return ResponseUtil.error(res, 'Has agotado tus intentos para esta prueba', 400);
        }

        // Verificar fecha límite
        if (asignacion.fecha_limite && new Date() > new Date(asignacion.fecha_limite)) {
            await asignacion.update({ estado: 'vencida' });
            return ResponseUtil.error(res, 'Esta prueba ha vencido', 400);
        }

        await asignacion.update({
            estado: 'en_progreso',
            fecha_inicio: new Date(),
            ip_inicio: req.ip
        });

        return ResponseUtil.success(res, asignacion, 'Prueba iniciada exitosamente');

    } catch (error) {
        console.error('Error al iniciar prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Guardar respuesta de candidato
 */
const guardarRespuesta = async (req, res) => {
    try {
        const { id_asignacion, id_pregunta, id_opcion_seleccionada, respuesta_texto, tiempo_respuesta_segundos } = req.body;

        // Verificar que la asignación esté en progreso
        const asignacion = await AsignacionPrueba.findByPk(id_asignacion);
        if (!asignacion || asignacion.estado !== 'en_progreso') {
            return ResponseUtil.error(res, 'La prueba no está en progreso', 400);
        }

        // Calcular puntaje si es opción múltiple
        let puntaje_obtenido = 0;
        if (id_opcion_seleccionada) {
            const opcion = await OpcionRespuesta.findByPk(id_opcion_seleccionada);
            if (opcion && opcion.es_correcta) {
                puntaje_obtenido = opcion.puntaje || 1;
            }
        }

        const respuesta = await RespuestaCandidato.create({
            id_asignacion,
            id_pregunta,
            id_opcion_seleccionada,
            respuesta_texto,
            tiempo_respuesta_segundos,
            puntaje_obtenido
        });

        return ResponseUtil.created(res, respuesta, 'Respuesta guardada exitosamente');

    } catch (error) {
        console.error('Error al guardar respuesta:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Finalizar prueba y calcular resultado
 */
const finalizarPrueba = async (req, res) => {
    try {
        const { id_asignacion } = req.params;

        const asignacion = await AsignacionPrueba.findByPk(id_asignacion, {
            include: [{
                model: Prueba,
                as: 'prueba'
            }]
        });

        if (!asignacion) {
            return ResponseUtil.notFound(res, 'Asignación no encontrada');
        }

        // Calcular resultados
        const respuestas = await RespuestaCandidato.findAll({
            where: { id_asignacion }
        });

        const puntaje_total = respuestas.reduce((sum, r) => sum + r.puntaje_obtenido, 0);
        const preguntas = await Pregunta.findAll({
            where: { id_prueba: asignacion.id_prueba }
        });
        const puntaje_maximo = preguntas.reduce((sum, p) => sum + p.puntaje_maximo, 0);
        const porcentaje = (puntaje_total / puntaje_maximo) * 100;

        const respuestas_correctas = respuestas.filter(r => r.puntaje_obtenido > 0).length;
        const respuestas_incorrectas = respuestas.filter(r => r.puntaje_obtenido === 0 && r.id_opcion_seleccionada).length;
        const preguntas_sin_responder = preguntas.length - respuestas.length;

        const aprobado = puntaje_total >= asignacion.prueba.puntaje_minimo_aprobacion;

        // Calcular tiempo total
        const tiempo_total_segundos = Math.floor((new Date() - new Date(asignacion.fecha_inicio)) / 1000);

        // Crear resultado
        const resultado = await ResultadoPrueba.create({
            id_asignacion,
            id_candidato: asignacion.id_candidato,
            id_prueba: asignacion.id_prueba,
            puntaje_total,
            puntaje_maximo,
            porcentaje,
            aprobado,
            tiempo_total_segundos,
            respuestas_correctas,
            respuestas_incorrectas,
            preguntas_sin_responder
        });

        // Actualizar asignación
        await asignacion.update({
            estado: 'completada',
            fecha_completado: new Date(),
            tiempo_total_segundos,
            intentos_realizados: asignacion.intentos_realizados + 1,
            ip_fin: req.ip
        });

        return ResponseUtil.success(res, resultado, 'Prueba finalizada exitosamente');

    } catch (error) {
        console.error('Error al finalizar prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener resultado de una prueba
 */
const obtenerResultado = async (req, res) => {
    try {
        const { id_asignacion } = req.params;

        const resultado = await ResultadoPrueba.findOne({
            where: { id_asignacion },
            include: [
                {
                    model: Prueba,
                    as: 'prueba',
                    attributes: ['nombre', 'tipo']
                },
                {
                    model: AsignacionPrueba,
                    as: 'asignacion',
                    attributes: ['fecha_inicio', 'fecha_completado']
                }
            ]
        });

        if (!resultado) {
            return ResponseUtil.notFound(res, 'Resultado no encontrado');
        }

        return ResponseUtil.success(res, resultado, 'Resultado obtenido exitosamente');

    } catch (error) {
        console.error('Error al obtener resultado:', error);
        return ResponseUtil.serverError(res, 'Error al obtener resultado', error);
    }
};

/**
 * Crear una pregunta para una prueba
 */
const crearPregunta = async (req, res) => {
    try {
        const {
            id_prueba,
            texto_pregunta,
            tipo_pregunta,
            puntos,
            puntaje_maximo,
            opciones
        } = req.body;

        // Verificar que la prueba existe
        const prueba = await Prueba.findByPk(id_prueba);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba no encontrada');
        }

        // Crear pregunta
        const pregunta = await Pregunta.create({
            id_prueba,
            texto_pregunta,
            tipo_pregunta,
            puntaje_maximo: puntaje_maximo || puntos || 1,
            orden: await Pregunta.count({ where: { id_prueba } }) + 1,
            es_obligatoria: true
        });

        // Crear opciones si aplica
        if (opciones && opciones.length > 0) {
            const opcionesData = opciones.map((opcion, index) => ({
                id_pregunta: pregunta.id,
                texto_opcion: opcion.texto_opcion,
                es_correcta: opcion.es_correcta || false,
                puntaje: opcion.es_correcta ? (puntaje_maximo || puntos || 1) : 0,
                orden: index + 1
            }));

            await OpcionRespuesta.bulkCreate(opcionesData);
        }

        // Obtener pregunta completa con opciones
        const preguntaCompleta = await Pregunta.findByPk(pregunta.id, {
            include: [{
                model: OpcionRespuesta,
                as: 'opciones'
            }]
        });

        return ResponseUtil.created(res, preguntaCompleta, 'Pregunta creada exitosamente');

    } catch (error) {
        console.error('Error al crear pregunta:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Actualizar una pregunta existente
 */
const actualizarPregunta = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            texto_pregunta,
            tipo_pregunta,
            puntos,
            puntaje_maximo,
            opciones
        } = req.body;

        const pregunta = await Pregunta.findByPk(id);
        if (!pregunta) {
            return ResponseUtil.notFound(res, 'Pregunta no encontrada');
        }

        // Actualizar pregunta
        await pregunta.update({
            texto_pregunta,
            tipo_pregunta,
            puntaje_maximo: puntaje_maximo || puntos || pregunta.puntaje_maximo
        });

        // Actualizar opciones si aplica
        if (opciones && opciones.length > 0) {
            // Eliminar opciones anteriores
            await OpcionRespuesta.destroy({ where: { id_pregunta: id } });

            // Crear nuevas opciones
            const opcionesData = opciones.map((opcion, index) => ({
                id_pregunta: pregunta.id,
                texto_opcion: opcion.texto_opcion,
                es_correcta: opcion.es_correcta || false,
                puntaje: opcion.es_correcta ? (puntaje_maximo || puntos || 1) : 0,
                orden: index + 1
            }));

            await OpcionRespuesta.bulkCreate(opcionesData);
        }

        // Obtener pregunta completa con opciones
        const preguntaCompleta = await Pregunta.findByPk(pregunta.id, {
            include: [{
                model: OpcionRespuesta,
                as: 'opciones'
            }]
        });

        return ResponseUtil.success(res, preguntaCompleta, 'Pregunta actualizada exitosamente');

    } catch (error) {
        console.error('Error al actualizar pregunta:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Eliminar una pregunta
 */
const eliminarPregunta = async (req, res) => {
    try {
        const { id } = req.params;

        const pregunta = await Pregunta.findByPk(id);
        if (!pregunta) {
            return ResponseUtil.notFound(res, 'Pregunta no encontrada');
        }

        // Eliminar opciones asociadas primero
        await OpcionRespuesta.destroy({ where: { id_pregunta: id } });

        // Eliminar pregunta
        await pregunta.destroy();

        return ResponseUtil.success(res, null, 'Pregunta eliminada exitosamente');

    } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Actualizar una prueba existente
 */
const actualizarPrueba = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            descripcion,
            tipo,
            categoria,
            duracion_minutos,
            instrucciones,
            puntaje_minimo_aprobacion,
            estado,
            es_publica
        } = req.body;

        const prueba = await Prueba.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba no encontrada');
        }

        // Verificar permisos
        if (prueba.creador_id !== req.userId) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para modificar esta prueba');
        }

        await prueba.update({
            nombre,
            descripcion,
            tipo,
            categoria,
            duracion_minutos,
            instrucciones,
            puntaje_minimo_aprobacion,
            estado,
            es_publica
        });

        return ResponseUtil.success(res, prueba, 'Prueba actualizada exitosamente');

    } catch (error) {
        console.error('Error al actualizar prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Eliminar una prueba
 */
const eliminarPrueba = async (req, res) => {
    try {
        const { id } = req.params;

        const prueba = await Prueba.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba no encontrada');
        }

        // Verificar permisos
        if (prueba.creador_id !== req.userId) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para eliminar esta prueba');
        }

        // Verificar si tiene asignaciones
        const asignaciones = await AsignacionPrueba.count({ where: { id_prueba: id } });
        if (asignaciones > 0) {
            return ResponseUtil.error(res, 'No se puede eliminar la prueba porque tiene asignaciones activas', 409);
        }

        // Obtener preguntas
        const preguntas = await Pregunta.findAll({ where: { id_prueba: id } });

        // Eliminar opciones de todas las preguntas
        for (const pregunta of preguntas) {
            await OpcionRespuesta.destroy({ where: { id_pregunta: pregunta.id } });
        }

        // Eliminar preguntas
        await Pregunta.destroy({ where: { id_prueba: id } });

        // Eliminar prueba
        await prueba.destroy();

        return ResponseUtil.success(res, null, 'Prueba eliminada exitosamente');

    } catch (error) {
        console.error('Error al eliminar prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

module.exports = {
    crearPrueba,
    obtenerPruebas,
    obtenerPruebaCompleta,
    actualizarPrueba,
    eliminarPrueba,
    asignarPrueba,
    misPruebasAsignadas,
    iniciarPrueba,
    guardarRespuesta,
    finalizarPrueba,
    obtenerResultado,
    crearPregunta,
    actualizarPregunta,
    eliminarPregunta
};
