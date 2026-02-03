import webPush from '../config/webPush.js'
import { pool } from '../database/postgre/pool.js' 

export const pushToUser = async (userId, payload) => {
  const { rows } = await pool.query(
    `SELECT * FROM push_subscriptions WHERE user_id = $1`,
    [userId]
  )
  console.log('aku jalan');
  console.log(rows);
  for (const sub of rows) {
    try {
      await webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload)
      )
    } catch (err) {
      // subscription mati → hapus
      if (err.statusCode === 410) {
        await pool.query(
          `DELETE FROM push_subscriptions WHERE endpoint = $1`,
          [sub.endpoint]
        )
      } else {
        console.error('[PUSH ERROR]', err.message)
      }
    }
  }
}
