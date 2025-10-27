const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    contraseña: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Hash bcrypt'
    },
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Roles',
            key: 'id'
        }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL de imagen de perfil'
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    ultimo_acceso: {
        type: DataTypes.DATE,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activo',
        comment: 'activo, suspendido, inactivo'
    },
    token_recuperacion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Token para recuperar contraseña'
    },
    token_expiracion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    email_verificado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['email'] },
        { fields: ['id_rol'] },
        { fields: ['estado'] }
    ],
    comment: 'Tabla central de usuarios - Todos deben tener un rol'
});

module.exports = Usuario;
