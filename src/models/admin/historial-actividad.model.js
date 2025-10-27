const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const HistorialActividad = sequelize.define('HistorialActividad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    tabla_afectada: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Nombre de la tabla que fue modificada'
    },
    registro_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID del registro afectado'
    },
    accion: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'crear, actualizar, eliminar, ver'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    datos_anteriores: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Estado anterior en JSON (para updates)'
    },
    datos_nuevos: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Estado nuevo en JSON'
    },
    ip: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Historial_Actividad',
    timestamps: false,
    indexes: [
        { fields: ['id_usuario'] },
        { fields: ['fecha'] },
        { fields: ['accion'] },
        { fields: ['tabla_afectada'] }
    ],
    comment: 'Auditoría de todas las acciones realizadas en el sistema'
});

module.exports = HistorialActividad;
