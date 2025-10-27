const { PruebaTecnica, Candidato, Vacante, Postulacion, Usuario, Empresa } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');

/**
 * Asignar prueba técnica (empresa)
 */
const asignarPruebaTecnica = async (req, res) => {
    try {
        const {
            id_candidato,
            id_vacante,
            id_postulacion,
            tipo_prueba,
            nombre_prueba,
            descripcion,
            instrucciones,
            fecha_limite,
            archivo_instrucciones_url
        } = req.body;

        const nuevaPrueba = await PruebaTecnica.create({
            id_candidato,
            id_vacante,
            id_postulacion,
            tipo_prueba,
            nombre_prueba,
            descripcion,
            instrucciones,
            fecha_asignacion: new Date(),
            fecha_limite,
            archivo_instrucciones_url,
            estado: 'asignada',
            resultado: 'pendiente'
        });

        return ResponseUtil.created(res, nuevaPrueba, 'Prueba técnica asignada exitosamente');

    } catch (error) {
        console.error('Error al asignar prueba técnica:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener mis pruebas técnicas (candidato)
 */
const misPruebasTecnicas = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const pruebas = await PruebaTecnica.findAll({
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
                }
            ],
            order: [['fecha_asignacion', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas técnicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas técnicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas técnicas', error);
    }
};

/**
 * Entregar prueba técnica (candidato)
 */
const entregarPrueba = async (req, res) => {
    try {
        const { id } = req.params;
        const { archivo_respuesta_url } = req.body;

        const prueba = await PruebaTecnica.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba técnica no encontrada');
        }

        // Verificar que la prueba pertenezca al candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato || prueba.id_candidato !== candidato.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para entregar esta prueba');
        }

        if (prueba.estado === 'evaluada') {
            return ResponseUtil.error(res, 'Esta prueba ya fue evaluada', 400);
        }

        await prueba.update({
            archivo_respuesta_url,
            fecha_entrega: new Date(),
            estado: 'entregada'
        });

        return ResponseUtil.success(res, prueba, 'Prueba entregada exitosamente');

    } catch (error) {
        console.error('Error al entregar prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Evaluar prueba técnica (empresa)
 */
const evaluarPrueba = async (req, res) => {
    try {
        const { id } = req.params;
        const { puntaje, resultado, comentarios_evaluador, aspectos_positivos, aspectos_negativos } = req.body;

        const prueba = await PruebaTecnica.findByPk(id, {
            include: [{
                model: Vacante,
                as: 'vacante'
            }]
        });

        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba técnica no encontrada');
        }

        // Verificar permisos (empresa)
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || prueba.vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para evaluar esta prueba');
        }

        await prueba.update({
            puntaje,
            resultado,
            comentarios_evaluador,
            aspectos_positivos,
            aspectos_negativos,
            fecha_evaluacion: new Date(),
            evaluador_id: req.userId,
            estado: 'evaluada'
        });

        return ResponseUtil.success(res, prueba, 'Prueba evaluada exitosamente');

    } catch (error) {
        console.error('Error al evaluar prueba:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener pruebas técnicas de un candidato (empresa)
 */
const pruebasTecnicasCandidato = async (req, res) => {
    try {
        const { id_candidato } = req.params;

        const pruebas = await PruebaTecnica.findAll({
            where: { id_candidato },
            include: [
                {
                    model: Usuario,
                    as: 'evaluador',
                    attributes: ['nombre', 'email']
                }
            ],
            order: [['fecha_asignacion', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas técnicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas técnicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas técnicas', error);
    }
};

module.exports = {
    asignarPruebaTecnica,
    misPruebasTecnicas,
    entregarPrueba,
    evaluarPrueba,
    pruebasTecnicasCandidato
};
