const bcrypt = require('bcrypt');
const { Usuario, Rol, Empresa, Candidato } = require('../../models');
const { generateToken, generatePasswordResetToken } = require('../../utils/jwt.util');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError, NotFoundError, BadRequestError } = require('../../utils/errors.util');

/**
 * Registro de nuevo usuario
 */
const registro = async (req, res) => {
    try {
        const { nombre, email, contraseña, telefono, rol } = req.body;

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return ResponseUtil.error(res, 'El email ya está registrado', 409);
        }

        // Buscar el rol
        const rolObj = await Rol.findOne({ where: { nombre: rol || 'candidato' } });
        if (!rolObj) {
            return ResponseUtil.error(res, 'Rol no válido', 400);
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            contraseña: hashedPassword,
            telefono,
            id_rol: rolObj.id,
            email_verificado: false
        });

        // Crear perfil según el rol
        if (rol === 'empresa') {
            await Empresa.create({
                id_usuario: nuevoUsuario.id,
                nombre_empresa: req.body.nombre_empresa || nombre
            });
        } else if (rol === 'candidato' || !rol) {
            await Candidato.create({
                id_usuario: nuevoUsuario.id
            });
        }

        // Generar token
        const token = generateToken({
            id: nuevoUsuario.id,
            email: nuevoUsuario.email,
            rol: rolObj.nombre
        });

        return ResponseUtil.created(res, {
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: rolObj.nombre
            },
            token
        }, 'Usuario registrado exitosamente');

    } catch (error) {
        console.error('Error en registro:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Login de usuario
 */
const login = async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        // Buscar usuario con su rol
        const usuario = await Usuario.findOne({
            where: { email },
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'nombre', 'permisos']
            }]
        });

        if (!usuario) {
            return ResponseUtil.unauthorized(res, 'Credenciales inválidas');
        }

        // Verificar contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return ResponseUtil.unauthorized(res, 'Credenciales inválidas');
        }

        // Verificar estado del usuario
        if (usuario.estado !== 'activo') {
            return ResponseUtil.forbidden(res, 'Usuario inactivo o suspendido');
        }

        // Actualizar último acceso
        await usuario.update({ ultimo_acceso: new Date() });

        // Generar token
        const token = generateToken({
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol.nombre
        });

        return ResponseUtil.success(res, {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol.nombre,
                avatar: usuario.avatar
            },
            token
        }, 'Login exitoso');

    } catch (error) {
        console.error('Error en login:', error);
        return ResponseUtil.serverError(res, 'Error al iniciar sesión', error);
    }
};

/**
 * Obtener perfil del usuario autenticado
 */
const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.userId, {
            include: [
                {
                    model: Rol,
                    as: 'rol',
                    attributes: ['id', 'nombre', 'permisos']
                },
                {
                    model: Empresa,
                    as: 'empresa',
                    required: false
                },
                {
                    model: Candidato,
                    as: 'candidato',
                    required: false
                }
            ],
            attributes: { exclude: ['contraseña'] }
        });

        if (!usuario) {
            return ResponseUtil.notFound(res, 'Usuario no encontrado');
        }

        return ResponseUtil.success(res, usuario, 'Perfil obtenido exitosamente');

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return ResponseUtil.serverError(res, 'Error al obtener perfil', error);
    }
};

/**
 * Actualizar perfil del usuario autenticado
 */
const actualizarPerfil = async (req, res) => {
    try {
        const { nombre, telefono, avatar } = req.body;

        const usuario = await Usuario.findByPk(req.userId);
        if (!usuario) {
            return ResponseUtil.notFound(res, 'Usuario no encontrado');
        }

        await usuario.update({
            nombre: nombre || usuario.nombre,
            telefono: telefono || usuario.telefono,
            avatar: avatar || usuario.avatar
        });

        return ResponseUtil.success(res, {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            avatar: usuario.avatar
        }, 'Perfil actualizado exitosamente');

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Cambiar contraseña
 */
const cambiarContraseña = async (req, res) => {
    try {
        const { contraseñaActual, contraseñaNueva } = req.body;

        const usuario = await Usuario.findByPk(req.userId);
        if (!usuario) {
            return ResponseUtil.notFound(res, 'Usuario no encontrado');
        }

        // Verificar contraseña actual
        const contraseñaValida = await bcrypt.compare(contraseñaActual, usuario.contraseña);
        if (!contraseñaValida) {
            return ResponseUtil.error(res, 'Contraseña actual incorrecta', 400);
        }

        // Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(contraseñaNueva, 10);

        await usuario.update({ contraseña: hashedPassword });

        return ResponseUtil.success(res, null, 'Contraseña actualizada exitosamente');

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        return ResponseUtil.serverError(res, 'Error al cambiar contraseña', error);
    }
};

/**
 * Solicitar recuperación de contraseña
 */
const solicitarRecuperacion = async (req, res) => {
    try {
        const { email } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            // Por seguridad, no revelar si el email existe o no
            return ResponseUtil.success(res, null, 'Si el email existe, recibirás instrucciones de recuperación');
        }

        // Generar token de recuperación
        const token = generatePasswordResetToken({ id: usuario.id, email: usuario.email });
        const expiracion = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        await usuario.update({
            token_recuperacion: token,
            token_expiracion: expiracion
        });

        // TODO: Aquí deberías enviar un email con el token
        // Por ahora solo retornamos success
        console.log('Token de recuperación:', token);

        return ResponseUtil.success(res, null, 'Si el email existe, recibirás instrucciones de recuperación');

    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        return ResponseUtil.serverError(res, 'Error al procesar solicitud', error);
    }
};

/**
 * Restablecer contraseña con token
 */
const restablecerContraseña = async (req, res) => {
    try {
        const { token, contraseñaNueva } = req.body;

        const usuario = await Usuario.findOne({
            where: { token_recuperacion: token }
        });

        if (!usuario) {
            return ResponseUtil.error(res, 'Token inválido', 400);
        }

        // Verificar que el token no haya expirado
        if (new Date() > usuario.token_expiracion) {
            return ResponseUtil.error(res, 'Token expirado', 400);
        }

        // Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(contraseñaNueva, 10);

        await usuario.update({
            contraseña: hashedPassword,
            token_recuperacion: null,
            token_expiracion: null
        });

        return ResponseUtil.success(res, null, 'Contraseña restablecida exitosamente');

    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        return ResponseUtil.serverError(res, 'Error al restablecer contraseña', error);
    }
};

module.exports = {
    registro,
    login,
    obtenerPerfil,
    actualizarPerfil,
    cambiarContraseña,
    solicitarRecuperacion,
    restablecerContraseña
};
