export const getListNotificationRepository = async (userId, pool) => {
    const query = {
        text: `SELECT 
            id,
            type,
            reference_id,
            title,
            message,
            notify_at,
            is_read,
            created_at
        FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
        values: [userId],
    }
    const { rows } = await pool.query(query)
    return rows
}

export const markNotificationReadRepository = async (id, userId, pool) => {
  const query = {
    text: `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `,
    values: [id, userId],
  }

  const { rows } = await pool.query(query)
  return rows[0]
}

export const markAllNotificationsReadRepository = async (userId, pool) => {
  const query = {
    text: `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = $1 AND is_read = false
    `,
    values: [userId],
  }

  await pool.query(query)
}
