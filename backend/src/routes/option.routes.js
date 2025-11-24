import { Router } from "express";
import * as optionController from '../controllers/optionController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();


router.patch("/update-many/", authMiddleware, adminMiddleware, optionController.upateManyOptions);


export default router;