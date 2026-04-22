import User from "./users.js";
import Appointment from "./appointments.js";
import DoctorAvailability from "./doctorAvailability.js";
import Notification from "./notifications.js";

// Appointments
Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Appointment.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
User.hasMany(Appointment, { as: 'patientAppointments', foreignKey: 'patientId' });
User.hasMany(Appointment, { as: 'doctorAppointments', foreignKey: 'doctorId' });

// Doctor Availability
DoctorAvailability.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
User.hasMany(DoctorAvailability, { as: 'availability', foreignKey: 'doctorId' });

// Notifications
Notification.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });
