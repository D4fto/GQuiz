import { Router } from "express";
import * as worldController from '../controllers/worldController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, worldController.getWorlds);
router.post("/", authMiddleware, adminMiddleware, worldController.createWorld);
router.patch("/:id", authMiddleware, adminMiddleware, worldController.editWorld);
router.delete("/:id", authMiddleware, adminMiddleware, worldController.deleteWorld);



export default router;