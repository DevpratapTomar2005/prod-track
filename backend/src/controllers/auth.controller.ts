import type { Request, Response } from "express";
import { prisma } from "../db/db.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { ApiError } from "../utils/ApiError.ts";
import type {
  UserRegisterBody,
  UserLoginBody,
  CookieOptions,
} from "../models/user.model.ts";
import {
  getAccessToken,
  getRefreshToken,
  verifyToken,
} from "../utils/generateTokens.ts";
import crypto, { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/email.service.ts";
import { generateOtp, generateOtpHtml } from "../utils/getOtp.ts";
import { generatePasswordResetHtml } from "../utils/getResetPasswordHtml.ts";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstname, lastname, email, password }: UserRegisterBody = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new ApiError(400, "Invalid credentials");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
    },
  });

  const otp = generateOtp();
  const otpHtml = generateOtpHtml(otp);

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  await prisma.otps.create({
    data: {
      email: user.email,
      otp: hashedOtp,
      userId: user.id,
    },
  });

  await sendEmail(user.email, "Verification OTP", otpHtml);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user },
        "OTP sent to your email. Please verify to register.",
      ),
    );
});

const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp }: { email: string; otp: string } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(404, "Invalid credentials");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const otpRecord = await prisma.otps.findFirst({
    where: {
      userId: user.id,
      otp: hashedOtp,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (!otpRecord) {
    throw new ApiError(400, "Invalid OTP");
  }

  const isExpired =
    new Date().getTime() - new Date(otpRecord.created_at).getTime() >
    5 * 60 * 1000;

  if (isExpired) {
    await prisma.otps.deleteMany({
      where: {
        userId: user.id,
      },
    });
    throw new ApiError(400, "OTP has expired. Please request a new one");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isValid: true,
    },
  });

  await prisma.otps.deleteMany({
    where: {
      userId: user.id,
    },
  });

  const sessionId = randomUUID();
  const accessToken = getAccessToken(
    updatedUser.id,
    updatedUser.email,
    sessionId,
  );
  const refreshToken = getRefreshToken(
    updatedUser.id,
    updatedUser.email,
    sessionId,
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 5);
  await prisma.sessions.create({
    data: {
      id: sessionId,
      userId: updatedUser.id,
      refreshToken: hashedRefreshToken,
      ip: req.ip || "unknown",
      userAgent: req.headers["user-agent"] || "unknown",
    },
  });

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser, accessToken },
        "OTP verified successfully",
      ),
    );
});

const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(404, "Invalid credentials");
  }

  await prisma.otps.deleteMany({
    where: {
      userId: user.id,
    },
  });

  const otp = generateOtp();
  const otpHtml = generateOtpHtml(otp);

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  await prisma.otps.create({
    data: {
      email: user.email,
      otp: hashedOtp,
      userId: user.id,
    },
  });

  await sendEmail(user.email, "Verification OTP", otpHtml);

  res.status(200).json(new ApiResponse(200, {}, "OTP resent successfully"));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: UserLoginBody = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(404, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  await prisma.otps.deleteMany({
    where: {
      userId: user.id,
    },
  });

  const otp = generateOtp();
  const otpHtml = generateOtpHtml(otp);

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  await prisma.otps.create({
    data: {
      email: user.email,
      otp: hashedOtp,
      userId: user.id,
    },
  });

  await sendEmail(user.email, "Login OTP", otpHtml);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user },
        "OTP sent to your email. Please verify to log in.",
      ),
    );
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    throw new ApiError(401, "Invalid token");
  }

  const accessToken = getAccessToken(
    decodedToken.userId,
    decodedToken.email,
    decodedToken.sid,
  );
  const newRefreshToken = getRefreshToken(
    decodedToken.userId,
    decodedToken.email,
    decodedToken.sid,
  );
  const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 5);

  const session = await prisma.sessions.update({
    where: {
      id: decodedToken.sid,
      userId: decodedToken.userId,
      revoked: false,
    },
    data: {
      refreshToken: hashedRefreshToken,
    },
  });

  if (!session) {
    throw new ApiError(401, "Session is invalid");
  }

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(200, { accessToken }, "Token refreshed successfully"),
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    throw new ApiError(401, "Invalid token");
  }

  const session = await prisma.sessions.update({
    where: {
      id: decodedToken.sid,
      userId: decodedToken.userId,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });

  if (!session) {
    throw new ApiError(401, "Session is invalid");
  }

  res
    .status(200)
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email }: { email?: string } = req.body;

  if (!email || !email.trim()) {
    throw new ApiError(400, "Email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If an account with that email exists, a password reset link has been sent.",
        ),
      );
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    }),
    prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expires_at: expiresAt,
      },
    }),
  ]);

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl}/reset-password/${rawToken}`;

  const emailHtml = generatePasswordResetHtml(resetLink, user.firstname);
  await sendEmail(
    user.email,
    "Password Reset Request - Tick Trackerz",
    emailHtml,
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "If an account with that email exists, a password reset link has been sent.",
      ),
    );
});

const verifyResetToken = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Reset token is required");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token as string)
    .digest("hex");

  const resetTokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  if (!resetTokenRecord) {
    throw new ApiError(400, "Invalid or expired password reset link");
  }

  if (resetTokenRecord.expires_at < new Date()) {
    await prisma.passwordResetToken
      .delete({
        where: { id: resetTokenRecord.id },
      })
      .catch(() => {});

    throw new ApiError(
      400,
      "Password reset link has expired. Please request a new one.",
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { valid: true },
        "Token is valid. Proceed to reset password.",
      ),
    );
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password }: { password?: string } = req.body;

  if (!token) {
    throw new ApiError(400, "Reset token is required");
  }

  if (!password || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token as string)
    .digest("hex");

  const resetTokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  if (!resetTokenRecord) {
    throw new ApiError(400, "Invalid or expired password reset link");
  }

  if (resetTokenRecord.expires_at < new Date()) {
    await prisma.passwordResetToken
      .delete({
        where: { id: resetTokenRecord.id },
      })
      .catch(() => {});

    throw new ApiError(
      400,
      "Password reset link has expired. Please request a new one.",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetTokenRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { id: resetTokenRecord.id },
    }),
    prisma.sessions.deleteMany({
      where: { userId: resetTokenRecord.userId },
    }),
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password has been reset successfully. All active sessions have been signed out. Please log in with your new password.",
      ),
    );
});

export default {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  refreshToken,
  logoutUser,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
