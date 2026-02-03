import { createTaskService, deleteTaskByIdService, getDeadlineOverviewService, getListTaskByUserIdService, getTaskByIdService,  updateTaskService } from "../services/taskService.js"

export const createTaskController = async (req, res, next) => {
    try {
        const payload = req.body
        const userId = req.user.id

        const result = await createTaskService(payload, userId);

        res.status(201).json({
            message: 'Success Create Task',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getTaskByIdController = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id

        const result = await getTaskByIdService(taskId, userId)

        res.json({
            message: 'Success Get Task',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const getListTaskController = async (req, res, next) => {
    try {
        const userId = req.user.id

        const result = await getListTaskByUserIdService(userId)

        res.json({
            message: 'Success Get List Task',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const updateTaskController = async (req, res, next) => {
    try {
        const payload = req.body
        const userId = req.user.id
        const { taskId } = req.params 

        const result = await updateTaskService(payload, taskId, userId)

        res.json({
            message: 'Update Task Success',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const deleteTaskController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const {taskId} = req.params

        await deleteTaskByIdService(taskId, userId)

        res.json({
            message: 'Success Delete Task',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const getDeadlineOverviewController = async (req, res, next) => {
  try {
    const data = await getDeadlineOverviewService(req.user.id, req.db);

    res.status(200).json({
      message: "Success get deadline overview",
      data,
    });
  } catch (err) {
    next(err);
  }
};
