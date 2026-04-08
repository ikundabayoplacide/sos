import DoctorAvailability from "../models/doctorAvailability.js";
import User from "../models/users.js";

export const seedDoctorAvailability = async () => {
    const doctors = await User.findAll({ where: { role: 'doctor' } });
    if (doctors.length === 0) return;

    const slots = ['Monday', 'Wednesday', 'Friday'].map(day => ({
        doctorId: doctors[0].id,
        dayOfWeek: day,
        startTime: '08:00:00',
        endTime: '17:00:00',
        isAvailable: true
    }));

    await DoctorAvailability.bulkCreate(slots, { ignoreDuplicates: true });
};
