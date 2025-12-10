import { Router } from "express";
import * as gameController from '../controllers/gameController.js'
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/random/start/", authMiddleware, gameController.onStartRandom);
router.get("/level/start/:id", authMiddleware, gameController.onStartLevel);
router.get("/rooms/", authMiddleware, gameController.getRooms);
router.post("/rooms/verify-password", authMiddleware, gameController.verifyPassword);


export default router;