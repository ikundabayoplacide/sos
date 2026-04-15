import express from "express";
import { getMyNotifications, markAsRead, markAllAsRead } from "../controller/notifications.js";
import protect from "../middleware/auth.js";

const NotificationRoutes = express.Router();

NotificationRoutes.get("/api/notifications", protect, getMyNotifications);
NotificationRoutes.patch("/api/notifications/:id/read", protect, markAsRead);
NotificationRoutes.patch("/api/notifications/read-all", protect, markAllAsRead);

export default NotificationRoutes;
