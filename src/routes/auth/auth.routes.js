const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');
const { sanitizeInput } = require('../../middlewares/validation.middleware');

/**
 * @route   POST /api/auth/registro
 * @desc    Registrar nuevo usuario
 * @access  Público
 */
router.post('/registro', sanitizeInput, authController.registro);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Público
 */
router.post('/login', sanitizeInput, authController.login);

/**
 * @route   GET /api/auth/perfil
 * @desc    Obtener perfil del usuario autenticado
 * @access  Privado
 */
router.get('/perfil', verificarToken, authController.obtenerPerfil);

/**
 * @route   PUT /api/auth/perfil
 * @desc    Actualizar perfil del usuario autenticado
 * @access  Privado
 */
router.put('/perfil', verificarToken, sanitizeInput, authController.actualizarPerfil);

/**
 * @route   PUT /api/auth/cambiar-contraseña
 * @desc    Cambiar contraseña del usuario autenticado
 * @access  Privado
 */
router.put('/cambiar-contraseña', verificarToken, sanitizeInput, authController.cambiarContraseña);

/**
 * @route   POST /api/auth/solicitar-recuperacion
 * @desc    Solicitar recuperación de contraseña
 * @access  Público
 */
router.post('/solicitar-recuperacion', sanitizeInput, authController.solicitarRecuperacion);

/**
 * @route   POST /api/auth/restablecer-contraseña
 * @desc    Restablecer contraseña con token
 * @access  Público
 */
router.post('/restablecer-contraseña', sanitizeInput, authController.restablecerContraseña);

module.exports = router;
