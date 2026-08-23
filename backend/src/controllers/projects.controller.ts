import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../models/user.model.ts";
import { prisma } from "../db/db.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { ApiError } from "../utils/ApiError.ts";

const createProject = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { name, start_date, end_date, status } = req.body;
    const user = req.user;

    if (!user || !name || !start_date || !end_date || !status) {
      throw new ApiError(400, "All fields are required");
    }

    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);

    const project = await prisma.project.create({
      data: {
        name,
        start_date: parsedStartDate,
        end_date: parsedEndDate,
        status,
        userId: user.userId,
      },
    });

    if (!project) {
      throw new ApiError(400, "Failed to create project");
    }

    res
      .status(201)
      .json(new ApiResponse(201, {project}, "Project created successfully"));
  },
);

const getProjects = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const projects = await prisma.project.findMany({
      skip,
      take: limit,
      where: {
        userId: user.userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (projects.length == 0) {
      throw new ApiError(404, "No projects found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, {projects}, "Projects fetched successfully"));
  },
);

export default {
    createProject,
    getProjects
}