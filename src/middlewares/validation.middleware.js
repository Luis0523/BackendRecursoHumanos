const ResponseUtil = require('../utils/response.util');

/**
 * Middleware genérico para validar datos de entrada
 * @param {Function} validationSchema - Función que retorna las reglas de validación
 */
const validate = (validationSchema) => {
    return (req, res, next) => {
        try {
            const { error, value } = validationSchema.validate(req.body, {
                abortEarly: false, // Retornar todos los errores, no solo el primero
                stripUnknown: true // Remover campos desconocidos
            });

            if (error) {
                const errors = error.details.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                return ResponseUtil.validationError(res, errors);
            }

            // Reemplazar req.body con los valores validados
            req.body = value;
            next();
        } catch (err) {
            return ResponseUtil.serverError(res, 'Error en validación', err);
        }
    };
};

/**
 * Middleware para validar que un ID sea un número entero positivo
 */
const validateId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = parseInt(req.params[paramName]);

        if (isNaN(id) || id <= 0) {
            return ResponseUtil.error(res, `El parámetro '${paramName}' debe ser un número entero positivo`, 400);
        }

        req.params[paramName] = id;
        next();
    };
};

/**
 * Middleware para validar paginación
 */
const validatePagination = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1) {
        return ResponseUtil.error(res, 'El número de página debe ser mayor a 0', 400);
    }

    if (limit < 1 || limit > 100) {
        return ResponseUtil.error(res, 'El límite debe estar entre 1 y 100', 400);
    }

    req.pagination = {
        page,
        limit,
        offset: (page - 1) * limit
    };

    next();
};

/**
 * Middleware para validar campos requeridos
 * @param {Array} requiredFields - Array de nombres de campos requeridos
 */
const requireFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = [];

        for (const field of requiredFields) {
            if (!req.body[field] && req.body[field] !== 0 && req.body[field] !== false) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            return ResponseUtil.error(
                res,
                `Campos requeridos faltantes: ${missingFields.join(', ')}`,
                400
            );
        }

        next();
    };
};

/**
 * Middleware para sanitizar entrada de usuario
 */
const sanitizeInput = (req, res, next) => {
    // Función recursiva para limpiar objetos
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj.trim();
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (typeof obj === 'object' && obj !== null) {
            const sanitized = {};
            for (const key in obj) {
                sanitized[key] = sanitize(obj[key]);
            }
            return sanitized;
        }
        return obj;
    };

    req.body = sanitize(req.body);
    next();
};

module.exports = {
    validate,
    validateId,
    validatePagination,
    requireFields,
    sanitizeInput
};
