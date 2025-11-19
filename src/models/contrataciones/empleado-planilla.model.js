const { DataTypes } = require('sequelize');
const sequelize = require('../../../db/db');

const EmpleadoPlanilla = sequelize.define('EmpleadoPlanilla', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_contratacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Contrataciones',
            key: 'id'
        }
    },
    fecha_ingreso_planilla: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Cuando aprobó el periodo de prueba'
    },
    codigo_empleado: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
        comment: 'Código único del empleado en la empresa'
    },
    estado: {
        type: DataTypes.ENUM('activo', 'vacaciones', 'licencia', 'suspendido', 'inactivo'),
        defaultValue: 'activo'
    },
    fecha_baja: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    motivo_baja: {
        type: DataTypes.ENUM('renuncia', 'despido', 'fin_contrato', 'jubilacion', 'otro'),
        allowNull: true
    },
    observaciones_baja: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dias_vacaciones_anuales: {
        type: DataTypes.INTEGER,
        defaultValue: 15
    },
    dias_vacaciones_tomados: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    beneficios: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'JSON con beneficios del empleado'
    }
}, {
    tableName: 'Empleados_Planilla',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['id_contratacion'] },
        { fields: ['codigo_empleado'] },
        { fields: ['estado'] }
    ]
});

module.exports = EmpleadoPlanilla;
