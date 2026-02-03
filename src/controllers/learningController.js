import { generateLearningInsightDirectService, getLearningInsightById } from "../services/aiInsightService.js";
import {  createLearningContentService, createLearningService, deleteLearningContentService, deleteLearningService, getLearningByIdService, getListLearningContentService, getListLearningService, updateLearningService } from "../services/learningService.js"

export const createLearningController = async (req, res, next) => {
    try {
        const payload = req.body
        const userId = req.user.id

        const result = await createLearningService(payload, userId);

        res.status(201).json({
            message: 'Success Create Learning Room',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getLearningByIdController = async (req, res, next) => {
    try {
        const {learningId} = req.params
        const userId = req.user.id

        const result = await getLearningByIdService(learningId, userId)

        res.json({
            message: 'Success Get Learning Room',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getListLearningController = async (req, res, next) => {
    try {
        const userId = req.user.id

        const learnings = await getListLearningService(userId);
        
        res.json({
            message: 'Success Get list Learning Rooms',
            data: learnings
        })
    } catch (error) {
        next(error)
    }
}

export const updateLearningController = async (req, res, next) => {
    try {
        const payload = req.body
        const userId = req.user.id
        const {learningId} = req.params

        await updateLearningService(payload, learningId, userId);

        res.json({
            message: 'Success Update Learning Space',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const deleteLearningController = async (req, res, next) => {
    try {
        const {learningId} = req.params
        const userid = req.user.id

        await deleteLearningService(learningId, userid);

        res.json({
            message: 'Success Delete Learning Rooms',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const createLearningContentController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const {learningId} = req.params
        const file = req.file;

        const result = await createLearningContentService(learningId, userId, file)

        res.status(201).json({
            message: 'Succes Create Content Learning',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getListLearningContentController = async (req, res, next) => {
    try {
        const {learningId} = req.params

        const result = await getListLearningContentService(learningId);

        res.json({
            message: 'Success Get List Learning Content',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const deleteLearningContentByIdController = async (req, res, next) => {
    try {
        const {learningId, contentId } = req.params

        await deleteLearningContentService(learningId, contentId)

        res.json({
            message: 'Succes Delete Content',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const generateLearningInsightDirectController = async (req, res, next) => {
    try {
        const {learningId} = req.params
        const userId = req.user.id

        const result = await generateLearningInsightDirectService(learningId, userId);

        res.json({
            message: 'Success Generate AI Insight',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getLearningInsigtByIdController = async (req, res, next) => {
    try {
        const {learningId} = req.params

        const result = await getLearningInsightById(learningId);

        res.json({
            message: 'Success Generate AI Insight',
            data: result
        })
    } catch (error) {
        next(error)
    }
}