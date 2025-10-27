const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Reporte = sequelize.define('Reporte', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Usuario que generó el reporte',
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    tipo_reporte: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'vacantes, postulaciones, pruebas, candidatos, entrevistas, contrataciones'
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    parametros: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Filtros y parámetros usados para generar el reporte'
    },
    archivo_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL del archivo generado'
    },
    formato: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'pdf, excel, csv'
    },
    fecha_generacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'completado',
        comment: 'pendiente, procesando, completado, error'
    },
    tiempo_generacion_segundos: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'Reportes',
    timestamps: false,
    indexes: [
        { fields: ['id_usuario'] },
        { fields: ['tipo_reporte'] },
        { fields: ['fecha_generacion'] },
        { fields: ['estado'] }
    ],
    comment: 'Sistema de reportes y analytics del sistema'
});

module.exports = Reporte;
