export const createTodoRepository = async ({id, title, category, status}, userId, db) => {
    const query = {
        text: `INSERT INTO todos(id, user_id, title, category, status) VALUES ($1, $2, $3, $4, $5)`,
        values: [id, userId, title, category, status]
    }

    await db.query(query);
}

export const getTodoByIdRepository = async (id, userId, db) => {
    const query = {
        text: 'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
        values: [id, userId]
    }

    const result = await db.query(query);
    return result.rows[0] 
}

export const getListTodoByIdRepository = async (userId, db) => {
    const query = {
        text: 'SELECT * FROM todos WHERE user_id = $1',
        values: [userId]
    }

    const result = await db.query(query);
    return result.rows
}

export const updateTodoByIdRepository = async ({id, title, category, status}, userId, db) => {
    const query = {
        text: `UPDATE todos SET title = $1, category = $2, status = $3 WHERE id = $4 AND user_id = $5`,
        values: [title, category, status, id, userId]
    }

    await db.query(query)
}

export const deleteTodoByIdRepository = async (id, userId, db) => {
    const query = {
        text: `DELETE FROM todos WHERE id = $1 AND user_id = $2`,
        values: [id, userId]
    }

    await db.query(query);
}