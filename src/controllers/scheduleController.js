import { createScheduleService, deleteScheduleByIdService, getDetailScheduleByIdService, getListScheduleByUserIdService, getTodaySchedulesService, updateScheduleByIdService } from "../services/scheduleService.js";

export const createScheduleController = async (req, res, next) => {
    try {
        const payload = req.body;
        const userId = req.user.id

        const result = await createScheduleService(payload, userId);

        res.status(201).json({
            message: 'Success Create Schedule',
            data: result
        })

    } catch (error) {
        next(error)
    }
}

export const getListScheduleByUserIdController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { day } = req.query; 
        const result = await getListScheduleByUserIdService(userId, day);

        res.json({
            message: 'Success Get List Schedules',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const deleteScheduleByIdController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const {scheduleId} = req.params

        await deleteScheduleByIdService(scheduleId, userId);

        res.json({
            message: 'Success Delete Schedule',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}

export const updateScheduleByIdController = async (req, res, next) => {
    try {
        const payload = req.body
        const userId = req.user.id
        const {scheduleId} = req.params

        const result = await updateScheduleByIdService(payload,scheduleId, userId);
        console.log(result);
        res.json({
            message: 'Success Update Schedule',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getDetailScheduleByController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const {scheduleId} = req.params

        const result = await getDetailScheduleByIdService(scheduleId, userId);

        res.json({
            message: 'Success Get schedule',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getTodaySchedulesController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const result = await getTodaySchedulesService(userId);

        res.json({
            message: 'Success Get Schedule Today',
            data: result
        })
    } catch (error) {
        next(error)
    }
}