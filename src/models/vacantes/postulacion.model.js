const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Postulacion = sequelize.define('Postulacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_candidato: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'NULL si es postulación semi-anónima',
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
    // Campos para postulantes semi-anónimos
    nombre_postulante: {
        type: DataTypes.STRING(150),
        allowNull: true,
        comment: 'Solo para semi-anónimos'
    },
    email_postulante: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Solo para semi-anónimos'
    },
    telefono_postulante: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Solo para semi-anónimos'
    },
    cv_postulante: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'CV subido por semi-anónimo'
    },
    carta_presentacion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_postulacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.STRING(50),
        defaultValue: 'pendiente',
        comment: 'pendiente, en_revision, preseleccionado, entrevista, rechazado, aceptado, contratado'
    },
    puntuacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Puntuación 1-100 asignada por la empresa'
    },
    notas_empresa: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notas internas de la empresa sobre el candidato'
    },
    fecha_cambio_estado: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'Postulaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_candidato'] },
        { fields: ['id_vacante'] },
        { fields: ['estado'] },
        { fields: ['fecha_postulacion'] },
        { fields: ['email_postulante'] }
    ],
    comment: 'Soporta postulaciones de candidatos registrados y semi-anónimos'
});

module.exports = Postulacion;
