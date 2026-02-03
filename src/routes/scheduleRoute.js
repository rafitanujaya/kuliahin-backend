import { Router } from "express";
import { createScheduleController, deleteScheduleByIdController, getDetailScheduleByController, getListScheduleByUserIdController, getTodaySchedulesController, updateScheduleByIdController } from "../controllers/scheduleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const scheduleRoute = Router();

scheduleRoute.post('/', authMiddleware,createScheduleController)
scheduleRoute.get('/', authMiddleware,getListScheduleByUserIdController)
scheduleRoute.get('/today', authMiddleware, getTodaySchedulesController)
scheduleRoute.get('/:scheduleId', authMiddleware,getDetailScheduleByController)
scheduleRoute.put('/:scheduleId', authMiddleware, updateScheduleByIdController)
scheduleRoute.delete('/:scheduleId', authMiddleware,deleteScheduleByIdController)

