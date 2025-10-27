/**
 * Utilidad para respuestas estandarizadas del API
 */

class ResponseUtil {
    /**
     * Respuesta exitosa
     * @param {Object} res - Response de Express
     * @param {*} data - Datos a retornar
     * @param {String} message - Mensaje opcional
     * @param {Number} statusCode - Código HTTP (default: 200)
     */
    static success(res, data = null, message = 'Operación exitosa', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    /**
     * Respuesta de error
     * @param {Object} res - Response de Express
     * @param {String} message - Mensaje de error
     * @param {Number} statusCode - Código HTTP (default: 400)
     * @param {*} errors - Errores adicionales (validación, etc)
     */
    static error(res, message = 'Error en la operación', statusCode = 400, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }

    /**
     * Respuesta de creación exitosa
     * @param {Object} res - Response de Express
     * @param {*} data - Datos creados
     * @param {String} message - Mensaje opcional
     */
    static created(res, data, message = 'Recurso creado exitosamente') {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

    /**
     * Respuesta no encontrado
     * @param {Object} res - Response de Express
     * @param {String} message - Mensaje opcional
     */
    static notFound(res, message = 'Recurso no encontrado') {
        return res.status(404).json({
            success: false,
            message
        });
    }

    /**
     * Respuesta no autorizado
     * @param {Object} res - Response de Express
     * @param {String} message - Mensaje opcional
     */
    static unauthorized(res, message = 'No autorizado') {
        return res.status(401).json({
            success: false,
            message
        });
    }

    /**
     * Respuesta prohibido
     * @param {Object} res - Response de Express
     * @param {String} message - Mensaje opcional
     */
    static forbidden(res, message = 'Acceso prohibido') {
        return res.status(403).json({
            success: false,
            message
        });
    }

    /**
     * Respuesta de validación fallida
     * @param {Object} res - Response de Express
     * @param {*} errors - Errores de validación
     */
    static validationError(res, errors) {
        return res.status(422).json({
            success: false,
            message: 'Error de validación',
            errors
        });
    }

    /**
     * Respuesta de error interno del servidor
     * @param {Object} res - Response de Express
     * @param {String} message - Mensaje opcional
     * @param {*} error - Error object (solo en desarrollo)
     */
    static serverError(res, message = 'Error interno del servidor', error = null) {
        const response = {
            success: false,
            message
        };

        // Solo incluir detalles del error en desarrollo
        if (process.env.NODE_ENV === 'development' && error) {
            response.error = {
                message: error.message,
                stack: error.stack
            };
        }

        return res.status(500).json(response);
    }
}

module.exports = ResponseUtil;
