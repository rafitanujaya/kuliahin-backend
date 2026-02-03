import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getDetailUserByIdController, getProfileUserByIdController, updateUserPasswordController, updateUserPreferenceController, updateUserProfileController } from "../controllers/userController.js";

export const userRoute = Router();

userRoute.get('/me', authMiddleware, getProfileUserByIdController)
userRoute.get('/detail', authMiddleware, getDetailUserByIdController)
userRoute.patch('/profile', authMiddleware, updateUserProfileController)
userRoute.patch('/password', authMiddleware, updateUserPasswordController)
userRoute.patch('/preferences', authMiddleware, updateUserPreferenceController)