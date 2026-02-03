import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getListCourseController } from "../controllers/courseController.js";

export const courseRoute = Router()

courseRoute.get('/', authMiddleware, getListCourseController)