import express from "express";
import "dotenv/config";
import sequelize from "./src/config/db.js";
import UserRoutes from "./src/routes/users.js";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api", UserRoutes);


sequelize.authenticate()
.then(() => sequelize.sync())
.then(() => {
    app.listen(PORT, () => {
        console.log(`Your database is running🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥`);
        console.log(`Server is running on http://localhost:${PORT}`);

    });
})
.catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
});
