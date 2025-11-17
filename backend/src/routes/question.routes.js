import { Router } from "express";
import * as questionController from '../controllers/questionController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", adminMiddleware, questionController.getQuestions);
router.post("/", adminMiddleware, questionController.createQuestion);
router.patch("/:id", adminMiddleware, questionController.updateQuestion);
router.delete("/:id", adminMiddleware, questionController.deleteQuestion);

export default router;