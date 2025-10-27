const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Evento = sequelize.define('Evento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_postulacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Postulación asociada si aplica',
        references: {
            model: 'Postulaciones',
            key: 'id'
        }
    },
    id_candidato: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Candidatos',
            key: 'id'
        }
    },
    id_vacante: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Vacantes',
            key: 'id'
        }
    },
    id_empresa: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Empresas',
            key: 'id'
        }
    },
    tipo_evento: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'entrevista, prueba_tecnica, prueba_medica, reunion, firma_contrato, induccion, otro'
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_hora_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_hora_fin: {
        type: DataTypes.DATE,
        allowNull: true
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
    modalidad: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'presencial, virtual, hibrido'
    },
    organizador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Usuario que creó el evento',
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    participantes: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array de IDs de usuarios participantes'
    },
    estado: {
        type: DataTypes.STRING(50),
        defaultValue: 'programado',
        comment: 'programado, confirmado, completado, cancelado, reprogramado'
    },
    recordatorios_enviados: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    notas: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'Eventos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_postulacion'] },
        { fields: ['id_candidato'] },
        { fields: ['id_vacante'] },
        { fields: ['tipo_evento'] },
        { fields: ['estado'] },
        { fields: ['fecha_hora_inicio'] },
        { fields: ['organizador_id'] }
    ],
    comment: 'Agenda de eventos y citas'
});

module.exports = Evento;
