const mysql = require('mysql2/promise');
const fs = require('fs');

// Configuración de Railway MySQL
const RAILWAY_CONFIG = {
    host: 'ballast.proxy.rlwy.net',  // PROXY DOMAIN que mencionaste
    port: process.argv[2] || 3306,    // Puerto que te dará Railway
    user: process.argv[3] || 'root',  // Usuario de Railway
    password: process.argv[4],         // Password de Railway
    database: process.argv[5] || 'railway',  // Nombre de la base de datos en Railway
    multipleStatements: true
};

async function importDump() {
    try {
        console.log('🚀 Conectando a Railway MySQL...');
        console.log(`📍 Host: ${RAILWAY_CONFIG.host}:${RAILWAY_CONFIG.port}`);
        
        const connection = await mysql.createConnection(RAILWAY_CONFIG);
        console.log('✅ Conectado exitosamente a Railway');

        // Leer el archivo dump
        const dumpSQL = fs.readFileSync('gestion_talento_humano_dump.sql', 'utf8');
        console.log('📄 Archivo dump cargado');

        // Dividir en statements individuales
        const statements = dumpSQL
            .split(';\n')
            .filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));

        console.log(`📦 Ejecutando ${statements.length} statements SQL...`);

        let executed = 0;
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await connection.query(statement);
                    executed++;
                    if (executed % 50 === 0) {
                        console.log(`   ⏳ Procesados ${executed}/${statements.length} statements...`);
                    }
                } catch (err) {
                    console.error(`⚠️  Error en statement ${executed + 1}:`, err.message);
                    // Continuar con el siguiente statement
                }
            }
        }

        console.log('✅ Import completado exitosamente');
        console.log(`📊 Total statements ejecutados: ${executed}/${statements.length}`);

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al importar dump:', error.message);
        process.exit(1);
    }
}

// Validar argumentos
if (process.argv.length < 5) {
    console.log('❌ Uso: node import-to-railway.js <PORT> <USER> <PASSWORD> [DATABASE]');
    console.log('');
    console.log('Ejemplo:');
    console.log('  node import-to-railway.js 12345 root mi_password railway');
    console.log('');
    console.log('💡 Obtén estos datos de tu proyecto Railway en la sección de Variables');
    process.exit(1);
}

importDump();
