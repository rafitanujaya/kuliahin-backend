export const createCourseRepository = async ({id, name, sks, type, lecturer}, userId,  db) => {
    const query = {
        text: `INSERT INTO courses(id, user_id, name, sks, type, lecturer) VALUES ($1, $2, $3, $4 ,$5, $6)`,
        values: [id, userId, name, sks, type, lecturer]
    }

    await db.query(query)
}

export const deleteCourseByIdRepository = async (id, userId, db) => {
    const query = {
        text: `DELETE FROM courses WHERE id = $1 AND user_id = $2`,
        values: [id, userId]
    }

    await db.query(query)
}

export const updateCourseByIdRepository = async ({name, sks, type, lecturer, courseId},userId, db) => {
    const query = {
        text: `UPDATE courses SET name = $1, sks = $2, type = $3, lecturer = $4 WHERE id = $5 AND user_id = $6 `,
        values: [name, sks, type, lecturer, courseId, userId]
    }

    await db.query(query)
}

export const getCourseByIdRepository = async (id, userId, db) => {
    const query = {
        text: `SELECT * FROM courses WHERE id = $1 AND user_id = $2`,
        values: [id, userId]
    }

    const result = await db.query(query);
    return result.rows[0]
}

export const getListCourseOwned = async (userId, db) => {
    const query = {
        text: `SELECT * FROM courses WHERE user_id = $1`,
        values: [userId]
    }

    const result = await db.query(query);
    return result.rows
}
