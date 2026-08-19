import express, { type Response } from "express";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middleware.ts";
import authRoutes from "./routes/auth.routes.ts";
import projectRoutes from "./routes/projects.routes.ts";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.get("/health", (_, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/project",projectRoutes);

app.use(globalErrorHandler);

export { app };
