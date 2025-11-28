import { Router } from "express";
import * as questionController from '../controllers/questionController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/title/", authMiddleware, adminMiddleware, questionController.getQuestionsTitles);
router.get("/", authMiddleware, adminMiddleware, questionController.getQuestions);
router.post("/", authMiddleware, adminMiddleware, questionController.createQuestion);
router.post("/answer/:index", authMiddleware, questionController.answerQuestion);
router.post("/next/", authMiddleware, questionController.nextQuestion);
router.get("/actual/", authMiddleware, questionController.getActualQuestion);
router.patch("/:id", authMiddleware, adminMiddleware, questionController.updateQuestion);
router.delete("/:id", authMiddleware, adminMiddleware, questionController.deleteQuestion);

export default router;