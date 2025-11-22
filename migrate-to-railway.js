const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración local
const localConfig = {
  host: 'localhost',
  user: 'root',
  password: 'luf2110',
  database: 'gestion_talento_humano',
  multipleStatements: true
};

// Configuración Railway
const railwayConfig = {
  host: 'ballast.proxy.rlwy.net',
  user: 'root',
  password: 'GGJbIcKcuZyBTSESjnAMDDzgZyUqOGlG',
  port: 50517,
  database: 'railway',
  multipleStatements: true
};

async function exportAndImport() {
  let localConn, railwayConn;
  
  try {
    console.log('🔌 Conectando a base de datos local...');
    localConn = await mysql.createConnection(localConfig);
    
    console.log('🔌 Conectando a Railway...');
    railwayConn = await mysql.createConnection(railwayConfig);
    
    // Obtener estructura de tablas
    console.log('📋 Obteniendo estructura de tablas...');
    const [tables] = await localConn.query('SHOW TABLES');
    
    // Desactivar verificaciones de claves foráneas
    await railwayConn.query('SET FOREIGN_KEY_CHECKS = 0');
    
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      console.log(`\n📦 Procesando tabla: ${tableName}`);
      
      try {
        // Eliminar tabla si existe
        await railwayConn.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        
        // Obtener estructura de la tabla
        const [createTable] = await localConn.query(`SHOW CREATE TABLE \`${tableName}\``);
        const createStatement = createTable[0]['Create Table'];
        
        // Crear tabla en Railway
        console.log(`   ✏️  Creando estructura...`);
        await railwayConn.query(createStatement);
        
        // Obtener datos
        const [rows] = await localConn.query(`SELECT * FROM \`${tableName}\``);
        
        if (rows.length > 0) {
          console.log(`   📥 Copiando ${rows.length} registros...`);
          
          // Insertar en lotes de 100
          const batchSize = 100;
          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            
            // Construir INSERT
            const columns = Object.keys(batch[0]);
            const values = batch.map(row => {
              const vals = columns.map(col => {
                const val = row[col];
                if (val === null) return 'NULL';
                if (typeof val === 'string') return mysql.escape(val);
                if (val instanceof Date) return mysql.escape(val);
                if (typeof val === 'boolean') return val ? 1 : 0;
                if (Buffer.isBuffer(val)) return mysql.escape(val);
                return mysql.escape(String(val));
              });
              return `(${vals.join(',')})`;
            });
            
            const insertSQL = `INSERT INTO \`${tableName}\` (\`${columns.join('`,`')}\`) VALUES ${values.join(',')}`;
            await railwayConn.query(insertSQL);
            
            console.log(`   ✅ Lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(rows.length/batchSize)} insertado`);
          }
        } else {
          console.log(`   ℹ️  Tabla vacía`);
        }
      } catch (error) {
        console.error(`   ❌ Error en tabla ${tableName}:`, error.message);
      }
    }
    
    // Reactivar verificaciones de claves foráneas
    await railwayConn.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('\n✅ ¡Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    if (localConn) await localConn.end();
    if (railwayConn) await railwayConn.end();
  }
}

// Ejecutar
exportAndImport()
  .then(() => {
    console.log('\n🎉 Proceso finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
