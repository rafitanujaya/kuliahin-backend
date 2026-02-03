import { v4 as uuid } from "uuid";
import { createSubscribeRepository, deleteSubscriptionByEndpointRepository, testPushSubscribeRepository } from "../repositories/subscribeRepository.js";
import { pool } from "../database/postgre/pool.js";
import webPush from "../config/webPush.js";

export const createSubscribeService = async (userId, payload) => {
    payload = {
        id: uuid(),
        ...payload
    }
    console.log(payload);

    await createSubscribeRepository(userId, payload, pool)
}

export const testPushSubscribeService = async (userId) => {
    const subs = await testPushSubscribeRepository(userId, pool);
    console.log(subs);

  if (subs.length === 0) {
    return;
  }

  const payload = JSON.stringify({
    title: "Kuliahin",
    body: "Push Notification berhasil",
    url: "/dashboard",
  });

  for (const sub of subs) {
    try {
      await webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      );
    } catch (err) {
      // 🔥 INI INTINYA
      if (err.statusCode === 410 || err.statusCode === 404) {
        console.log("🗑 Subscription expired, deleting:", sub.endpoint);
        await deleteSubscriptionByEndpointRepository(sub.endpoint, pool);
        continue;
      }

      // error lain = beneran error
      throw err;
    }
  }
}

export const sendPushToUser = async (userId, payload) => {
  const { rows } = await pool.query(
    `SELECT * FROM push_subscriptions WHERE user_id = $1`,
    [userId]
  );

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
      );
    } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
        console.log("🗑 Subscription expired, deleting:", sub.endpoint);
        await deleteSubscriptionByEndpointRepository(sub.endpoint, pool);
        continue;
      }

      throw err;
    }
  }
};