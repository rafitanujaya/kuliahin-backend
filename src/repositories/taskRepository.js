export const createTaskRepository = async ({id, courseId, title, description, deadline, status, type, priority}, userId , db) => {
    const query = {
        text:  `INSERT INTO tasks(id, course_id, title, description, deadline, status, type, user_id, priority) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        values: [id, courseId, title, description, deadline, status, type, userId, priority]
    }

    await db.query(query)
}

export const getDetailTaskByIdRepository = async (id, userId, db) => {
    const query = {
        text: `SELECT t.title, t.description, t.deadline, t.status, t.type, t.priority, c.name as matkul FROM tasks t JOIN courses c ON c.id = t.course_id WHERE t.id = $1 AND t.user_id = $2 `,
        values: [id, userId]
    }

    const result = await db.query(query)
    return result.rows[0]
}

export const getListTaskRepository = async (userId, db) => {
    const query = {
        text: `SELECT t.id, t.title, t.description, t.deadline, t.status, t.type, t.priority, c.name as matkul FROM tasks t JOIN courses c ON c.id = t.course_id WHERE t.user_id = $1 `,
        values: [userId]
    }

    const result = await db.query(query)
    return result.rows
}

export const deleteTaskByIdRepository = async (id, userId, db) => {
    const query = {
        text: `DELETE FROM tasks WHERE id = $1 AND user_id = $2`,
        values: [id, userId]
    }

    await db.query(query)

}

export const updateTaskByIdRepository = async ({id, courseId, title, description, deadline, status, type}, userId , db) => {
    const query = {
        text: `UPDATE tasks SET title = $1, description = $2, deadline = $3, status = $4, type = $5, course_id = $6 WHERE id = $7 AND user_id = $8`,
        values: [title, description, deadline, status, type, courseId, id, userId]
    }

    await db.query(query)
}

export const getDeadlineOverviewRepository = async (userId, db) => {
    const query = {
        text: `SELECT 
            t.id,
            t.title,
            t.deadline,
            t.type,
            t.priority,
            c.name AS matkul,
            EXTRACT(EPOCH FROM (t.deadline - NOW())) as secondLeft
        FROM tasks t JOIN courses c ON c.id = t.course_id WHERE t.user_id = $1 AND t.status = 'todo' AND deadline > NOW() ORDER BY t.deadline ASC LIMIT 5 `,
        values: [userId]
    }
    const result = await db.query(query)
    return result.rows
}