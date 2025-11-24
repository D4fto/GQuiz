import { Router } from "express";
import * as optionController from '../controllers/optionController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();


router.patch("/update-many/", authMiddleware, adminMiddleware, optionController.upateManyOptions);
router.get("/", authMiddleware,adminMiddleware, optionController.getOptions);
router.post("/", authMiddleware, adminMiddleware, optionController.createOption);
router.patch("/:id", authMiddleware, adminMiddleware, optionController.updateOption);
router.delete("/:id", authMiddleware, adminMiddleware, optionController.deleteOptions);


export default router;