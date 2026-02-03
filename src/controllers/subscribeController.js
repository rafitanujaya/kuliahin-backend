import { ValidationError } from "../errors/validationError.js"
import { createSubscribeService, testPushSubscribeService } from "../services/subscribeService.js"

export const createSubscribeController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const {endpoint, keys} = req.body

        if(!endpoint || !keys?.p256dh || !keys?.auth) {
            throw new ValidationError('Invalid Subscription')
        }

        await createSubscribeService(userId, {endpoint, keys})

        res.status(201).json({
            message: 'Success Subscription',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const testPushSubscribeController = async (req, res, next) => {
    try {
        const userId = req.user.id

        await testPushSubscribeService(userId);

        res.json({
            message:'Success Notification Send',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}