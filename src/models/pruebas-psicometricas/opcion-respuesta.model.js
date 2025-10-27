const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const OpcionRespuesta = sequelize.define('OpcionRespuesta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_pregunta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Preguntas',
            key: 'id'
        }
    },
    texto_opcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    es_correcta: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    puntaje: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Puntos si se selecciona esta opción'
    },
    orden: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    retroalimentacion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Feedback mostrado si se selecciona'
    }
}, {
    tableName: 'Opciones_Respuesta',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { fields: ['id_pregunta'] }
    ],
    comment: 'Opciones de respuesta para preguntas de opción múltiple'
});

module.exports = OpcionRespuesta;
