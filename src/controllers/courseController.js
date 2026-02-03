import { getListCourseService } from "../services/courseService.js"

export const getListCourseController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const result = await getListCourseService(userId);

        res.json({
            message: 'Success Get List Course',
            data: result
        })
    } catch (error) {
        next(error)
    }
}