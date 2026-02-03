import { Router } from "express";
import { authRouter } from "./authRoute.js";
import { scheduleRoute } from "./scheduleRoute.js";
import { taskRoute } from "./taskRoute.js";
import { todoRoute } from "./todoRoute.js";
import { courseRoute } from "./courseRoute.js";
import { learningRoute } from "./learningRoute.js";
import { userRoute } from "./userRoute.js";
import { notificationRouter } from "./notificationRoute.js";
import { subscribeRoute } from "./subcribeRoute.js";

const router = Router();

// Auth
router.use('/auth', authRouter);
router.use('/schedules', scheduleRoute)
router.use('/tasks', taskRoute)
router.use('/todos', todoRoute)
router.use('/courses', courseRoute)
router.use('/learning-room', learningRoute)
router.use('/users', userRoute)
router.use('/notifications', notificationRouter)
router.use('/subscribes', subscribeRoute) 

// Health Route
router.get('/health', (req, res) => res.json({ message: 'OK', data: {}}))

export {
    router
}