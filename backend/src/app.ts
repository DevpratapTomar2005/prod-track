import express, { type Response } from "express";
const app = express();

app.get("/health", (_, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

export { app };