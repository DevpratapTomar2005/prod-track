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
import { getAccessToken, getRefreshToken } from "../utils/generateTokens.ts";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstname, lastname, email, password }: UserRegisterBody = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
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

  const sessionId = randomUUID();
  const accessToken = getAccessToken(user.id, user.email, sessionId);
  const refreshToken = getRefreshToken(user.id, user.email, sessionId);

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user, accessToken },
        "User registered successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: UserLoginBody = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const sessionId = randomUUID();
  const accessToken = getAccessToken(user.id, user.email, sessionId);
  const refreshToken = getRefreshToken(user.id, user.email, sessionId);

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
        { user, accessToken },
        "User logged in successfully",
      ),
    );
});


export default {
  registerUser,
  loginUser
};
