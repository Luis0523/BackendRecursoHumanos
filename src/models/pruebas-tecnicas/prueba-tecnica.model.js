const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const PruebaTecnica = sequelize.define('PruebaTecnica', {
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
    id_vacante: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Vacante asociada',
        references: {
            model: 'Vacantes',
            key: 'id'
        }
    },
    id_postulacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Postulaciones',
            key: 'id'
        }
    },
    tipo_prueba: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'codigo, excel, idiomas, proyecto, caso_practico, otro'
    },
    nombre_prueba: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    instrucciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_asignacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_limite: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    fecha_entrega: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Cuando el candidato entregó'
    },
    fecha_evaluacion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(50),
        defaultValue: 'asignada',
        comment: 'asignada, en_progreso, entregada, evaluada, rechazada'
    },
    resultado: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'aprobado, reprobado, pendiente'
    },
    puntaje: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Calificación 0-100'
    },
    comentarios_evaluador: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    aspectos_positivos: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    aspectos_negativos: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    archivo_instrucciones_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'PDF con instrucciones detalladas'
    },
    archivo_respuesta_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Archivo que subió el candidato'
    },
    evaluador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Usuario que evaluó',
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    }
}, {
    tableName: 'Pruebas_Tecnicas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_candidato'] },
        { fields: ['id_vacante'] },
        { fields: ['tipo_prueba'] },
        { fields: ['estado'] },
        { fields: ['fecha_asignacion'] }
    ],
    comment: 'Pruebas técnicas para evaluar conocimientos específicos'
});

module.exports = PruebaTecnica;
