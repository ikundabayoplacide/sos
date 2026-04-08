import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./users.js";

class Appointment extends Model {}

Appointment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments',
    timestamps: true
});

Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Appointment.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
User.hasMany(Appointment, { as: 'patientAppointments', foreignKey: 'patientId' });
User.hasMany(Appointment, { as: 'doctorAppointments', foreignKey: 'doctorId' });

export default Appointment;
