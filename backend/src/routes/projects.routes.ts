import express from "express";
import projectControllers from "../controllers/projects.controller.ts";
import { verifyAccessToken } from "../middlewares/verifyToken.middleware.ts";
const router = express.Router();

router.route("/create").post(verifyAccessToken,projectControllers.createProject);
router.route("/get-projects").get(verifyAccessToken,projectControllers.getProjects);

export default router;