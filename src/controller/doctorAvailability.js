import DoctorAvailability from "../database/models/doctorAvailability.js";
import User from "../database/models/users.js";

// Doctor sets their availability
export const setAvailability = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const { dayOfWeek } = req.body;

        const existing = await DoctorAvailability.findOne({ where: { doctorId, dayOfWeek } });
        if (existing)
            return res.status(400).json({ message: "Availability for this day already exists. Update it instead." });

        const slot = await DoctorAvailability.create({ doctorId, dayOfWeek });
        res.status(201).json({ message: "Availability set successfully", slot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Doctor updates their availability
export const updateAvailability = async (req, res) => {
    try {
        const slot = await DoctorAvailability.findOne({
            where: { id: req.params.id, doctorId: req.user.id }
        });
        if (!slot)
            return res.status(404).json({ message: "Availability slot not found" });

        await slot.update(req.body);
        res.status(200).json({ message: "Availability updated", slot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Doctor deletes an availability slot
export const deleteAvailability = async (req, res) => {
    try {
        const slot = await DoctorAvailability.findOne({
            where: { id: req.params.id, doctorId: req.user.id }
        });
        if (!slot)
            return res.status(404).json({ message: "Availability slot not found" });

        await slot.destroy();
        res.status(200).json({ message: "Availability slot deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Patient views available slots for a specific doctor
export const getDoctorAvailability = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await User.findOne({ where: { id: doctorId, role: 'doctor' } });
        if (!doctor)
            return res.status(404).json({ message: "Doctor not found" });

        const slots = await DoctorAvailability.findAll({
            where: { doctorId, isAvailable: true },
            attributes: ['id', 'dayOfWeek']
        });

        res.status(200).json({ doctor: doctor.fullName, availableSlots: slots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Patient views all doctors with their availability
export const getAllDoctorsAvailability = async (req, res) => {
    try {
        const doctors = await User.findAll({
            where: { role: 'doctor' },
            attributes: ['id', 'fullName', 'email'],
            include: [{
                model: DoctorAvailability,
                as: 'availability',
                where: { isAvailable: true },
                attributes: ['id', 'dayOfWeek'],
                required: false
            }]
        });
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//doctor update if he is available
export const updateDoctorAvailability = async (req, res) => {
    try {
        const doctorId = req.user.id;
        // Find the doctor's availability slot
        const slot = await DoctorAvailability.findOne({
            where: { doctorId, dayOfWeek: req.params.dayOfWeek }
        });
        if (!slot) {
            return res.status(404).json({ message: "Availability slot not found" });
        }
        // Toggle the availability status
        await slot.update({ isAvailable: !slot.isAvailable });

        res.status(200).json({ message: "Doctor availability updated successfully", slot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};