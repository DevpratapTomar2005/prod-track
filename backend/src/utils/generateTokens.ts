import jwt, { type JwtPayload } from "jsonwebtoken";
import { envConfig } from "../config/env.config.ts";

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  sid: string;
}

export function getAccessToken(
  userId: string,
  email: string,
  sid: string,
): string {
  const payload = { userId, email, sid };
  return jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: "15m" });
}

export function getRefreshToken(
  userId: string,
  email: string,
  sid: string,
): string {
  const payload = { userId, email, sid };
  return jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): CustomJwtPayload {
  return jwt.verify(token, envConfig.JWT_SECRET) as CustomJwtPayload;
}
