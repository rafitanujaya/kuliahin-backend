import { Router } from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { getNotificationsController, markAllNotificationsReadController, markNotificationReadController } from "../controllers/notificationController.js"

export const notificationRouter = Router()

notificationRouter.get('/', authMiddleware,getNotificationsController)
notificationRouter.patch('/:id/read', authMiddleware,markNotificationReadController)
notificationRouter.patch('/read-all', authMiddleware,markAllNotificationsReadController)