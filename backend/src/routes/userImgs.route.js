import { Router } from "express";
import * as userImgsController from '../controllers/userImgsController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, userImgsController.getUserImgs);
router.post("/", authMiddleware, adminMiddleware, userImgsController.createUserImgs);
router.patch("/:id", authMiddleware, adminMiddleware, userImgsController.updateUserImgs);
router.delete("/:id", authMiddleware, adminMiddleware, userImgsController.deleteUserImgs);




export default router;