const { verifyToken } = require('../utils/jwt.util');
const ResponseUtil = require('../utils/response.util');
const { Usuario, Rol } = require('../models');

/**
 * Middleware para verificar que el usuario esté autenticado
 */
const verificarToken = async (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ResponseUtil.unauthorized(res, 'Token no proporcionado');
        }

        const token = authHeader.substring(7); // Remover "Bearer "

        // Verificar token
        const decoded = verifyToken(token);

        // Buscar usuario
        const usuario = await Usuario.findByPk(decoded.id, {
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre', 'permisos']
            }],
            attributes: { exclude: ['contraseña'] }
        });

        if (!usuario) {
            return ResponseUtil.unauthorized(res, 'Usuario no encontrado');
        }

        if (usuario.estado !== 'activo') {
            return ResponseUtil.forbidden(res, 'Usuario inactivo o suspendido');
        }

        // Agregar usuario al request
        req.usuario = usuario;
        req.userId = usuario.id;
        req.userRole = usuario.rol.nombre;

        next();
    } catch (error) {
        if (error.message === 'Token expirado') {
            return ResponseUtil.unauthorized(res, 'Token expirado');
        }
        if (error.message === 'Token inválido') {
            return ResponseUtil.unauthorized(res, 'Token inválido');
        }
        return ResponseUtil.serverError(res, 'Error al verificar token', error);
    }
};

/**
 * Middleware para verificar que el usuario tenga un rol específico
 * @param {String|Array} roles - Rol(es) permitido(s)
 */
const verificarRol = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return ResponseUtil.unauthorized(res, 'Usuario no autenticado');
        }

        const userRole = req.usuario.rol.nombre;

        if (!roles.includes(userRole)) {
            return ResponseUtil.forbidden(res, `Acceso denegado. Requiere rol: ${roles.join(' o ')}`);
        }

        next();
    };
};

/**
 * Middleware para verificar que el usuario sea administrador
 */
const esAdministrador = (req, res, next) => {
    return verificarRol('administrador')(req, res, next);
};

/**
 * Middleware para verificar que el usuario sea empresa
 */
const esEmpresa = (req, res, next) => {
    return verificarRol('empresa')(req, res, next);
};

/**
 * Middleware para verificar que el usuario sea candidato
 */
const esCandidato = (req, res, next) => {
    return verificarRol('candidato')(req, res, next);
};

/**
 * Middleware para verificar que el usuario sea el propietario del recurso
 * @param {String} paramName - Nombre del parámetro que contiene el ID del usuario propietario
 */
const esPropio = (paramName = 'id') => {
    return (req, res, next) => {
        const resourceUserId = parseInt(req.params[paramName]);
        const currentUserId = req.userId;

        if (resourceUserId !== currentUserId && req.userRole !== 'administrador') {
            return ResponseUtil.forbidden(res, 'No tienes permiso para acceder a este recurso');
        }

        next();
    };
};

module.exports = {
    verificarToken,
    verificarRol,
    esAdministrador,
    esEmpresa,
    esCandidato,
    esPropio
};
