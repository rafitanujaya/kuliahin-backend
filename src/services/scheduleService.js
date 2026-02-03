import { pool } from "../database/postgre/pool.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { createCourseRepository, deleteCourseByIdRepository, getCourseByIdRepository, updateCourseByIdRepository } from "../repositories/courseRepository.js";
import { createScheduleRepository, deleteScheduleByIdRepository, getCourseIdByScheduleIdAndUserIdRepository, getListScheduleByUserIdRepository, getScheduleByIdRepository, getTodaySchedulesRepository, updateScheduleByIdRepository } from "../repositories/scheduleRepository.js";
import { validate } from "../validators/validation.js"
import { v4 as uuid } from "uuid";

export const createScheduleService = async (payload, userId) => {
    const validateCourse = validate.course.create(payload);
    const validateSchedule = validate.schedule.create(payload);

    const dbClient = await pool.connect()
    
    try {
        await dbClient.query('BEGIN')

        const course = {
            ...validateCourse,
            id : uuid()
        }

        await createCourseRepository(course, userId, dbClient);

        const schedule = {
            ...validateSchedule,
            id : uuid(),
            courseId : course.id
        }

        await createScheduleRepository(schedule, dbClient)


        await dbClient.query('COMMIT')

        return {
            ...schedule,
            course :{
                ...course
            }

        }
    } catch (error) {
        await dbClient.query('ROLLBACK')
        throw error
    } finally {
        dbClient.release()
    }
}

export const getListScheduleByUserIdService = async (userId, day) => {
    try {
        const schedules = await getListScheduleByUserIdRepository(userId, day, pool)

        return schedules
    } catch (error) {
        throw error
    }
}

export const deleteScheduleByIdService = async (id, userId) => {
    const dbClient = await pool.connect()

    try {
        await dbClient.query('BEGIN')

        const courseId = await getCourseIdByScheduleIdAndUserIdRepository(id, userId, dbClient);
        if(!courseId) {
            throw new NotFoundError('Schedule Not Found')
        }

        await deleteScheduleByIdRepository(id, dbClient)

        await deleteCourseByIdRepository(courseId.course_id, userId, dbClient);

      await dbClient.query('COMMIT')
    } catch (error) {
        await dbClient.query('ROLLBACK')
        throw error
    } finally {
        dbClient.release()
    }

}

export const updateScheduleByIdService = async (payload, id, userId) => {
    const validateCourse = validate.course.update(payload);
    const validateSchedule = validate.schedule.update(payload);

    const dbClient = await pool.connect()
    
    try {
        await dbClient.query('BEGIN')

        const course = await getCourseByIdRepository(validateCourse.courseId, userId, dbClient);

        if(!course) {
            throw new NotFoundError('Course Tidak Ditemukan')
        }

        await updateCourseByIdRepository(validateCourse, userId, dbClient);

        const schedule = {
            ...validateSchedule,
            id,
        }

        await updateScheduleByIdRepository(schedule, dbClient)

        await dbClient.query('COMMIT')

        return {
            ...schedule,
            course :{
                id: validateCourse.courseId,
                name: validateCourse.name,
                lecturer: validateCourse.lecturer,
                sks: validateCourse.sks,
                type: validateCourse.type
            }
        }
    } catch (error) {
        await dbClient.query('ROLLBACK')
        throw error
    } finally {
        dbClient.release()
    }
}

export const getDetailScheduleByIdService = async (id, userId) => {
    const courseId = await getCourseIdByScheduleIdAndUserIdRepository(id, userId, pool);
    if(!courseId) {
        throw new NotFoundError('Schedule Not Found')
    }

    const course = await getCourseByIdRepository(courseId.course_id, userId, pool)
    if(!course) {
        throw new NotFoundError('Schedule Not Found')
    }

    const schedule = await getScheduleByIdRepository(id, userId, pool)
    if(!schedule) {
        throw new NotFoundError('Schedule Not Found')
    }

    return schedule

}

export const getTodaySchedulesService = async (userId) => {
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long'}).toLowerCase()
    
    const schedules = await getTodaySchedulesRepository(userId, today, pool);

    return schedules.map(schedule => ({
        id: schedule.id,
        time: `${schedule.start_time} - ${schedule.end_time}`,
        status: schedule.status,
        name: schedule.name,
        lecturer: schedule.lecturer,
        location: schedule.location,
        type: schedule.type,
    }))
}