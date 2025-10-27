const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Pregunta = sequelize.define('Pregunta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_prueba: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Pruebas',
            key: 'id'
        }
    },
    texto_pregunta: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipo_pregunta: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'multiple, verdadero_falso, abierta, escala'
    },
    puntaje_maximo: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    tiempo_limite_segundos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Tiempo límite para responder esta pregunta'
    },
    orden: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Orden de aparición en la prueba'
    },
    es_obligatoria: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    imagen_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Imagen asociada a la pregunta'
    }
}, {
    tableName: 'Preguntas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { fields: ['id_prueba'] },
        { fields: ['orden'] }
    ],
    comment: 'Preguntas que conforman cada prueba psicométrica'
});

module.exports = Pregunta;
