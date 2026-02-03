import { createTodoService, deletetTodoByIdService, getListTodoService, getTodoByIdService, updatetodoService } from "../services/todoService.js"

export const createTodoController = async (req, res, next) => {
    try {
        const payload = req.body
        const userId = req.user.id

        const result = await createTodoService(payload, userId);

        res.json({
            message: 'Success Create Todo',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getTodoByIdController = async (req, res, next) => {
    try {
        const { todoId } = req.params
        const userId = req.user.id

        const result = await getTodoByIdService(todoId, userId);

        res.json({
            message: 'Success Get Todo',
            data: result
        })

    } catch (error) {
        next(error)
    }
}

export const getListTodoController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const result = await getListTodoService(userId);

        res.json({
            message: 'Success Get List Todo',
            data: result
        })

    } catch (error) {
        next(error)
    }
}

export const updateTodoController = async (req, res, next) => {
    try {
        const payload = req.body
        const {todoId} = req.params
        const userId = req.user.id

        const result = await updatetodoService(todoId, payload, userId)

        res.json({
            message: 'Success Update Todo',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const deleteTodoController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { todoId } = req.params
        
        await deletetTodoByIdService(todoId, userId);

        res.json({
            message: 'Success Delete Todo',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}