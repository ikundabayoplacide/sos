import express from 'express';
import { getAllUsers,singleUser,updateUser,deleteUser, createUser } from '../controller/users.js';
import protect from '../middleware/auth.js';

const UserRoutes = express.Router();
UserRoutes.get("/api/getAllUsers",getAllUsers);
UserRoutes.post("/api/createUser",createUser);
UserRoutes.get("/api/getSingleUser/:id",protect,singleUser);
UserRoutes.put("/api/updateUser/:id",protect,updateUser);
UserRoutes.delete("/api/removeUser/:id",protect,deleteUser);


export default UserRoutes;