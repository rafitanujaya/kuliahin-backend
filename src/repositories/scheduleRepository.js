import { normalizeTime } from "../utils/time.js";

export const createScheduleRepository = async ({id, courseId, day, location, startTime, endTime }, db) => {
    const query = {
        text: `INSERT INTO schedules(id, course_id, day, location, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6)`,
        values: [id, courseId, day, location, startTime, endTime]
    }

    await db.query(query)
}

export const getListScheduleByUserIdRepository = async (userId, day, db) => {
        const values = [userId];
    let whereClause = 'WHERE c.user_id = $1';

    if (day) {
        values.push(day);
        whereClause += ` AND s.day = $${values.length}`;
    }

    const query = {
        text: `SELECT s.id AS schedule_id, s.start_time, s.end_time, s.location, s.day, c.sks, c.type, c.lecturer, c.name, c.id as course_id
    FROM schedules s JOIN courses c ON c.id = s.course_id ${whereClause} ORDER BY s.start_time ASC`,
        values
    }

    const result = await db.query(query);
    return result.rows.map(row => ({
        id: row.schedule_id,
        location: row.location,
        day: row.day,
        startTime: normalizeTime(row.start_time),
        endTime: normalizeTime(row.end_time),
        course: {
            id: row.course_id,
            title: row.title,
            sks: row.sks,
            type: row.type,
            lecturer: row.lecturer,
            name: row.name
        }
    }))
}

export const deleteScheduleByIdRepository = async (id, db) => {
    const query = {
        text: `DELETE FROM schedules WHERE id = $1`,
        values: [id]
    }

    await db.query(query)
}

export const getCourseIdByScheduleIdAndUserIdRepository = async (id, userId, db) => {
    const query = {
        text: `SELECT s.course_id FROM schedules s JOIN courses c ON c.id = s.course_id WHERE s.id = $1 AND c.user_id = $2`,
        values: [id, userId]
    }

    const result = await db.query(query);
    return result.rows[0];
}

export const updateScheduleByIdRepository = async ({day, location, startTime, endTime, id}, db) => {
    const query = {
        text: `UPDATE schedules SET day = $1, location = $2, start_time = $3, end_time = $4 WHERE id = $5`,
        values: [day, location, startTime, endTime, id]
    }

    await db.query(query)
}

export const getScheduleByIdRepository = async (id, userId, db) => {
    const query = {
        text: `SELECT * FROM schedules s JOIN courses c ON c.id = s.course_id WHERE s.id = $1 AND c.user_id = $2`,
        values: [id, userId]
    }

    const result = await db.query(query);
    return result.rows.map(row => ({
        id: row.schedule_id,
        location: row.location,
        day: row.day,
        startTime: row.start_time,
        endTime: row.end_time,
        course: {
            id: row.course_id,
            title: row.title,
            sks: row.sks,
            type: row.type,
            lecturer: row.lecturer
        }
    }))[0]
}

export const getTodaySchedulesRepository = async (userId, today, db) => {
    const query = {
        text: `SELECT 
            s.id,
            s.start_time,
            s.end_time,
            s.location,
            c.name AS matkul,
            c.lecturer,
            c.type,
            CASE
                WHEN CURRENT_TIME BETWEEN s.start_time AND s.end_time THEN 'ongoing'
                WHEN CURRENT_TIME < s.start_time THEN 'upcoming'
                ELSE 'finished'
            END AS status
        FROM schedules s JOIN courses c ON c.id = s.course_id WHERE c.user_id = $1 AND s.day = $2 ORDER BY s.start_time ASC`,
        values: [userId, today]
    }

    const result = await db.query(query);
    return result.rows
}