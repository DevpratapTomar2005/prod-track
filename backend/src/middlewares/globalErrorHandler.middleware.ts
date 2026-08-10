import type { ErrorRequestHandler } from "express";
import { envConfig } from "../config/env.config.ts";
import { ApiError } from "../utils/ApiError.ts";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let error = err;

  if (error.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired", error.stack);
  } else if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error",
      error.stack,
    );
  }

  const response: {
    success: boolean;
    statusCode: number;
    message: string;
    errors: string[];
    data: null;
    stack?: string;
  } = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    data: error.data,
  };

  if (envConfig.NODE_ENV !== "production" && error.stack) {
    response.stack = error.stack;
  }

  console.error(error);

  return res.status(error.statusCode).json(response);
};
