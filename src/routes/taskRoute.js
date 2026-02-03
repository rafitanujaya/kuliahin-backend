import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createTaskController, deleteTaskController, getDeadlineOverviewController, getListTaskController, getTaskByIdController, updateTaskController } from "../controllers/taskController.js";

export const taskRoute = Router()

taskRoute.post('/', authMiddleware, createTaskController);
taskRoute.get('/', authMiddleware, getListTaskController);
taskRoute.get('/deadlines', authMiddleware, getDeadlineOverviewController)
taskRoute.get('/:taskId', authMiddleware, getTaskByIdController)
taskRoute.put('/:taskId', authMiddleware, updateTaskController)
taskRoute.delete('/:taskId', authMiddleware, deleteTaskController)