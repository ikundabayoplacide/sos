import sequelize from "../../config/db.js";
import User from "./users.js";
import Appointment from "./appointments.js";
import DoctorAvailability from "./doctorAvailability.js";
import Notification from "./notifications.js";
import "./association.js";

const db = {
    sequelize,
    User,
    Appointment,
    DoctorAvailability,
    Notification
};

export default db;
