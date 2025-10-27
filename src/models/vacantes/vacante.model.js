const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Vacante = sequelize.define('Vacante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_empresa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Empresas',
            key: 'id'
        }
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    requisitos: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    responsabilidades: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    beneficios: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    salario_minimo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    salario_maximo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    mostrar_salario: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tipo_contrato: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'indefinido, temporal, freelance, practicas'
    },
    jornada: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'tiempo_completo, medio_tiempo, por_proyecto'
    },
    modalidad: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'presencial, remoto, hibrido'
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
    años_experiencia_min: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nivel_educacion: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    vacantes_disponibles: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    fecha_publicacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_cierre: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activa',
        comment: 'activa, pausada, cerrada, cancelada'
    },
    vistas: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Contador de vistas'
    }
}, {
    tableName: 'Vacantes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_empresa'] },
        { fields: ['estado'] },
        { fields: ['fecha_publicacion'] },
        { fields: ['pais'] },
        { fields: ['modalidad'] }
    ],
    comment: 'Vacantes publicadas por las empresas'
});

module.exports = Vacante;
