require('dotenv').config();
const sequelize = require('./db/db');
const { Usuario, Candidato, Rol, AsignacionPrueba, Prueba } = require('./src/models');

(async () => {
    try {
        const usuario = await Usuario.findOne({
            where: { email: 'maria.garcia@email.com' },
            include: [
                { model: Rol, as: 'rol' },
                { model: Candidato, as: 'candidato' }
            ]
        });
        
        if (!usuario) {
            console.log('❌ Usuario NO encontrado');
            process.exit(0);
        }
        
        console.log('✅ Usuario encontrado:');
        console.log('  ID:', usuario.id);
        console.log('  Nombre:', usuario.nombre);
        console.log('  Email:', usuario.email);
        console.log('  Rol:', usuario.rol?.nombre);
        console.log('  Candidato ID:', usuario.candidato?.id || 'NO TIENE');
        
        if (usuario.candidato) {
            const asignaciones = await AsignacionPrueba.findAll({
                where: { id_candidato: usuario.candidato.id },
                include: [{ model: Prueba, as: 'prueba' }]
            });
            
            console.log('\n📋 Asignaciones de pruebas:', asignaciones.length);
            asignaciones.forEach(a => {
                console.log('  - ID:', a.id, '| Prueba:', a.prueba?.nombre, '| Estado:', a.estado);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
})();
