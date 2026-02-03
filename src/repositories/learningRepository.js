export const createLearningRepository = async ({id, title, description = ""},userId, db) => {
    const query = {
        text: `INSERT INTO learning_spaces(id, user_id, title, description) VALUES ($1, $2, $3, $4)`,
        values: [id, userId, title, description]
    }

    await db.query(query)
}

export const getLearningByIdRepository = async (id, userId, db) => {
    const query = {
        text: `SELECT * FROM learning_spaces WHERE id = $1 AND user_id = $2`,
        values: [id, userId]
    }

    const result = await db.query(query)
    return result.rows[0]
}

export const getListLearningRepository = async (userId, db) => {
    const query = {
        text: `SELECT * FROM learning_spaces WHERE user_id = $1`,
        values: [userId]
    }

    const result = await db.query(query)
    return result.rows
}

export const updateLearningRepository = async ({id, title, description = ""}, userId, db) => {
    const query = {
        text: `UPDATE learning_spaces SET title = $1, description = $2 WHERE id = $3 AND user_id = $4`,
        values: [title, description, id, userId]
    }

    await db.query(query)
}

export const deleteLearningRepository = async (id, userId, db) => {
    const query = {
        text: `DELETE FROM learning_spaces WHERE id = $1 AND user_id = $2`,
        values: [id, userId]
    }
    await db.query(query)
}


export const createLearningContentRepository = async ({id, learningSpaceId, title, type, duration, fileSize, filePath, fileUrl, mimeType}, db) => {
    const query = {
        text: `INSERT INTO learning_contents(id, learning_space_id, title, type, duration, file_size, file_path, file_url, mime_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        values: [id, learningSpaceId, title, type, duration, fileSize, filePath, fileUrl, mimeType]
    }

    await db.query(query);
}

export const getListLearningContentRepository = async (learningSpaceId, db) => {
    const query = {
        text: `SELECT * FROM learning_contents WHERE learning_space_id = $1`,
        values: [learningSpaceId]
    }

    const result = await db.query(query);
    return result.rows
}

export const getDetailLearningContentRepository = async (learningId, contentId, db) => {
    const query = {
        text: `SELECT * FROM learning_contents WHERE id = $1 AND learning_space_id = $2 `,
        values: [contentId, learningId]
    }

    const result = await db.query(query);
    return result.rows[0]
} 

export const deleteLearningContentByIdRepository = async (learningId, contentId, db) => {
    const query = {
        text: `DELETE FROM learning_contents WHERE id = $1 AND learning_space_id = $2`,
        values: [contentId, learningId]
    }
    await db.query(query)
}

export const createAiInsightLearningRepository = async (
    { id, learningId, content },
    db
    ) => {
    const query = {
        text: `
        INSERT INTO ai_insights (id, learning_space_id, content)
        VALUES ($1, $2, $3)
        ON CONFLICT (learning_space_id)
        DO UPDATE SET
            content = EXCLUDED.content
        `,
        values: [id, learningId, content],
    }

    await db.query(query)
}

export const getLearningInsightByIdRepository = async (learningId, db) => {
    const query = {
        text: `SELECT * FROM ai_insights WHERE learning_space_id = $1`,
        values: [learningId]
    }

    const result = await db.query(query);
    return result.rows[0]
} 
