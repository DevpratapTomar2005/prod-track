import express from "express";
import authControllers from "../controllers/auth.controller.ts";
const router = express.Router();

router.route("/register").post(authControllers.registerUser);
router.route("/verify-otp").post(authControllers.verifyOtp);
router.route("/resend-otp").post(authControllers.resendOtp);
router.route("/login").post(authControllers.loginUser);
router.route("/refresh").post(authControllers.refreshToken);
router.route("/logout").post(authControllers.logoutUser);
router.route("/forgot-password").post(authControllers.forgotPassword);
router.route("/reset-password/verify/:token").get(authControllers.verifyResetToken);
router.route("/reset-password/:token").post(authControllers.resetPassword);

export default router;
