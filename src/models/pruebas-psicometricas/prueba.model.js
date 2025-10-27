const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Prueba = sequelize.define('Prueba', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'cognitiva, personalidad, habilidades, conocimiento'
    },
    categoria: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    duracion_minutos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duración estimada'
    },
    instrucciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    puntaje_minimo_aprobacion: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activa',
        comment: 'activa, inactiva, borrador'
    },
    creador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Usuario que creó la prueba',
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    es_publica: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Si otras empresas pueden usarla'
    }
}, {
    tableName: 'Pruebas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['tipo'] },
        { fields: ['estado'] },
        { fields: ['creador_id'] }
    ],
    comment: 'Catálogo de pruebas psicométricas disponibles'
});

module.exports = Prueba;
