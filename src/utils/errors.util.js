/**
 * Utilidad para manejo de errores personalizados
 */

class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Error de validación', errors = []) {
        super(message, 422);
        this.errors = errors;
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'No autorizado') {
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Acceso prohibido') {
        super(message, 403);
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Solicitud incorrecta') {
        super(message, 400);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflicto - el recurso ya existe') {
        super(message, 409);
    }
}

/**
 * Maneja errores de Sequelize y los convierte a errores de aplicación
 * @param {Error} error - Error de Sequelize
 * @returns {AppError} Error de aplicación
 */
const handleSequelizeError = (error) => {
    // Error de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({
            field: err.path,
            message: err.message
        }));
        return new ValidationError('Error de validación', errors);
    }

    // Error de constraint único
    if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0]?.path || 'campo';
        return new ConflictError(`El ${field} ya existe en el sistema`);
    }

    // Error de foreign key
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return new BadRequestError('Error de integridad referencial - verifica las relaciones');
    }

    // Error de conexión a base de datos
    if (error.name === 'SequelizeConnectionError') {
        return new AppError('Error de conexión a la base de datos', 503);
    }

    // Error genérico de Sequelize
    return new AppError(error.message, 500);
};

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    BadRequestError,
    ConflictError,
    handleSequelizeError
};
