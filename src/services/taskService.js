import { pool } from "../database/postgre/pool.js"
import { NotFoundError } from "../errors/notFoundError.js";
import { getCourseByIdRepository } from "../repositories/courseRepository.js";
import { createTaskRepository, deleteTaskByIdRepository, getDeadlineOverviewRepository, getDetailTaskByIdRepository, getListTaskRepository, updateTaskByIdRepository } from "../repositories/taskRepository.js";
import { validate } from "../validators/validation.js"
import { v4 as uuid } from "uuid";

export const createTaskService = async (payload, userId) => {
    const taskValidate = validate.task.create(payload)

    const dbClient = await pool.connect();

    try {
        await dbClient.query('BEGIN');
        const course = await getCourseByIdRepository(taskValidate.courseId, userId, dbClient);
        if(!course) {
            throw new NotFoundError('Course Tidak Ditemukan')
        }

        const task = {
            ...taskValidate,
            id: uuid(),
        }

        await createTaskRepository(task, userId, dbClient);

        await dbClient.query('COMMIT')
        return task
    } catch (error) {
        await dbClient.query('ROLLBACK')
        throw error
    } finally {
        dbClient.release()
    }
}

export const getTaskByIdService = async (id, userId) => {
    const task = await getDetailTaskByIdRepository(id, userId, pool);
    if (!task) {
        throw new NotFoundError('Task tidak ditemukan')
    }
    return task
}

export const deleteTaskByIdService = async (id, userId) => {
    const task = await getDetailTaskByIdRepository(id, userId, pool);
    if (!task) {
        throw new NotFoundError('Task tidak ditemukan')
    }
    await deleteTaskByIdRepository(id, userId, pool);
}

export const getListTaskByUserIdService = async (userId) => {
    const tasks = await getListTaskRepository(userId, pool);
    return tasks
}

export const updateTaskService = async (payload, taskId, userId) => {
    const taskValidate = validate.task.update(payload);

    let task = await getDetailTaskByIdRepository(taskId, userId, pool);
    if(!task) {
        throw new NotFoundError('Task tidak ditemukan')
    }

    task = {
        id: taskId,
        ...taskValidate
    }

    await  updateTaskByIdRepository(task, userId, pool)
    return task
}

export const getDeadlineOverviewService = async (userId) => {
    const tasks = await getDeadlineOverviewRepository(userId, pool)

    const formatRemainingTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const days = Math.floor(hours / 24);

        if (hours < 1) return "Kurang dari 1 jam";
        if (hours < 24) return `${hours} jam lagi`;
        return `${days} hari lagi`;
    };

    const mapUrgency = (seconds) => {
        if (seconds <= 24 * 3600) return "today";
        if (seconds <= 3 * 24 * 3600) return "soon";
        return "normal";
    };

    return tasks.map(task => ({
        id: task.id,
        title: task.title,
        matkul: task.matkul,
        type: task.type,
        priority: task.priority,
        urgency: mapUrgency(task.secondleft),
        deadlineLabel: formatRemainingTime(parseFloat(task.secondleft)),
    }))
}