require('dotenv').config();
const { Empresa, Usuario, Vacante, Postulacion } = require('./src/models');

async function consultarEmpresa() {
    try {
        // Buscar empresa con id 8
        const empresa = await Empresa.findOne({
            where: { id: 8 },
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['id', 'email', 'id_rol']
            }]
        });

        if (empresa) {
            console.log('\n=== EMPRESA ENCONTRADA ===');
            console.log('ID Empresa:', empresa.id);
            console.log('Nombre:', empresa.nombre_empresa);
            console.log('ID Usuario:', empresa.id_usuario);
            console.log('Email:', empresa.usuario?.email);
            console.log('ID Rol:', empresa.usuario?.id_rol);
        } else {
            console.log('\n❌ No se encontró empresa con id 8');

            // Buscar cualquier empresa que exista
            const primeraEmpresa = await Empresa.findOne({
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'email', 'id_rol']
                }]
            });

            if (primeraEmpresa) {
                console.log('\n=== PRIMERA EMPRESA DISPONIBLE ===');
                console.log('ID Empresa:', primeraEmpresa.id);
                console.log('Nombre:', primeraEmpresa.nombre_empresa);
                console.log('ID Usuario:', primeraEmpresa.id_usuario);
                console.log('Email:', primeraEmpresa.usuario?.email);
            }
        }

        // Consultar vacantes y postulaciones
        const vacantes = await Vacante.findAll({
            where: { id_empresa: empresa ? empresa.id : 1 },
            include: [{
                model: Postulacion,
                as: 'postulaciones',
                attributes: ['id', 'estado', 'fecha_postulacion', 'id_candidato']
            }]
        });

        console.log('\n=== VACANTES Y POSTULACIONES ===');
        console.log('Total de vacantes:', vacantes.length);

        vacantes.forEach(v => {
            console.log(`\n- Vacante ID ${v.id}: ${v.titulo}`);
            console.log(`  Postulaciones: ${v.postulaciones.length}`);
            v.postulaciones.forEach(p => {
                console.log(`    • ID: ${p.id}, Estado: ${p.estado}, Fecha: ${p.fecha_postulacion}`);
            });
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

consultarEmpresa();
