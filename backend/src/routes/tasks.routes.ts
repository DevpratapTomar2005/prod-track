import express from "express";
import taskControllers from "../controllers/tasks.controller.ts";
import { verifyAccessToken } from "../middlewares/verifyToken.middleware.ts";
const router = express.Router();

router.route("/create").post(verifyAccessToken, taskControllers.createTask);
router.route("/today").get(verifyAccessToken, taskControllers.getTodayTasks);
router.route("/all").get(verifyAccessToken, taskControllers.getAllTasks);
router.route("/start").patch(verifyAccessToken, taskControllers.startTask);
router.route("/end").patch(verifyAccessToken, taskControllers.endTask);
router.route("/update-status").patch(verifyAccessToken, taskControllers.updateStatus);
router.route("/delete-many").delete(verifyAccessToken, taskControllers.deleteTasks);
router.route("/project/:projectId").get(verifyAccessToken, taskControllers.getTasksByProject);
router.route("/:taskId").get(verifyAccessToken, taskControllers.getTaskById);
router.route("/:taskId").delete(verifyAccessToken, taskControllers.deleteTask);

export default router;
