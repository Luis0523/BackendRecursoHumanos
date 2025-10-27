const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const EvaluacionPostContratacion = sequelize.define('EvaluacionPostContratacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_candidato: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Candidato que fue contratado',
        references: {
            model: 'Candidatos',
            key: 'id'
        }
    },
    id_vacante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Vacante por la que fue contratado',
        references: {
            model: 'Vacantes',
            key: 'id'
        }
    },
    id_postulacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Postulaciones',
            key: 'id'
        }
    },
    fecha_inicio_laboral: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fecha_fin_periodo_prueba: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha estimada de fin del periodo de prueba'
    },
    puesto: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    departamento: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    salario_acordado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    numero_evaluacion: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'Primera evaluación, segunda, etc'
    },
    fecha_evaluacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    evaluador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Jefe directo o supervisor',
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    desempeño_general: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Calificación 1-10'
    },
    puntualidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '1-10'
    },
    calidad_trabajo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '1-10'
    },
    trabajo_equipo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '1-10'
    },
    adaptacion_cultura: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '1-10'
    },
    cumplimiento_objetivos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '1-10'
    },
    aspectos_positivos: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    areas_mejora: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logros_periodo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    objetivos_siguiente_periodo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    decision: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'continua, no_continua, extender_periodo_prueba, promover'
    },
    motivo_decision: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_decision: {
        type: DataTypes.DATE,
        allowNull: true
    },
    observaciones_generales: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    requiere_capacitacion: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    areas_capacitacion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    plan_mejora: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'Evaluacion_Post_Contratacion',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_candidato'] },
        { fields: ['id_vacante'] },
        { fields: ['fecha_evaluacion'] },
        { fields: ['decision'] },
        { fields: ['fecha_inicio_laboral'] }
    ],
    comment: 'Evaluación del candidato durante periodo de prueba'
});

module.exports = EvaluacionPostContratacion;
