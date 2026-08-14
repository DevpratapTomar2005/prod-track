import type { Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";

export const verifyAccessToken = asyncHandler(
  async (req: Request, _, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(authHeader, envConfig.JWT_SECRET);

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Token");
    }

    req.user = decodedToken;
    next();
  },
);
