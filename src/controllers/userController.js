import { getDetailUserByIdService, getProfileUserByIdService, updateUserPasswordService, updateUserPreferenceService, updateUserProfileService } from "../services/userService.js"

export const getProfileUserByIdController = async (req, res, next) => {
    try {
        const userId = req.user.id

        const result = await getProfileUserByIdService(userId);

        res.json({
            message: 'Success Get Profile User',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getDetailUserByIdController = async (req, res, next) => {
    try {
        const userId = req.user.id

        const result = await getDetailUserByIdService(userId);

        res.json({
            message: 'Success Get Detail User',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const updateUserProfileController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const payload = req.body

        const result = await updateUserProfileService(userId, payload)
        
        res.json({
            message: 'Success Update Profile',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const updateUserPasswordController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const payload = req.body
        payload.id = Number(payload?.number) || 1

        await updateUserPasswordService(userId, payload)

        res.json({
            message: 'Success Update Password',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const updateUserPreferenceController = async (req, res, next) => {
    try {
        const payload = req.body
        const userId = req.user.id

        const result = await updateUserPreferenceService(userId, payload)

        res.json({
            message: 'Success Update User Preference',
            data: result
        })
    } catch (error) {
        next(error)
    }
}