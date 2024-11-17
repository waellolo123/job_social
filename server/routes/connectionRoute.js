import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { acceptConnectionRequest, 
          getConnectionRequests, 
          getConnectionStatus, 
          getUserConnections, 
          rejectConnectionRequest, 
          removeConnection, 
          sendConnectionRequest } from "../controllers/connectionController.js";


const router = express.Router();


router.post("/request/:userId", protectRoute, sendConnectionRequest);
router.put("/accept/:requestId", protectRoute, acceptConnectionRequest);
router.post("/reject/:requestId", protectRoute, rejectConnectionRequest) ;
// get all connections request for the current user
router.get("/requests", protectRoute, getConnectionRequests);
// get all connections for a user
router.get("", protectRoute, getUserConnections);
router.delete("/:userId", protectRoute, removeConnection);
router.get("/status/:userId", protectRoute, getConnectionStatus);


export default router;
