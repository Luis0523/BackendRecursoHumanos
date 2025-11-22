const mysql = require('mysql2/promise');

const railwayConfig = {
  host: 'ballast.proxy.rlwy.net',
  user: 'root',
  password: 'GGJbIcKcuZyBTSESjnAMDDzgZyUqOGlG',
  port: 50517,
  database: 'railway',
  multipleStatements: true
};

const localConfig = {
  host: 'localhost',
  user: 'root',
  password: 'luf2110',
  database: 'gestion_talento_humano',
  multipleStatements: true
};

async function fixCollationTables() {
  let localConn, railwayConn;
  
  try {
    console.log('🔌 Conectando...');
    localConn = await mysql.createConnection(localConfig);
    railwayConn = await mysql.createConnection(railwayConfig);
    
    await railwayConn.query('SET FOREIGN_KEY_CHECKS = 0');
    
    const problematicTables = [
      'Contrataciones',
      'Empleados_Planilla',
      'Evaluaciones_Periodo_Prueba'
    ];
    
    for (const tableName of problematicTables) {
      console.log(`\n📦 Procesando ${tableName}...`);
      
      try {
        // Obtener estructura
        const [createTable] = await localConn.query(`SHOW CREATE TABLE \`${tableName}\``);
        let createStatement = createTable[0]['Create Table'];
        
        // Reemplazar el collation problemático
        createStatement = createStatement.replace(/utf8mb4_uca1400_ai_ci/g, 'utf8mb4_unicode_ci');
        createStatement = createStatement.replace(/utf8mb4_0900_ai_ci/g, 'utf8mb4_unicode_ci');
        
        // Eliminar y recrear
        await railwayConn.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        console.log(`   ✏️  Creando estructura corregida...`);
        await railwayConn.query(createStatement);
        
        // Obtener datos
        const [rows] = await localConn.query(`SELECT * FROM \`${tableName}\``);
        
        if (rows.length > 0) {
          console.log(`   📥 Insertando ${rows.length} registros...`);
          
          const columns = Object.keys(rows[0]);
          const values = rows.map(row => {
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
          console.log(`   ✅ Registros insertados`);
        } else {
          console.log(`   ℹ️  Tabla vacía`);
        }
      } catch (error) {
        console.error(`   ❌ Error:`, error.message);
      }
    }
    
    await railwayConn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('\n✅ Corrección completada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (localConn) await localConn.end();
    if (railwayConn) await railwayConn.end();
  }
}

fixCollationTables()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });
