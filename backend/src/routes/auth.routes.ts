import express from "express";
import authControllers from "../controllers/auth.controller.ts";
import { verifyAccessToken } from "../middlewares/verifyToken.middleware.ts";
const router = express.Router();

router.route("/register").post(authControllers.registerUser);
router.route("/verify-otp").post(authControllers.verifyOtp);
router.route("/resend-otp").post(authControllers.resendOtp);
router.route("/login").post(authControllers.loginUser);
router.route("/refresh").post(authControllers.refreshToken);
router.route("/logout").post(authControllers.logoutUser);

export default router;
