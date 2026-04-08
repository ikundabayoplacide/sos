import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./users.js";

class DoctorAvailability extends Model {}

DoctorAvailability.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    dayOfWeek: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'DoctorAvailability',
    tableName: 'doctor_availability',
    timestamps: true
});

DoctorAvailability.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
User.hasMany(DoctorAvailability, { as: 'availability', foreignKey: 'doctorId' });

export default DoctorAvailability;
