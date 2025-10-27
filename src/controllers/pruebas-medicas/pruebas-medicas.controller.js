const { PruebaMedica, Candidato, Postulacion, Vacante, Empresa } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');

/**
 * Solicitar prueba médica (empresa)
 */
const solicitarPruebaMedica = async (req, res) => {
    try {
        const { id_candidato, id_postulacion, id_vacante, tipo_prueba, nombre_prueba, descripcion } = req.body;

        const nuevaPrueba = await PruebaMedica.create({
            id_candidato,
            id_postulacion,
            id_vacante,
            tipo_prueba,
            nombre_prueba,
            descripcion,
            fecha_solicitud: new Date(),
            estado: 'pendiente',
            resultado: 'pendiente'
        });

        return ResponseUtil.created(res, nuevaPrueba, 'Prueba médica solicitada exitosamente');

    } catch (error) {
        console.error('Error al solicitar prueba médica:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener mis pruebas médicas (candidato)
 */
const misPruebasMedicas = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.error(res, 'No tienes un perfil de candidato', 403);
        }

        const pruebas = await PruebaMedica.findAll({
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
            order: [['fecha_solicitud', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas médicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas médicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas médicas', error);
    }
};

/**
 * Obtener pruebas médicas de un candidato (empresa)
 */
const pruebasMedicasCandidato = async (req, res) => {
    try {
        const { id_candidato } = req.params;

        const pruebas = await PruebaMedica.findAll({
            where: { id_candidato },
            order: [['fecha_solicitud', 'DESC']]
        });

        return ResponseUtil.success(res, pruebas, 'Pruebas médicas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener pruebas médicas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener pruebas médicas', error);
    }
};

/**
 * Actualizar resultado de prueba médica
 */
const actualizarResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            fecha_realizacion,
            fecha_resultado,
            resultado,
            observaciones,
            restricciones,
            medico_responsable,
            institucion_medica,
            documento_resultado_url,
            valido_hasta
        } = req.body;

        const prueba = await PruebaMedica.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba médica no encontrada');
        }

        await prueba.update({
            fecha_realizacion,
            fecha_resultado,
            resultado,
            observaciones,
            restricciones,
            medico_responsable,
            institucion_medica,
            documento_resultado_url,
            estado: 'resultado_recibido',
            valido_hasta
        });

        return ResponseUtil.success(res, prueba, 'Resultado actualizado exitosamente');

    } catch (error) {
        console.error('Error al actualizar resultado:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Eliminar prueba médica
 */
const eliminarPruebaMedica = async (req, res) => {
    try {
        const { id } = req.params;

        const prueba = await PruebaMedica.findByPk(id);
        if (!prueba) {
            return ResponseUtil.notFound(res, 'Prueba médica no encontrada');
        }

        await prueba.destroy();

        return ResponseUtil.success(res, null, 'Prueba médica eliminada exitosamente');

    } catch (error) {
        console.error('Error al eliminar prueba médica:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar prueba médica', error);
    }
};

module.exports = {
    solicitarPruebaMedica,
    misPruebasMedicas,
    pruebasMedicasCandidato,
    actualizarResultado,
    eliminarPruebaMedica
};
