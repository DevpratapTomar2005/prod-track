import dotenv from "dotenv";
dotenv.config();

type EnvConfig = {
  PORT: number;
  DATABASE_URL: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_EMAIL_FROM: string;
};

if (!process.env.PORT) {
  throw new Error("PORT is not defined");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE URL is not defined");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

if (!process.env.RESEND_EMAIL_FROM) {
  throw new Error("RESEND_EMAIL_FROM is not defined");
}

export const envConfig: EnvConfig = {
  PORT: parseInt(process.env.PORT || "3000"),
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
};
