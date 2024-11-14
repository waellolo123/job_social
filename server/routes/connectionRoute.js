import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { sendConnectionRequest } from "../controllers/connectionController.js";



const router = express.Router();


router.post("/request/:userId", protectRoute, sendConnectionRequest);
router.put("/accept/:requestId", protectRoute);
router.post("/reject/:requestId", protectRoute);
// get all connections request for the current user
router.get("/requests", protectRoute);
// get all connections for a user
router.get("", protectRoute);
router.delete("/:userId", protectRoute);
router.get("/status/:userId", protectRoute);


export default router;
