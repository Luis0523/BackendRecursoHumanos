const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const Contratacion = sequelize.define('Contratacion', {
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
        references: {
            model: 'Postulaciones',
            key: 'id'
        },
        comment: 'Si fue contratado desde una postulación'
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
        allowNull: false,
        references: {
            model: 'Empresas',
            key: 'id'
        }
    },
    fecha_contratacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_inicio_labores: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    salario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    cargo: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    departamento: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    tipo_contrato: {
        type: DataTypes.ENUM('temporal', 'indefinido', 'por_proyecto'),
        defaultValue: 'indefinido'
    },
    duracion_periodo_prueba_meses: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        comment: 'Duración en meses del periodo de prueba'
    },
    fecha_fin_periodo_prueba: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Calculada automáticamente'
    },
    id_supervisor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Usuarios',
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.ENUM('periodo_prueba', 'planilla', 'finalizado', 'despedido'),
        defaultValue: 'periodo_prueba'
    },
    notas: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    origen: {
        type: DataTypes.ENUM('postulacion', 'importacion', 'manual'),
        defaultValue: 'postulacion',
        comment: 'Indica cómo ingresó al sistema'
    }
}, {
    tableName: 'Contrataciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_candidato'] },
        { fields: ['id_empresa'] },
        { fields: ['estado'] },
        { fields: ['fecha_inicio_labores'] }
    ]
});

module.exports = Contratacion;
