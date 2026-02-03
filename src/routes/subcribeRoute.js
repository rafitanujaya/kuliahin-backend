import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createSubscribeController, testPushSubscribeController } from "../controllers/subscribeController.js";

export const subscribeRoute = Router()

subscribeRoute.post('/', authMiddleware, createSubscribeController)
subscribeRoute.get('/test', authMiddleware, testPushSubscribeController)
