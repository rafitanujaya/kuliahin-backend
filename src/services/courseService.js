import { pool } from "../database/postgre/pool.js"
import { getListCourseOwned } from "../repositories/courseRepository.js"

export const getListCourseService = async (userId) => {
    const courses = await getListCourseOwned(userId, pool);
    return courses
}