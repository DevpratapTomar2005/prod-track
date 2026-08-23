import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../models/user.model.ts";
import { prisma } from "../db/db.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { ApiError } from "../utils/ApiError.ts";

const createTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      task,
      startDate,
      startTime,
      dueDate,
      duration,
      status,
      subtasks,
      projectId,
      unit,
    } = req.body;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const createdTask = await prisma.task.create({
      data: {
        task,
        estStartDate: new Date(startDate),
        estStartTime: new Date(startTime),
        dueDate: new Date(dueDate),
        duration: Number(duration),
        status,
        unit,
        projectId: projectId,
        userId: user.userId,
      },
    });

    if (subtasks.length > 0) {
      await prisma.subtask.createMany({
        data: subtasks.map((subtask: string) => {
          return {
            subtask: subtask,
            taskId: createdTask.id,
          };
        }),
      });
    }

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { task: createdTask },
          "Task created successfully",
        ),
      );
  },
);

const getTaskById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const taskId = req.params.taskId;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!taskId) {
      throw new ApiError(400, "Please provide a task id");
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId as string,
        userId: user.userId,
      },
      include: {
        subtasks: true,
      },
    });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, { task }, "Task fetched successfully"));
  },
);

const getTodayTasks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const allTasks = await prisma.task.findMany({
      where: {
        userId: user.userId as string,
        OR: [
          { estStartDate: { gte: startOfToday, lte: endOfToday } },
          { dueDate: { gte: startOfToday, lte: endOfToday } },
        ],
      },
      orderBy: {
        estStartTime: "asc",
      },
    });

    if (allTasks.length === 0) {
      throw new ApiError(404, "No tasks found for today");
    }

    const nextTasks = allTasks
      .filter((task) => new Date(task.estStartTime) > new Date())
      .slice(0, 3);

    const todaysTasks = allTasks.filter((task) => {
      if (nextTasks.some((next) => next.id === task.id)) return false;
      if (new Date(task.estStartTime) <= new Date()) {
        return task.status === "TODO" || task.status === "IN_PROGRESS";
      }
      return true;
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { todaysTasks, nextTasks },
          "Tasks fetched successfully",
        ),
      );
  },
);

const getAllTasks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { skip = 0, limit = 10 } = req.query;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.userId as string,
      },
      skip: Number(skip),
      take: Number(limit),
      orderBy: {
        created_at: "desc",
      },
    });

    if (tasks.length === 0) {
      throw new ApiError(404, "No tasks found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, { tasks }, "All tasks fetched successfully"));
  },
);

const updateStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { taskId, status } = req.body;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!taskId) {
      throw new ApiError(400, "Please provide a task id");
    }

    if (!status) {
      throw new ApiError(400, "Please provide a status");
    }

    const [updatedTask] = await prisma.task.updateManyAndReturn({
      where: {
        id: taskId as string,
        userId: user.userId as string,
      },
      data: {
        status,
      },
    });

    if (!updatedTask) {
      throw new ApiError(404, "No tasks found to update");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, { updatedTask }, "Status updated successfully"),
      );
  },
);

const deleteTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { taskId } = req.params;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!taskId) {
      throw new ApiError(400, "Please provide a task id");
    }

    const deletedTask = await prisma.task.deleteMany({
      where: {
        id: taskId as string,
        userId: user.userId as string,
      },
    });

    if (deletedTask.count === 0) {
      throw new ApiError(404, "No tasks found to delete");
    }

    res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
  },
);

const deleteTasks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { taskIds } = req.body;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (taskIds.length === 0) {
      throw new ApiError(400, "Please provide  task ids");
    }

    const deletedTask = await prisma.task.deleteMany({
      where: {
        id: {
          in: taskIds,
        },
        userId: user.userId as string,
      },
    });

    if (deletedTask.count === 0) {
      throw new ApiError(404, "No tasks found to delete");
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Tasks deleted successfully"));
  },
);

const getTasksByProject = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { projectId } = req.params;
    const { skip = 0, limit = 10 } = req.query;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!projectId) {
      throw new ApiError(400, "Please provide a project id");
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId as string,
        userId: user.userId as string,
      },
      orderBy: {
        created_at: "desc",
      },
      skip: Number(skip),
      take: Number(limit),
    });

    if (tasks.length === 0) {
      throw new ApiError(404, "No tasks found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, { tasks }, "Tasks fetched successfully"));
  },
);

export default {
  createTask,
  getTaskById,
  getTodayTasks,
  getAllTasks,
  updateStatus,
  deleteTask,
  deleteTasks,
  getTasksByProject,
};
