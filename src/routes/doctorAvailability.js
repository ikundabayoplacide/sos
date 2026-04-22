import express from "express";
import {
    setAvailability,
    updateAvailability,
    deleteAvailability,
    getDoctorAvailability,
    getAllDoctorsAvailability,
    updateDoctorAvailability
} from "../controller/doctorAvailability.js";
import protect from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const AvailabilityRoutes = express.Router();

// Doctor manages their own availability
AvailabilityRoutes.post("/api/availability", protect, authorize('doctor'), setAvailability);
AvailabilityRoutes.put("/api/availability/:id", protect, authorize('doctor'), updateAvailability);
AvailabilityRoutes.patch("/api/availability/:dayOfWeek/toggle", protect, authorize('doctor'), updateDoctorAvailability);
AvailabilityRoutes.delete("/api/availability/:id", protect, authorize('doctor'), deleteAvailability);

// Patient views availability
AvailabilityRoutes.get("/api/availability/doctors", protect, getAllDoctorsAvailability);
AvailabilityRoutes.get("/api/availability/:doctorId", protect, getDoctorAvailability);

export default AvailabilityRoutes;
