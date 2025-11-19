const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const EvaluacionPeriodoPrueba = sequelize.define('EvaluacionPeriodoPrueba', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_contratacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Contrataciones',
            key: 'id'
        }
    },
    fecha_evaluacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    tipo_evaluacion: {
        type: DataTypes.ENUM('30_dias', '60_dias', '90_dias', 'final', 'extraordinaria'),
        allowNull: false
    },
    puntualidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        },
        comment: 'Escala 1-5'
    },
    cumplimiento_objetivos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    adaptacion_equipo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    habilidades_tecnicas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    actitud_compromiso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    promedio: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        comment: 'Promedio automático de las calificaciones'
    },
    comentarios_supervisor: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fortalezas: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    areas_mejora: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    recomendacion: {
        type: DataTypes.ENUM('aprobar', 'extender', 'no_renovar'),
        allowNull: false
    },
    evaluado_por: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'id'
        },
        comment: 'Usuario que realizó la evaluación'
    }
}, {
    tableName: 'Evaluaciones_Periodo_Prueba',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_contratacion'] },
        { fields: ['tipo_evaluacion'] },
        { fields: ['fecha_evaluacion'] }
    ],
    hooks: {
        beforeSave: (evaluacion) => {
            // Calcular promedio automáticamente
            const suma = evaluacion.puntualidad + 
                         evaluacion.cumplimiento_objetivos + 
                         evaluacion.adaptacion_equipo + 
                         evaluacion.habilidades_tecnicas + 
                         evaluacion.actitud_compromiso;
            evaluacion.promedio = (suma / 5).toFixed(2);
        }
    }
});

module.exports = EvaluacionPeriodoPrueba;
