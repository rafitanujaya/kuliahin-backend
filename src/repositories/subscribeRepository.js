export const createSubscribeRepository = async (userId, {id, endpoint, keys}, db) => {
    const query = {
        text: `INSERT INTO push_subscriptions(id, user_id, endpoint, p256dh, auth) VALUES($1, $2, $3, $4, $5) ON CONFLICT (endpoint) DO NOTHING`,
        values: [id, userId, endpoint, keys.p256dh, keys.auth]
    }

    await db.query(query);
}

export const testPushSubscribeRepository = async (userId, db) => {
    const query = {
        text: `SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = $1`,
        values: [userId]
    }

    const {rows} = await db.query(query);
    return rows
}

export const deleteSubscriptionByEndpointRepository = async (endpoint, db) => {
  const query = {
    text: "DELETE FROM push_subscriptions WHERE endpoint = $1",
    values: [endpoint],
  };

  await db.query(query);
};