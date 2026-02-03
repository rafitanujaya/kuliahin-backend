import { Router } from "express";
import { loginController, loginGoogle, loginGoogleCb, registerController, verifyController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/verify', authMiddleware, verifyController)

// Google Login
authRouter.get('/google', loginGoogle)

// Google Callback
authRouter.get('/google/callback', loginGoogleCb)

export {
    authRouter
}