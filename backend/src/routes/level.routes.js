import { Router } from "express";
import * as levelController from '../controllers/levelController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/world/:world", authMiddleware, levelController.getLevelsFromWorld);
router.get("/questions/:level", authMiddleware, levelController.getLevelQuestions);
router.post("/questions/:level", authMiddleware, adminMiddleware, levelController.addQuestionsToLevel);
router.delete("/questions/:level", authMiddleware, adminMiddleware, levelController.removeQuestionsFromLevel);
router.get("/", authMiddleware, adminMiddleware, levelController.getLevels);
router.post("/", authMiddleware, adminMiddleware, levelController.createLevel);
router.patch("/:id", authMiddleware, adminMiddleware, levelController.updateLevel);
router.delete("/:id", authMiddleware, adminMiddleware, levelController.deleteLevel);




export default router;