import type { Request, NextFunction } from "express";
import type { AuthenticatedRequest } from "../models/user.model.ts";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";

export const verifyAccessToken = asyncHandler(
  async (req: AuthenticatedRequest, _, next: NextFunction) => {
    const accessToken = req.headers["authorization"]?.split(" ")[1];

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(accessToken, envConfig.JWT_SECRET) as {
      userId: string;
      email: string;
      sid: string;
    };

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Token");
    }

    req.user = decodedToken;
    next();
  },
);
