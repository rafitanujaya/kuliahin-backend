import { NotFoundError } from "../errors/notFoundError.js";

export const createUserRepository = async ({id, fullname, email, password, avatarInitial }, db) => {
    const query = {
        text: `INSERT INTO users(id, fullname, email, password, avatar_initial) VALUES ($1, $2, $3, $4, $5)`,
        values: [id, fullname, email, password, avatarInitial]
    }

    await db.query(query);
}

export const createUserGoogleRepository = async ({id, fullname, email, avatarInitial }, db) => {
    const query = {
        text: `INSERT INTO users(id, fullname, email, avatar_initial, auth_provider) VALUES ($1, $2, $3, $4, 'google')`,
        values: [id, fullname, email, avatarInitial]
    }

    await db.query(query);
}

export const findUserByEmailRepository = async (email, db) => {
    const query = {
        text: `SELECT email FROM users WHERE email = $1`,
        values: [email]
    }

    const result = await db.query(query);

    return result.rowCount != 0 ? true : false;
}

export const getUserByEmailRepository = async (email, db) => {
    const query = {
         text: `SELECT id, fullname, password, email, auth_provider FROM users WHERE email = $1`,
         values: [email]
    }

    const result = await db.query(query);
    console.log(result.rows);
    return result.rows[0];
}

export const getUserByIdRepository = async (id, db) => {
    const query = {
         text: `SELECT id, fullname, password, email FROM users WHERE id = $1`,
         values: [id]
    }

    const result = await db.query(query);
    return result.rows[0];
}

export const getUserProfileByIdRepository = async (id, db) => {
    const query = {
        text: `SELECT fullname, avatar_initial, major FROM users WHERE id = $1`,
        values: [id]
    }

    const result = await db.query(query);
    return result.rows.map(row => ({
        fullname: row.fullname,
        avatarInitial: row.avatar_initial,
        major: row.major
    }))[0]
}

export const getDetailUserByIdRepository = async (id, db) => {
    const query = {
        text: `SELECT fullname, semester, theme, avatar_initial, major, notif_deadline, notif_schedule FROM users WHERE id = $1`,
        values: [id]
    }

    const result = await db.query(query);
    return result.rows.map(row => ({
        fullname: row.fullname,
        avatarInitial: row.avatar_initial,
        major: row.major,
        semester: row.semester,
        theme: row.theme,
        notifDeadline: row.notif_deadline,
        notifSchedule: row.notif_schedule
    }))[0]
}

export const updateUserProfileRepository = async (userId, {fullname, major, semester, avatarInitial}, pool) => {
    const query = {
        text: `UPDATE users SET fullname = $1, major = $2, semester = $3, avatar_initial = $4, updated_at = NOW() WHERE id = $5`,
        values: [fullname, major, semester, avatarInitial, userId]
    }
    await pool.query(query)
}

export const updateUserPasswordRepository = async (userId, password, pool) => {
    const query = {
        text: `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
        values: [password, userId]
    }
    await pool.query(query)
}

export const upsertUserPreferenceRepository = async (userId, prefs, db) => {
  const fieldMap = {
    notifDeadline: 'notif_deadline',
    notifSchedule: 'notif_schedule',
  }

  const sets = []
  const values = []
  let index = 1

  for (const key in fieldMap) {
    if (prefs[key] !== undefined) {
      sets.push(`${fieldMap[key]} = $${index}`)
      values.push(prefs[key])
      index++
    }
  }

  if (sets.length === 0) {
    throw NotFoundError('No preference to update')
  }

  values.push(userId)

  const query = {
    text: `
      UPDATE users
      SET ${sets.join(', ')},
          updated_at = NOW()
      WHERE id = $${index}
    `,
    values,
  }

  await db.query(query)
}
