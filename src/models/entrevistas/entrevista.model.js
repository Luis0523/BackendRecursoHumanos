const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Entrevista = sequelize.define('Entrevista', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_postulacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Postulaciones',
            key: 'id'
        }
    },
    id_candidato: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Candidatos',
            key: 'id'
        }
    },
    id_vacante: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Vacantes',
            key: 'id'
        }
    },
    tipo_entrevista: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'telefonica, presencial, videollamada, tecnica, grupal'
    },
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duracion_minutos: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ubicacion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Dirección física o link de videollamada'
    },
    entrevistador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Usuario de la empresa que entrevistó',
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Calificación 1-10'
    },
    aspectos_positivos: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    aspectos_negativos: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    habilidades_tecnicas_evaluacion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    habilidades_blandas_evaluacion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    recomendacion: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'contratar, segunda_entrevista, rechazar, en_evaluacion'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    siguiente_paso: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Qué sigue después de esta entrevista'
    },
    grabacion_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL de grabación si aplica'
    },
    notas_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Documento con notas detalladas'
    },
    estado: {
        type: DataTypes.STRING(50),
        defaultValue: 'programada',
        comment: 'programada, completada, cancelada, reprogramada'
    },
    realizada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fecha_evaluacion: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Cuando se completó la evaluación'
    }
}, {
    tableName: 'Entrevistas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_postulacion'] },
        { fields: ['id_candidato'] },
        { fields: ['id_vacante'] },
        { fields: ['entrevistador_id'] },
        { fields: ['estado'] },
        { fields: ['fecha_hora'] }
    ],
    comment: 'Registro y evaluación de entrevistas'
});

module.exports = Entrevista;
