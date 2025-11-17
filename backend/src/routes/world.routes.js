import { Router } from "express";
import * as worldController from '../controllers/worldController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, worldController.getWorlds);
router.post("/", adminMiddleware, worldController.createWorld);
router.patch("/:id", adminMiddleware, worldController.editWorld);
router.delete("/:id", adminMiddleware, worldController.deleteWorld);



export default router;