import { Router } from "express";
import * as loginController from "../controllers/loginController.js";

const router = Router();

router.post("/", loginController.login);
router.post("/logout", loginController.logout);
router.post("/create-account", loginController.createAccount);


export default router;
