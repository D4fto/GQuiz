import { Router } from "express";
import * as categoryController from '../controllers/categoryController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, categoryController.getCategories);
router.post("/", authMiddleware, adminMiddleware, categoryController.createCategory);
router.patch("/:id", authMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, categoryController.deleteCategory);



export default router;