import DoctorAvailability from "../models/doctorAvailability.js";

export const createDoctorAvailabilityTable = async () => {
    await DoctorAvailability.sync({ alter: true, logging: false });
    console.log("DoctorAvailability table created or updated successfully 🔥");
};
