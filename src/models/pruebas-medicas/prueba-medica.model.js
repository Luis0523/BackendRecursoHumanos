const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const PruebaMedica = sequelize.define('PruebaMedica', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_candidato: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Candidatos',
            key: 'id'
        }
    },
    id_postulacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Postulación asociada',
        references: {
            model: 'Postulaciones',
            key: 'id'
        }
    },
    id_vacante: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Vacantes',
            key: 'id'
        }
    },
    tipo_prueba: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'examen_general, laboratorio, drogas, vista, auditivo, psicologico, rayos_x, otro'
    },
    nombre_prueba: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_solicitud: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_realizacion: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    fecha_resultado: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    resultado: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'apto, no_apto, apto_con_restricciones, pendiente'
    },
    porcentaje_aptitud: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Porcentaje de aptitud 0-100',
        validate: {
            min: 0,
            max: 100
        }
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    restricciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Si es apto con restricciones, detallar aquí'
    },
    medico_responsable: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    institucion_medica: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    documento_resultado_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'PDF del resultado médico'
    },
    estado: {
        type: DataTypes.STRING(50),
        defaultValue: 'pendiente',
        comment: 'pendiente, realizada, resultado_recibido'
    },
    valido_hasta: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Vigencia del examen médico'
    }
}, {
    tableName: 'Pruebas_Medicas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_candidato'] },
        { fields: ['id_postulacion'] },
        { fields: ['tipo_prueba'] },
        { fields: ['resultado'] },
        { fields: ['estado'] }
    ],
    comment: 'Resultados de exámenes médicos requeridos'
});

module.exports = PruebaMedica;
