import { Router } from "express";
import * as questionController from '../controllers/questionController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, questionController.getQuestions);
router.post("/", authMiddleware, adminMiddleware, questionController.createQuestion);
router.patch("/:id", authMiddleware, adminMiddleware, questionController.updateQuestion);
router.delete("/:id", authMiddleware, adminMiddleware, questionController.deleteQuestion);

export default router;