import express from "express";
import {
    bookAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    getSingleAppointment,
    updateAppointment,
    cancelAppointment,
    getAllAppointments
} from "../controller/appointments.js";
import protect from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const AppointmentRoutes = express.Router();

AppointmentRoutes.post("/api/appointments", protect, authorize('patient'), bookAppointment);
AppointmentRoutes.get("/api/appointments/patient", protect, authorize('patient'), getPatientAppointments);
AppointmentRoutes.get("/api/appointments/doctor", protect, authorize('doctor'), getDoctorAppointments);
AppointmentRoutes.get("/api/appointments/all", protect, authorize('admin'), getAllAppointments);
AppointmentRoutes.get("/api/appointments/:id", protect, getSingleAppointment);
AppointmentRoutes.put("/api/appointments/:id", protect, authorize('doctor'), updateAppointment);
AppointmentRoutes.patch("/api/appointments/:id/cancel", protect, authorize('patient'), cancelAppointment);

export default AppointmentRoutes;
