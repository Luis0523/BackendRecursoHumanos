const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const AsignacionPrueba = sequelize.define('AsignacionPrueba', {
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
    id_prueba: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Pruebas',
            key: 'id'
        }
    },
    id_vacante: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Vacante asociada (opcional)',
        references: {
            model: 'Vacantes',
            key: 'id'
        }
    },
    id_empresa: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Empresa que asignó la prueba',
        references: {
            model: 'Empresas',
            key: 'id'
        }
    },
    fecha_asignacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_limite: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha límite para completar'
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Cuando el candidato inició la prueba'
    },
    fecha_completado: {
        type: DataTypes.DATE,
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(50),
        defaultValue: 'pendiente',
        comment: 'pendiente, en_progreso, completada, vencida, cancelada'
    },
    intentos_permitidos: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    intentos_realizados: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tiempo_total_segundos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Tiempo total que tomó completarla'
    },
    ip_inicio: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    ip_fin: {
        type: DataTypes.STRING(45),
        allowNull: true
    }
}, {
    tableName: 'Asignaciones_Prueba',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_candidato'] },
        { fields: ['id_prueba'] },
        { fields: ['id_vacante'] },
        { fields: ['estado'] },
        { fields: ['fecha_asignacion'] }
    ],
    comment: 'CRÍTICA: Controla qué pruebas se asignan a qué candidatos'
});

module.exports = AsignacionPrueba;
