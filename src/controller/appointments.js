import Appointment from "../database/models/appointments.js";
import DoctorAvailability from "../database/models/doctorAvailability.js";
import Notification from "../database/models/notifications.js";
import User from "../database/models/users.js";

// Patient books an appointment by selecting a doctor's availability slot
export const bookAppointment = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { availabilitySlotId, appointmentDate, reason } = req.body;

        // Fetch the slot
        const slot = await DoctorAvailability.findOne({
            where: { id: availabilitySlotId, isAvailable: true }
        });
        if (!slot)
            return res.status(400).json({ message: "Selected slot is not available" });

        const { doctorId, dayOfWeek } = slot;

        // Validate that the chosen date matches the slot's day of week
        const chosenDay = new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long' });
        if (chosenDay !== dayOfWeek)
            return res.status(400).json({ message: `This slot is only available on ${dayOfWeek}. You selected a ${chosenDay}` });

        // Only block if same patient already booked this slot on the same date
        const conflict = await Appointment.findOne({
            where: { patientId, doctorId, appointmentDate, status: 'pending' }
        });
        if (conflict)
            return res.status(400).json({ message: "You already have a booking with this doctor on this date" });

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            appointmentDate,
            reason,
            status: 'pending'
        });

        // Notify the doctor
        await Notification.create({
            userId: doctorId,
            title: 'New Appointment Request',
            message: `You have a new appointment request on ${appointmentDate} (${dayOfWeek})`,
            type: 'appointment'
        });

        res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Patient gets their own appointments
export const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { patientId: req.user.id },
            include: [
                { model: User, as: 'doctor', attributes: ['id', 'fullName', 'email'] }
            ],
            order: [['appointmentDate', 'ASC']]
        });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Doctor gets their own appointments
export const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { doctorId: req.user.id },
            include: [
                { model: User, as: 'patient', attributes: ['id', 'fullName', 'email', 'phoneNUmber'] }
            ],
            order: [['appointmentDate', 'ASC']]
        });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single appointment
export const getSingleAppointment = async (req, res) => {
    try {
        const { id, role } = req.user;
        const whereClause = role === 'doctor'
            ? { id: req.params.id, doctorId: id }
            : { id: req.params.id, patientId: id };

        const appointment = await Appointment.findOne({
            where: whereClause,
            include: [
                { model: User, as: 'patient', attributes: ['id', 'fullName', 'email'] },
                { model: User, as: 'doctor', attributes: ['id', 'fullName', 'email'] }
            ]
        });

        if (!appointment)
            return res.status(404).json({ message: "Appointment not found" });

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Doctor updates appointment status (confirm or reject) or adds notes
export const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            where: { id: req.params.id, doctorId: req.user.id }
        });
        if (!appointment)
            return res.status(404).json({ message: "Appointment not found" });

        await appointment.update(req.body);

        // Notify the patient about the status change
        if (req.body.status) {
            await Notification.create({
                userId: appointment.patientId,
                title: 'Appointment Update',
                message: `Your appointment has been ${req.body.status}`,
                type: 'appointment'
            });
        }

        res.status(200).json({ message: "Appointment updated", appointment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Patient cancels their appointment
export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            where: { id: req.params.id, patientId: req.user.id }
        });
        if (!appointment)
            return res.status(404).json({ message: "Appointment not found" });

        if (appointment.status !== 'pending')
            return res.status(400).json({ message: "Only pending appointments can be cancelled" });

        await appointment.update({ status: 'cancelled' });

        // Notify the doctor
        await Notification.create({
            userId: appointment.doctorId,
            title: 'Appointment Cancelled',
            message: `A patient has cancelled their appointment on ${appointment.appointmentDate}`,
            type: 'appointment'
        });

        res.status(200).json({ message: "Appointment cancelled" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin gets all appointments
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [
                { model: User, as: 'patient', attributes: ['id', 'fullName', 'email'] },
                { model: User, as: 'doctor', attributes: ['id', 'fullName', 'email'] }
            ],
            order: [['appointmentDate', 'ASC']]
        });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
