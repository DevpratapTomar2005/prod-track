import express from "express";
import authController from "../controllers/auth.controller.ts";
import { verifyAccessToken } from "../middlewares/verifyToken.middleware.ts";
const router = express.Router();

router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.loginUser);


export default router;
