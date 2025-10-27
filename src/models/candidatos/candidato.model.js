const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Candidato = sequelize.define('Candidato', {
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
    cv_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Ruta al archivo PDF del CV'
    },
    perfil: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción profesional del candidato'
    },
    titulo_profesional: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    años_experiencia: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    salario_esperado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    disponibilidad: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'inmediata, 2_semanas, 1_mes, otro'
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
    linkedin: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    portfolio: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    github: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    genero: {
        type: DataTypes.STRING(20),
        allowNull: true
    }
}, {
    tableName: 'Candidatos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_usuario'] },
        { fields: ['pais'] },
        { fields: ['ciudad'] },
        { fields: ['años_experiencia'] }
    ],
    comment: 'Perfil de candidatos'
});

module.exports = Candidato;
