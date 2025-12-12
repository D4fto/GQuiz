import { Router } from "express";
import * as userController from '../controllers/userController.js'
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/me/points/", authMiddleware, userController.getMyPoints);
router.get("/", authMiddleware, adminMiddleware, userController.getUsers);
router.post("/", authMiddleware, adminMiddleware, userController.createUser);
router.patch("/me/", authMiddleware, userController.updateMyUser);
router.patch("/:id", authMiddleware, adminMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, userController.deleteUser);
router.get("/levels/:user", authMiddleware, userController.getUserLevels);
router.post("/levels/:user", authMiddleware, adminMiddleware, userController.addlevelsToUser);
router.delete("/levels/:user", authMiddleware, adminMiddleware, userController.removeLevelsFromUser);



export default router;
