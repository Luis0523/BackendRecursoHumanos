/**
 * Migración: Crear tablas de contrataciones, evaluaciones y planilla
 */
require('dotenv').config();
const sequelize = require('../db/db');

async function migrate() {
    try {
        console.log('🔧 Iniciando migración de contrataciones...');
        
        await sequelize.authenticate();
        console.log('✅ Conectado a la base de datos');
        
        // Crear tabla Contrataciones
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS Contrataciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_candidato INT NOT NULL,
                id_postulacion INT NULL,
                id_vacante INT NULL,
                id_empresa INT NOT NULL,
                fecha_contratacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                fecha_inicio_labores DATE NOT NULL,
                salario DECIMAL(10,2) NOT NULL,
                cargo VARCHAR(200) NOT NULL,
                departamento VARCHAR(100) NULL,
                tipo_contrato ENUM('temporal', 'indefinido', 'por_proyecto') DEFAULT 'indefinido',
                duracion_periodo_prueba_meses INT DEFAULT 3,
                fecha_fin_periodo_prueba DATE NULL,
                id_supervisor INT NULL,
                estado ENUM('periodo_prueba', 'planilla', 'finalizado', 'despedido') DEFAULT 'periodo_prueba',
                notas TEXT NULL,
                origen ENUM('postulacion', 'importacion', 'manual') DEFAULT 'postulacion',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_candidato) REFERENCES Candidatos(id),
                FOREIGN KEY (id_postulacion) REFERENCES Postulaciones(id),
                FOREIGN KEY (id_vacante) REFERENCES Vacantes(id),
                FOREIGN KEY (id_empresa) REFERENCES Empresas(id),
                FOREIGN KEY (id_supervisor) REFERENCES Usuarios(id),
                INDEX idx_candidato (id_candidato),
                INDEX idx_empresa (id_empresa),
                INDEX idx_estado (estado),
                INDEX idx_fecha_inicio (fecha_inicio_labores)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('✅ Tabla Contrataciones creada');

        // Crear tabla Evaluaciones_Periodo_Prueba
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS Evaluaciones_Periodo_Prueba (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_contratacion INT NOT NULL,
                fecha_evaluacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                tipo_evaluacion ENUM('30_dias', '60_dias', '90_dias', 'final', 'extraordinaria') NOT NULL,
                puntualidad INT NOT NULL CHECK (puntualidad BETWEEN 1 AND 5),
                cumplimiento_objetivos INT NOT NULL CHECK (cumplimiento_objetivos BETWEEN 1 AND 5),
                adaptacion_equipo INT NOT NULL CHECK (adaptacion_equipo BETWEEN 1 AND 5),
                habilidades_tecnicas INT NOT NULL CHECK (habilidades_tecnicas BETWEEN 1 AND 5),
                actitud_compromiso INT NOT NULL CHECK (actitud_compromiso BETWEEN 1 AND 5),
                promedio DECIMAL(3,2) NULL,
                comentarios_supervisor TEXT NULL,
                fortalezas TEXT NULL,
                areas_mejora TEXT NULL,
                recomendacion ENUM('aprobar', 'extender', 'no_renovar') NOT NULL,
                evaluado_por INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_contratacion) REFERENCES Contrataciones(id) ON DELETE CASCADE,
                FOREIGN KEY (evaluado_por) REFERENCES Usuarios(id),
                INDEX idx_contratacion (id_contratacion),
                INDEX idx_tipo (tipo_evaluacion),
                INDEX idx_fecha (fecha_evaluacion)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('✅ Tabla Evaluaciones_Periodo_Prueba creada');

        // Crear tabla Empleados_Planilla
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS Empleados_Planilla (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_contratacion INT NOT NULL UNIQUE,
                fecha_ingreso_planilla DATETIME DEFAULT CURRENT_TIMESTAMP,
                codigo_empleado VARCHAR(50) NULL UNIQUE,
                estado ENUM('activo', 'vacaciones', 'licencia', 'suspendido', 'inactivo') DEFAULT 'activo',
                fecha_baja DATE NULL,
                motivo_baja ENUM('renuncia', 'despido', 'fin_contrato', 'jubilacion', 'otro') NULL,
                observaciones_baja TEXT NULL,
                dias_vacaciones_anuales INT DEFAULT 15,
                dias_vacaciones_tomados INT DEFAULT 0,
                beneficios TEXT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (id_contratacion) REFERENCES Contrataciones(id) ON DELETE CASCADE,
                INDEX idx_contratacion (id_contratacion),
                INDEX idx_codigo (codigo_empleado),
                INDEX idx_estado (estado)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('✅ Tabla Empleados_Planilla creada');
        
        console.log('\n✅ Migración completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en migración:', error);
        process.exit(1);
    }
}

migrate();
