import express from 'express';
import { getAllUsers,singleUser,createUser,updateUser,deleteUser } from '../controller/users.js';

const UserRoutes = express.Router();
UserRoutes.get("/getAllUsers",getAllUsers);
UserRoutes.post("/createUser",createUser);
UserRoutes.get("/getSingleUser/:id",singleUser);
UserRoutes.put("/updateUser/:id",updateUser);
UserRoutes.delete("/removeUser/:id",deleteUser);


export default UserRoutes;