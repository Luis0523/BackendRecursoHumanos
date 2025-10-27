const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const ResultadoPrueba = sequelize.define('ResultadoPrueba', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_asignacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        comment: 'Relación 1:1',
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
    id_prueba: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Pruebas',
            key: 'id'
        }
    },
    fecha_resultado: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    puntaje_total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    puntaje_maximo: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    porcentaje: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    aprobado: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    tiempo_total_segundos: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    respuestas_correctas: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    respuestas_incorrectas: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    preguntas_sin_responder: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    comentarios: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Comentarios del evaluador'
    },
    analisis_detallado: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Análisis por categorías en formato JSON'
    }
}, {
    tableName: 'Resultados_Prueba',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { fields: ['id_candidato'] },
        { fields: ['id_prueba'] },
        { fields: ['fecha_resultado'] },
        { fields: ['aprobado'] }
    ],
    comment: 'Resumen calculado del resultado de cada prueba completada'
});

module.exports = ResultadoPrueba;
