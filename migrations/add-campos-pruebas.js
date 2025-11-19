/**
 * Migración: Agregar campos nuevos a pruebas médicas y técnicas
 */
require('dotenv').config();
const sequelize = require('../db/db');

async function migrate() {
    try {
        console.log('🔧 Iniciando migración...');
        
        await sequelize.authenticate();
        console.log('✅ Conectado a la base de datos');
        
        // Agregar campo porcentaje_aptitud a Pruebas_Medicas
        try {
            await sequelize.query(`
                ALTER TABLE Pruebas_Medicas 
                ADD COLUMN porcentaje_aptitud INT NULL 
                COMMENT 'Porcentaje de aptitud 0-100'
            `);
            console.log('✅ Campo porcentaje_aptitud agregado a Pruebas_Medicas');
        } catch (error) {
            if (error.message.includes('Duplicate column')) {
                console.log('⚠️  Campo porcentaje_aptitud ya existe en Pruebas_Medicas');
            } else {
                throw error;
            }
        }
        
        // Agregar campo archivo_evaluacion_url a Pruebas_Tecnicas
        try {
            await sequelize.query(`
                ALTER TABLE Pruebas_Tecnicas 
                ADD COLUMN archivo_evaluacion_url VARCHAR(500) NULL 
                COMMENT 'PDF con la evaluación y resultados'
            `);
            console.log('✅ Campo archivo_evaluacion_url agregado a Pruebas_Tecnicas');
        } catch (error) {
            if (error.message.includes('Duplicate column')) {
                console.log('⚠️  Campo archivo_evaluacion_url ya existe en Pruebas_Tecnicas');
            } else {
                throw error;
            }
        }
        
        console.log('\n✅ Migración completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en migración:', error);
        process.exit(1);
    }
}

migrate();
