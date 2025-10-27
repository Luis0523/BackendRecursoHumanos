const { Vacante, Empresa, Postulacion, Usuario } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const { Op } = require('sequelize');

/**
 * Crear una nueva vacante
 */
const crearVacante = async (req, res) => {
    try {
        // Verificar que el usuario tenga una empresa asociada
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const nuevaVacante = await Vacante.create({
            ...req.body,
            id_empresa: empresa.id
        });

        return ResponseUtil.created(res, nuevaVacante, 'Vacante creada exitosamente');

    } catch (error) {
        console.error('Error al crear vacante:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener todas las vacantes (con filtros y paginación)
 */
const obtenerVacantes = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            estado,
            modalidad,
            pais,
            ciudad,
            tipo_contrato,
            search
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Construir filtros
        const where = {};
        if (estado) where.estado = estado;
        if (modalidad) where.modalidad = modalidad;
        if (pais) where.pais = pais;
        if (ciudad) where.ciudad = ciudad;
        if (tipo_contrato) where.tipo_contrato = tipo_contrato;

        if (search) {
            where[Op.or] = [
                { titulo: { [Op.like]: `%${search}%` } },
                { descripcion: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: vacantes } = await Vacante.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{
                model: Empresa,
                as: 'empresa',
                attributes: ['id', 'nombre_empresa', 'sector', 'logo', 'ubicacion']
            }],
            order: [['fecha_publicacion', 'DESC']]
        });

        return ResponseUtil.success(res, {
            vacantes,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / parseInt(limit))
            }
        }, 'Vacantes obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener vacantes:', error);
        return ResponseUtil.serverError(res, 'Error al obtener vacantes', error);
    }
};

/**
 * Obtener una vacante por ID
 */
const obtenerVacantePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const vacante = await Vacante.findByPk(id, {
            include: [{
                model: Empresa,
                as: 'empresa',
                attributes: ['id', 'nombre_empresa', 'sector', 'descripcion', 'logo', 'sitio_web', 'ubicacion']
            }]
        });

        if (!vacante) {
            return ResponseUtil.notFound(res, 'Vacante no encontrada');
        }

        // Incrementar contador de vistas
        await vacante.increment('vistas');

        return ResponseUtil.success(res, vacante, 'Vacante obtenida exitosamente');

    } catch (error) {
        console.error('Error al obtener vacante:', error);
        return ResponseUtil.serverError(res, 'Error al obtener vacante', error);
    }
};

/**
 * Actualizar una vacante
 */
const actualizarVacante = async (req, res) => {
    try {
        const { id } = req.params;

        const vacante = await Vacante.findByPk(id, {
            include: [{
                model: Empresa,
                as: 'empresa'
            }]
        });

        if (!vacante) {
            return ResponseUtil.notFound(res, 'Vacante no encontrada');
        }

        // Verificar que la vacante pertenezca a la empresa del usuario
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para editar esta vacante');
        }

        await vacante.update(req.body);

        return ResponseUtil.success(res, vacante, 'Vacante actualizada exitosamente');

    } catch (error) {
        console.error('Error al actualizar vacante:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Eliminar una vacante
 */
const eliminarVacante = async (req, res) => {
    try {
        const { id } = req.params;

        const vacante = await Vacante.findByPk(id);
        if (!vacante) {
            return ResponseUtil.notFound(res, 'Vacante no encontrada');
        }

        // Verificar que la vacante pertenezca a la empresa del usuario
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para eliminar esta vacante');
        }

        await vacante.destroy();

        return ResponseUtil.success(res, null, 'Vacante eliminada exitosamente');

    } catch (error) {
        console.error('Error al eliminar vacante:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar vacante', error);
    }
};

/**
 * Obtener vacantes de mi empresa
 */
const misVacantes = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const vacantes = await Vacante.findAll({
            where: { id_empresa: empresa.id },
            include: [{
                model: Postulacion,
                as: 'postulaciones',
                attributes: ['id', 'estado', 'fecha_postulacion']
            }],
            order: [['fecha_publicacion', 'DESC']]
        });

        return ResponseUtil.success(res, vacantes, 'Vacantes obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener vacantes:', error);
        return ResponseUtil.serverError(res, 'Error al obtener vacantes', error);
    }
};

/**
 * Cambiar estado de una vacante
 */
const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const vacante = await Vacante.findByPk(id);
        if (!vacante) {
            return ResponseUtil.notFound(res, 'Vacante no encontrada');
        }

        // Verificar que la vacante pertenezca a la empresa del usuario
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || vacante.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para cambiar el estado');
        }

        await vacante.update({ estado });

        return ResponseUtil.success(res, vacante, 'Estado actualizado exitosamente');

    } catch (error) {
        console.error('Error al cambiar estado:', error);
        return ResponseUtil.serverError(res, 'Error al cambiar estado', error);
    }
};

module.exports = {
    crearVacante,
    obtenerVacantes,
    obtenerVacantePorId,
    actualizarVacante,
    eliminarVacante,
    misVacantes,
    cambiarEstado
};
