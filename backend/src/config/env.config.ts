import dotenv from "dotenv";
dotenv.config();

type EnvConfig = {
    PORT: number;
    DATABASE_URL: string;
    NODE_ENV:string;
    JWT_SECRET: string;
};

if (!process.env.PORT) {
    throw new Error("PORT is not defined");
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE URL is not defined");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT SECRET is not defined");
}


export const envConfig: EnvConfig = {
  PORT: parseInt(process.env.PORT || "3000"),
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET
};

