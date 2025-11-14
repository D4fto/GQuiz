import { Router } from "express";
import * as worldController from '../controllers/worldController.js'
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, worldController.getWorlds);



export default router;