const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala_en_produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Genera un token JWT
 * @param {Object} payload - Datos a incluir en el token
 * @param {String} expiresIn - Tiempo de expiración (default: 24h)
 * @returns {String} Token JWT
 */
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verifica y decodifica un token JWT
 * @param {String} token - Token a verificar
 * @returns {Object} Payload decodificado
 * @throws {Error} Si el token es inválido o ha expirado
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expirado');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Token inválido');
        }
        throw error;
    }
};

/**
 * Decodifica un token sin verificar (útil para debugging)
 * @param {String} token - Token a decodificar
 * @returns {Object} Payload decodificado
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

/**
 * Genera un token de recuperación de contraseña (expira en 1 hora)
 * @param {Object} payload - Datos del usuario
 * @returns {String} Token de recuperación
 */
const generatePasswordResetToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    generatePasswordResetToken
};
