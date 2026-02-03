import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createTodoController, deleteTodoController, getListTodoController, getTodoByIdController, updateTodoController } from "../controllers/todoController.js";

export const todoRoute = Router();

todoRoute.post('/', authMiddleware, createTodoController);
todoRoute.get('/', authMiddleware, getListTodoController);
todoRoute.get('/:todoId', authMiddleware, getTodoByIdController);
todoRoute.put('/:todoId', authMiddleware, updateTodoController)
todoRoute.delete('/:todoId', authMiddleware, deleteTodoController)
