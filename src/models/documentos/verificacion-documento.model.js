const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const VerificacionDocumento = sequelize.define('VerificacionDocumento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_candidato: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Candidatos',
            key: 'id'
        }
    },
    id_postulacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Postulación asociada',
        references: {
            model: 'Postulaciones',
            key: 'id'
        }
    },
    tipo_documento: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'titulo, certificado, antecedentes, carta_recomendacion, identificacion, comprobante_domicilio, otro'
    },
    nombre_documento: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    es_obligatorio: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    archivo_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL del documento subido'
    },
    fecha_subida: {
        type: DataTypes.DATE,
        allowNull: true
    },
    estado_verificacion: {
        type: DataTypes.STRING(50),
        defaultValue: 'pendiente',
        comment: 'pendiente, en_revision, verificado, rechazado, no_aplica'
    },
    fecha_verificacion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    verificado_por: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Usuario que verificó el documento',
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    motivo_rechazo: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Si fue rechazado, explicar por qué'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_emision: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Si el documento tiene vigencia'
    }
}, {
    tableName: 'Verificacion_Documentos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_candidato'] },
        { fields: ['id_postulacion'] },
        { fields: ['tipo_documento'] },
        { fields: ['estado_verificacion'] },
        { fields: ['es_obligatorio'] }
    ],
    comment: 'Checklist de documentos del candidato'
});

module.exports = VerificacionDocumento;
