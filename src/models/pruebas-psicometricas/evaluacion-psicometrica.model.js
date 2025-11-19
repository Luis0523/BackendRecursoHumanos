const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const EvaluacionPsicometrica = sequelize.define('EvaluacionPsicometrica', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_asignacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Asignaciones_Prueba',
            key: 'id'
        }
    },
    id_candidato: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Candidatos',
            key: 'id'
        }
    },
    id_evaluador: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    resultado: {
        type: DataTypes.ENUM('aprobado', 'no_aprobado', 'pendiente_revision'),
        allowNull: false,
        defaultValue: 'pendiente_revision'
    },
    porcentaje_aptitud: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_evaluacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Evaluaciones_Psicometricas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = EvaluacionPsicometrica;
