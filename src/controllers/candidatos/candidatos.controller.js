const { Candidato, Usuario, Postulacion } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const { Op } = require('sequelize');
const { uploadFile, generateUniqueFileName, deleteFile, extractFileNameFromUrl } = require('../../utils/firebase.util');

/**
 * Obtener perfil de candidato
 */
const obtenerCandidatoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const candidato = await Candidato.findByPk(id, {
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre', 'email', 'telefono', 'avatar']
            }]
        });

        if (!candidato) {
            return ResponseUtil.notFound(res, 'Candidato no encontrado');
        }

        return ResponseUtil.success(res, candidato, 'Candidato obtenido exitosamente');

    } catch (error) {
        console.error('Error al obtener candidato:', error);
        return ResponseUtil.serverError(res, 'Error al obtener candidato', error);
    }
};

/**
 * Actualizar perfil de candidato
 */
const actualizarCandidato = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });
        if (!candidato) {
            return ResponseUtil.notFound(res, 'Candidato no encontrado');
        }

        await candidato.update(req.body);

        return ResponseUtil.success(res, candidato, 'Candidato actualizado exitosamente');

    } catch (error) {
        console.error('Error al actualizar candidato:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener mi perfil de candidato
 */
const miPerfil = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({
            where: { id_usuario: req.userId },
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email', 'telefono', 'avatar']
                },
                {
                    model: Postulacion,
                    as: 'postulaciones',
                    attributes: ['id', 'estado', 'fecha_postulacion'],
                    limit: 5,
                    order: [['fecha_postulacion', 'DESC']]
                }
            ]
        });

        if (!candidato) {
            return ResponseUtil.notFound(res, 'No tienes un perfil de candidato');
        }

        return ResponseUtil.success(res, candidato, 'Perfil obtenido exitosamente');

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        return ResponseUtil.serverError(res, 'Error al obtener perfil', error);
    }
};

/**
 * Buscar candidatos (solo para empresas)
 */
const buscarCandidatos = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            titulo_profesional,
            años_experiencia_min,
            pais,
            ciudad
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (titulo_profesional) where.titulo_profesional = { [Op.like]: `%${titulo_profesional}%` };
        if (años_experiencia_min) where.años_experiencia = { [Op.gte]: parseInt(años_experiencia_min) };
        if (pais) where.pais = pais;
        if (ciudad) where.ciudad = ciudad;

        const { count, rows: candidatos } = await Candidato.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre', 'avatar']
            }],
            attributes: ['id', 'titulo_profesional', 'años_experiencia', 'ubicacion', 'cv_url']
        });

        return ResponseUtil.success(res, {
            candidatos,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / parseInt(limit))
            }
        }, 'Candidatos obtenidos exitosamente');

    } catch (error) {
        console.error('Error al buscar candidatos:', error);
        return ResponseUtil.serverError(res, 'Error al buscar candidatos', error);
    }
};

/**
 * Subir o actualizar CV del candidato
 * POST /api/candidatos/cv
 */
const subirCV = async (req, res) => {
    try {
        // Verificar que el usuario es un candidato
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });

        if (!candidato) {
            return ResponseUtil.notFound(res, 'No tienes un perfil de candidato');
        }

        // El archivo viene del middleware multer
        const file = req.file;

        if (!file) {
            return ResponseUtil.badRequest(res, 'No se proporcionó ningún archivo PDF');
        }

        // Si ya tenía un CV, eliminar el anterior
        if (candidato.cv_url) {
            try {
                const oldFileName = extractFileNameFromUrl(candidato.cv_url);
                await deleteFile(oldFileName);
                console.log('CV anterior eliminado:', oldFileName);
            } catch (deleteError) {
                console.error('Error al eliminar CV anterior:', deleteError);
                // No fallar si no se puede eliminar el anterior
            }
        }

        // Generar nombre único en carpeta 'cvs'
        const fileName = generateUniqueFileName(file.originalname, 'cvs');

        console.log('Subiendo CV:', fileName);

        // Subir a Firebase Storage
        const uploadResult = await uploadFile(
            file.buffer,
            fileName,
            file.mimetype
        );

        // Actualizar el campo cv_url en la base de datos
        candidato.cv_url = uploadResult.url;
        await candidato.save();

        console.log('CV subido exitosamente para candidato:', candidato.id);

        return ResponseUtil.success(res, {
            cv_url: uploadResult.url,
            fileName: uploadResult.fileName,
            size: uploadResult.size,
            originalName: file.originalname
        }, 'CV subido exitosamente');

    } catch (error) {
        console.error('Error al subir CV:', error);
        return ResponseUtil.serverError(res, 'Error al subir CV', error);
    }
};

/**
 * Eliminar CV del candidato
 * DELETE /api/candidatos/cv
 */
const eliminarCV = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ where: { id_usuario: req.userId } });

        if (!candidato) {
            return ResponseUtil.notFound(res, 'No tienes un perfil de candidato');
        }

        if (!candidato.cv_url) {
            return ResponseUtil.badRequest(res, 'No tienes un CV cargado');
        }

        // Extraer nombre del archivo de la URL
        const fileName = extractFileNameFromUrl(candidato.cv_url);

        // Eliminar de Firebase Storage
        await deleteFile(fileName);

        // Actualizar BD
        candidato.cv_url = null;
        await candidato.save();

        console.log('CV eliminado exitosamente para candidato:', candidato.id);

        return ResponseUtil.success(res, null, 'CV eliminado exitosamente');

    } catch (error) {
        console.error('Error al eliminar CV:', error);
        return ResponseUtil.serverError(res, 'Error al eliminar CV', error);
    }
};

module.exports = {
    obtenerCandidatoPorId,
    actualizarCandidato,
    miPerfil,
    buscarCandidatos,
    subirCV,
    eliminarCV
};
