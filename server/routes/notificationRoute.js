import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { deleteNotification, getUserNotifications, markNotificationAsRead } from "../controllers/notificationController.js";


const router = express.Router();


router.get("/", protectRoute, getUserNotifications);
router.put("/", protectRoute, markNotificationAsRead);
router.delete("/", protectRoute, deleteNotification);


export default router;
