import { Router } from "express";
import * as rankingController from '../controllers/rankingController.js'
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, rankingController.getRanking);
router.get("/:limit", authMiddleware, rankingController.getRanking);



export default router;
