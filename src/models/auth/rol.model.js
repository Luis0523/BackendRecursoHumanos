const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Rol = sequelize.define('Rol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'administrador, empresa, candidato'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    permisos: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Permisos específicos en formato JSON'
    }
}, {
    tableName: 'Roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['nombre'] }
    ],
    comment: 'Define los roles del sistema: Admin, Empresa, Candidato'
});

module.exports = Rol;
