const { Empresa, Usuario, Vacante } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');

/**
 * Obtener perfil de empresa (público)
 */
const obtenerEmpresaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const empresa = await Empresa.findByPk(id, {
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre', 'email']
            }],
            attributes: { exclude: ['id_usuario'] }
        });

        if (!empresa) {
            return ResponseUtil.notFound(res, 'Empresa no encontrada');
        }

        return ResponseUtil.success(res, empresa, 'Empresa obtenida exitosamente');

    } catch (error) {
        console.error('Error al obtener empresa:', error);
        return ResponseUtil.serverError(res, 'Error al obtener empresa', error);
    }
};

/**
 * Actualizar perfil de empresa
 */
const actualizarEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.notFound(res, 'Empresa no encontrada');
        }

        await empresa.update(req.body);

        return ResponseUtil.success(res, empresa, 'Empresa actualizada exitosamente');

    } catch (error) {
        console.error('Error al actualizar empresa:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener todas las empresas
 */
const obtenerEmpresas = async (req, res) => {
    try {
        const { page = 1, limit = 10, sector, pais } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (sector) where.sector = sector;
        if (pais) where.pais = pais;

        const { count, rows: empresas } = await Empresa.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: ['id', 'nombre_empresa', 'sector', 'descripcion', 'logo', 'ubicacion', 'tamaño'],
            order: [['nombre_empresa', 'ASC']]
        });

        return ResponseUtil.success(res, {
            empresas,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / parseInt(limit))
            }
        }, 'Empresas obtenidas exitosamente');

    } catch (error) {
        console.error('Error al obtener empresas:', error);
        return ResponseUtil.serverError(res, 'Error al obtener empresas', error);
    }
};

/**
 * Obtener mi empresa
 */
const miEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({
            where: { id_usuario: req.userId },
            include: [{
                model: Vacante,
                as: 'vacantes',
                attributes: ['id', 'titulo', 'estado', 'fecha_publicacion']
            }]
        });

        if (!empresa) {
            return ResponseUtil.notFound(res, 'No tienes una empresa asociada');
        }

        return ResponseUtil.success(res, empresa, 'Empresa obtenida exitosamente');

    } catch (error) {
        console.error('Error al obtener empresa:', error);
        return ResponseUtil.serverError(res, 'Error al obtener empresa', error);
    }
};

module.exports = {
    obtenerEmpresaPorId,
    actualizarEmpresa,
    obtenerEmpresas,
    miEmpresa
};
