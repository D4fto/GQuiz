import { Router } from "express";
import * as gameController from '../controllers/gameController.js'
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/random/start/", authMiddleware, gameController.onStartRandom);
router.get("/level/start/:id", authMiddleware, gameController.onStartLevel);
router.get("/rooms/", authMiddleware, gameController.getRooms);


export default router;