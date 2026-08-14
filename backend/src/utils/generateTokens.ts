import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.ts";

export function getAccessToken(userId: string, email: string, sid: string):string {
  const payload = { userId, email, sid };
  return jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: "15m" });
}

export function getRefreshToken(userId: string, email: string, sid: string):string {
  const payload = { userId, email, sid };
  return jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: "1d" });
}
