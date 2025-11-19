const { Contratacion, Candidato, Usuario, Empresa, Postulacion, Vacante, EvaluacionPeriodoPrueba, EmpleadoPlanilla } = require('../../models');
const ResponseUtil = require('../../utils/response.util');
const { handleSequelizeError } = require('../../utils/errors.util');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');

/**
 * Contratar candidato desde postulación
 */
const contratarCandidato = async (req, res) => {
    try {
        const {
            id_candidato,
            id_postulacion,
            id_vacante,
            fecha_inicio_labores,
            salario,
            cargo,
            departamento,
            tipo_contrato,
            duracion_periodo_prueba_meses,
            id_supervisor,
            notas
        } = req.body;

        // Verificar que la empresa existe
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        // Calcular fecha fin de periodo de prueba
        const fechaInicio = new Date(fecha_inicio_labores);
        const fechaFin = new Date(fechaInicio);
        fechaFin.setMonth(fechaFin.getMonth() + (duracion_periodo_prueba_meses || 3));

        const contratacion = await Contratacion.create({
            id_candidato,
            id_postulacion,
            id_vacante,
            id_empresa: empresa.id,
            fecha_inicio_labores,
            salario,
            cargo,
            departamento,
            tipo_contrato,
            duracion_periodo_prueba_meses: duracion_periodo_prueba_meses || 3,
            fecha_fin_periodo_prueba: fechaFin,
            id_supervisor,
            estado: 'periodo_prueba',
            notas,
            origen: 'postulacion'
        });

        // Actualizar estado de postulación si existe
        if (id_postulacion) {
            await Postulacion.update(
                { estado: 'contratado' },
                { where: { id: id_postulacion } }
            );
        }

        return ResponseUtil.created(res, contratacion, 'Candidato contratado exitosamente');

    } catch (error) {
        console.error('Error al contratar candidato:', error);
        const appError = handleSequelizeError(error);
        return ResponseUtil.error(res, appError.message, appError.statusCode);
    }
};

/**
 * Obtener todas las contrataciones de la empresa
 */
const obtenerContrataciones = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const { estado } = req.query;
        const whereClause = { id_empresa: empresa.id };
        if (estado) whereClause.estado = estado;

        const contrataciones = await Contratacion.findAll({
            where: whereClause,
            include: [
                {
                    model: Candidato,
                    as: 'candidato',
                    include: [{
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['nombre', 'email', 'telefono']
                    }]
                },
                {
                    model: Usuario,
                    as: 'supervisor',
                    attributes: ['nombre', 'email']
                },
                {
                    model: Vacante,
                    as: 'vacante',
                    attributes: ['titulo']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return ResponseUtil.success(res, contrataciones);

    } catch (error) {
        console.error('Error al obtener contrataciones:', error);
        return ResponseUtil.serverError(res, 'Error al obtener contrataciones', error);
    }
};

/**
 * Importar empleados desde Excel
 */
const importarEmpleadosExcel = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa) {
            return ResponseUtil.error(res, 'No tienes una empresa asociada', 403);
        }

        const file = req.file;
        if (!file) {
            return ResponseUtil.error(res, 'No se proporcionó archivo', 400);
        }

        // Leer el archivo Excel
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return ResponseUtil.error(res, 'El archivo está vacío', 400);
        }

        const resultados = {
            exitosos: 0,
            fallidos: 0,
            errores: []
        };

        // Procesar cada fila
        for (const [index, row] of data.entries()) {
            try {
                // Validar campos requeridos
                if (!row.nombre || !row.email || !row.cargo || !row.salario || !row.fecha_inicio) {
                    resultados.fallidos++;
                    resultados.errores.push({
                        fila: index + 2,
                        error: 'Faltan campos requeridos (nombre, email, cargo, salario, fecha_inicio)'
                    });
                    continue;
                }

                // Crear o buscar usuario
                let usuario = await Usuario.findOne({ where: { email: row.email } });
                
                if (!usuario) {
                    // Obtener el rol de candidato
                    const { Rol } = require('../../models');
                    const rolCandidato = await Rol.findOne({ where: { nombre: 'candidato' } });
                    
                    if (!rolCandidato) {
                        throw new Error('No se encontró el rol de candidato');
                    }

                    // Crear nuevo usuario
                    const password = row.password || 'Temporal123!';
                    const hashedPassword = await bcrypt.hash(password, 10);
                    
                    usuario = await Usuario.create({
                        nombre: row.nombre,
                        email: row.email,
                        contraseña: hashedPassword,  // Usar 'contraseña' en vez de 'password'
                        telefono: row.telefono || null,
                        id_rol: rolCandidato.id,
                        verificado: true
                    });
                }

                // Crear o buscar candidato
                let candidato = await Candidato.findOne({ where: { id_usuario: usuario.id } });
                
                if (!candidato) {
                    candidato = await Candidato.create({
                        id_usuario: usuario.id,
                        fecha_nacimiento: row.fecha_nacimiento || null,
                        genero: row.genero || null,
                        direccion: row.direccion || null
                    });
                }

                // Calcular fecha fin periodo de prueba
                const fechaInicio = new Date(row.fecha_inicio);
                const mesesPrueba = row.meses_prueba || 3;
                const fechaFin = new Date(fechaInicio);
                fechaFin.setMonth(fechaFin.getMonth() + mesesPrueba);

                // Crear contratación
                const contratacion = await Contratacion.create({
                    id_candidato: candidato.id,
                    id_empresa: empresa.id,
                    fecha_inicio_labores: fechaInicio,
                    salario: parseFloat(row.salario),
                    cargo: row.cargo,
                    departamento: row.departamento || null,
                    tipo_contrato: row.tipo_contrato || 'indefinido',
                    duracion_periodo_prueba_meses: mesesPrueba,
                    fecha_fin_periodo_prueba: fechaFin,
                    estado: row.en_planilla === 'SI' || row.en_planilla === 'si' ? 'planilla' : 'periodo_prueba',
                    origen: 'importacion'
                });

                // Si ya está en planilla, crear registro
                if (contratacion.estado === 'planilla') {
                    await EmpleadoPlanilla.create({
                        id_contratacion: contratacion.id,
                        codigo_empleado: row.codigo_empleado || null,
                        fecha_ingreso_planilla: row.fecha_planilla || new Date()
                    });
                }

                resultados.exitosos++;

            } catch (error) {
                console.error(`Error en fila ${index + 2}:`, error);
                resultados.fallidos++;
                resultados.errores.push({
                    fila: index + 2,
                    error: error.message
                });
            }
        }

        return ResponseUtil.success(res, resultados, `Importación completada: ${resultados.exitosos} exitosos, ${resultados.fallidos} fallidos`);

    } catch (error) {
        console.error('Error al importar empleados:', error);
        return ResponseUtil.serverError(res, 'Error al importar empleados', error);
    }
};

/**
 * Actualizar estado de contratación
 */
const actualizarEstadoContratacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, motivo_baja, observaciones_baja } = req.body;

        const contratacion = await Contratacion.findByPk(id);
        if (!contratacion) {
            return ResponseUtil.notFound(res, 'Contratación no encontrada');
        }

        // Verificar permisos
        const empresa = await Empresa.findOne({ where: { id_usuario: req.userId } });
        if (!empresa || contratacion.id_empresa !== empresa.id) {
            return ResponseUtil.forbidden(res, 'No tienes permiso para modificar esta contratación');
        }

        await contratacion.update({ estado });

        // Si pasa a planilla, crear registro
        if (estado === 'planilla') {
            const existePlanilla = await EmpleadoPlanilla.findOne({
                where: { id_contratacion: id }
            });

            if (!existePlanilla) {
                await EmpleadoPlanilla.create({
                    id_contratacion: id,
                    fecha_ingreso_planilla: new Date()
                });
            }
        }

        // Si es finalizado o despedido, actualizar planilla
        if ((estado === 'finalizado' || estado === 'despedido')) {
            await EmpleadoPlanilla.update(
                {
                    estado: 'inactivo',
                    fecha_baja: new Date(),
                    motivo_baja: motivo_baja || 'otro',
                    observaciones_baja
                },
                { where: { id_contratacion: id } }
            );
        }

        return ResponseUtil.success(res, contratacion, 'Estado actualizado exitosamente');

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        return ResponseUtil.serverError(res, 'Error al actualizar estado', error);
    }
};

module.exports = {
    contratarCandidato,
    obtenerContrataciones,
    importarEmpleadosExcel,
    actualizarEstadoContratacion
};
