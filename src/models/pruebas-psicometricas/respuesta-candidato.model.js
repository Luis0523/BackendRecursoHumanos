const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const RespuestaCandidato = sequelize.define('RespuestaCandidato', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_asignacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Asignaciones_Prueba',
            key: 'id'
        }
    },
    id_pregunta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Preguntas',
            key: 'id'
        }
    },
    id_opcion_seleccionada: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'NULL si es pregunta abierta',
        references: {
            model: 'Opciones_Respuesta',
            key: 'id'
        }
    },
    respuesta_texto: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Para preguntas abiertas'
    },
    tiempo_respuesta_segundos: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fecha_respuesta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    puntaje_obtenido: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'Respuestas_Candidato',
    timestamps: false,
    indexes: [
        { fields: ['id_asignacion'] },
        { fields: ['id_pregunta'] }
    ],
    comment: 'Almacena cada respuesta individual del candidato'
});

module.exports = RespuestaCandidato;
