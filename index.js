import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/docs/swagger.js";
import sequelize from "./src/config/db.js";
import UserRoutes from "./src/routes/users.js";
import AuthRoutes from "./src/routes/auth.js";
import AvailabilityRoutes from "./src/routes/doctorAvailability.js";
import AppointmentRoutes from "./src/routes/appointments.js";
import NotificationRoutes from "./src/routes/notifications.js";
import "./src/database/models/association.js";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(UserRoutes);
app.use(AuthRoutes);
app.use(AvailabilityRoutes);
app.use(AppointmentRoutes);
app.use(NotificationRoutes);


sequelize.authenticate()
.then(() => sequelize.sync())
.then(() => {
    app.listen(PORT, () => {
        console.log(`Your database is running🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥`);
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Api documentation is available on http://localhost:${PORT}/api-docs`);

    });
})
.catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
});
