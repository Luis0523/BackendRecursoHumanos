const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function generateDump() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3307,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'luf2110',
            database: process.env.DB_NAME || 'gestion_talento_humano'
        });

        console.log('✅ Conectado a la base de datos');

        let dump = `-- MySQL dump for ${process.env.DB_NAME}\n`;
        dump += `-- Generated at ${new Date().toISOString()}\n\n`;
        dump += `SET NAMES utf8mb4;\n`;
        dump += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

        // Obtener todas las tablas
        const [tables] = await connection.query('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);

        console.log(`📋 Encontradas ${tableNames.length} tablas`);

        for (const tableName of tableNames) {
            console.log(`📦 Exportando tabla: ${tableName}`);

            // DROP TABLE
            dump += `-- Table: ${tableName}\n`;
            dump += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;

            // CREATE TABLE
            const [createTable] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
            dump += `${createTable[0]['Create Table']};\n\n`;

            // INSERT DATA
            const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
            
            if (rows.length > 0) {
                dump += `-- Data for ${tableName}\n`;
                dump += `LOCK TABLES \`${tableName}\` WRITE;\n`;
                
                for (const row of rows) {
                    const columns = Object.keys(row);
                    const values = columns.map(col => {
                        const val = row[col];
                        if (val === null) return 'NULL';
                        if (typeof val === 'number') return val;
                        if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
                        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "\\'")}'`;
                        return `'${String(val).replace(/'/g, "\\'")}'`;
                    });
                    
                    dump += `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES (${values.join(', ')});\n`;
                }
                
                dump += `UNLOCK TABLES;\n\n`;
            }
        }

        dump += `SET FOREIGN_KEY_CHECKS = 1;\n`;

        // Guardar archivo
        fs.writeFileSync('gestion_talento_humano_dump.sql', dump);
        console.log('✅ Dump generado exitosamente: gestion_talento_humano_dump.sql');

        // Mostrar tamaño del archivo
        const stats = fs.statSync('gestion_talento_humano_dump.sql');
        console.log(`📊 Tamaño del archivo: ${(stats.size / 1024).toFixed(2)} KB`);

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al generar dump:', error.message);
        process.exit(1);
    }
}

generateDump();
