import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createLearningContentController, createLearningController, deleteLearningContentByIdController, deleteLearningController, generateLearningInsightDirectController, getLearningByIdController, getLearningInsigtByIdController, getListLearningContentController, getListLearningController, updateLearningController } from "../controllers/learningController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

export const learningRoute = Router()

learningRoute.post('/', authMiddleware, createLearningController);
learningRoute.get('/', authMiddleware, getListLearningController);
learningRoute.get('/:learningId', authMiddleware, getLearningByIdController);
learningRoute.put('/:learningId', authMiddleware, updateLearningController);
learningRoute.delete('/:learningId', authMiddleware, deleteLearningController);
learningRoute.post('/:learningId/content', authMiddleware, upload.single('file'), createLearningContentController)
learningRoute.get('/:learningId/content', authMiddleware, getListLearningContentController)
learningRoute.post('/:learningId/ai-analysis', authMiddleware, generateLearningInsightDirectController)
learningRoute.get('/:learningId/ai-analysis', authMiddleware, getLearningInsigtByIdController)
learningRoute.delete('/:learningId/content/:contentId', authMiddleware, deleteLearningContentByIdController)
