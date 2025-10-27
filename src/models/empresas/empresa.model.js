const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Empresa = sequelize.define('Empresa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        comment: 'Relación 1:1 con Usuarios',
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    nombre_empresa: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    sector: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Tecnología, Finanzas, Salud, etc'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sitio_web: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ubicacion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    pais: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    direccion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL del logo de la empresa'
    },
    tamaño: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '1-10, 11-50, 51-200, 201-500, 500+'
    },
    rfc_nit: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Registro fiscal/tributario'
    }
}, {
    tableName: 'Empresas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_usuario'] },
        { fields: ['sector'] },
        { fields: ['pais'] }
    ],
    comment: 'Perfil de empresas que publican vacantes'
});

module.exports = Empresa;
