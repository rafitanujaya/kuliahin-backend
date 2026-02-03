import cron from "node-cron"
import { pool } from "../database/postgre/pool.js"
import { v4 as uuid } from "uuid"
import { pushToUser } from "./pushJob.js"

export const startNotificationJob = () => {
  console.log("[CRON] Notification job started")

  cron.schedule("* * * * *", async () => {
    console.log("[CRON] running notification check...")
    try {
      await createTaskNotifications()
      await createScheduleNotifications()
    } catch (err) {
      console.error("[CRON] Notification job error:", err)
    }
  })
}

const getOneHourDeadlineMessage = (task) => {
  if (task.remaining_minutes <= 1) {
    return `Tugas "${task.title}" akan jatuh tempo sebentar lagi`
  }

  return `Tugas "${task.title}" akan jatuh tempo dalam ${task.remaining_minutes} menit`
}


/* =======================
   TASK DEADLINE NOTIF
======================= */
const createTaskNotifications = async () => {
  const query = `
    SELECT
      t.id AS task_id,
      t.title,
      t.user_id,
      c.name AS course_name,
      DATE(NOW()) AS occurrence_date,

      FLOOR(EXTRACT(EPOCH FROM (t.deadline - NOW())) / 60)    AS remaining_minutes,
      FLOOR(EXTRACT(EPOCH FROM (t.deadline - NOW())) / 3600)  AS remaining_hours,
      FLOOR(EXTRACT(EPOCH FROM (t.deadline - NOW())) / 86400) AS remaining_days

    FROM tasks t
    JOIN users u   ON u.id = t.user_id
    JOIN courses c ON c.id = t.course_id

    WHERE t.status = 'todo'
      AND u.notif_deadline = true
      AND (
        /* =====================
           H-3 HARI (71–83 JAM)
        ====================== */
        t.deadline BETWEEN
          NOW() + INTERVAL '71 hours'
          AND
          NOW() + INTERVAL '83 hours'

        OR

        /* =====================
           H-1 HARI / BESOK (23–35 JAM)
        ====================== */
        t.deadline BETWEEN
          NOW() + INTERVAL '23 hours'
          AND
          NOW() + INTERVAL '35 hours'

        OR

        /* =====================
           REALTIME ≤ 1 JAM
        ====================== */
        (
          t.deadline > NOW()
          AND t.deadline <= NOW() + INTERVAL '1 hour'
        )
      );
  `

  const { rows } = await pool.query(query)
  console.log("[CRON] task deadline check")
  console.log(rows)

  if (!rows.length) return

  for (const task of rows) {
    let message = ""
    const title = "Deadline Tugas ⏰"

    // === PRIORITAS LOGIC ===
    if (task.remaining_days >= 3) {
      message = `Tugas "${task.title}" (${task.course_name}) akan jatuh tempo dalam 3 hari`
    } else if (task.remaining_days >= 1) {
      message = `Tugas "${task.title}" (${task.course_name}) akan jatuh tempo besok`
    } else {
      // REALTIME ≤ 1 JAM
      if (task.remaining_minutes <= 1) {
        message = `Tugas "${task.title}" (${task.course_name}) akan jatuh tempo sebentar lagi`
      } else {
        message = `Tugas "${task.title}" (${task.course_name}) akan jatuh tempo dalam ${task.remaining_minutes} menit`
      }
    }

    const { rowCount } = await pool.query(
      `
      INSERT INTO notifications (
        id,
        user_id,
        type,
        reference_id,
        occurrence_date,
        title,
        message,
        notify_at
      )
      VALUES ($1, $2, 'task', $3, $4, $5, $6, NOW())
      ON CONFLICT (user_id, type, reference_id, occurrence_date) DO NOTHING
      `,
      [
        uuid(),
        task.user_id,
        task.task_id,
        task.occurrence_date,
        title,
        message,
      ]
    )

    if (rowCount > 0) {
      await pushToUser(task.user_id, {
        title,
        body: message,
        url: "/tugas",
      })
    }
  }
}

// const createTaskNotifications = async () => {
//   const query = `
//     SELECT 
//       t.id,
//       t.title,
//       t.user_id
//     FROM tasks t
//     JOIN users u ON u.id = t.user_id
//     WHERE t.status = 'todo'
//       AND u.notif_deadline = true
//       AND ABS(
//         EXTRACT(EPOCH FROM (t.deadline - NOW())) - 7200
//       ) < 60
//   `

//   const { rows } = await pool.query(query)
//   if (!rows.length) return

//   for (const task of rows) {
//     const { rowCount } = await pool.query(
//       `
//       INSERT INTO notifications (
//         id,
//         user_id,
//         type,
//         reference_id,
//         title,
//         message,
//         notify_at
//       )
//       VALUES ($1, $2, 'task', $3, $4, $5, NOW())
//       ON CONFLICT (user_id, type, reference_id) DO NOTHING
//       `,
//       [
//         uuid(),
//         task.user_id,
//         task.id,
//         "Deadline Tugas ⏰",
//         `Tugas "${task.title}" akan berakhir dalam 2 jam`,
//       ]
//     )

//     if (rowCount > 0) {
//       await pushToUser(task.user_id, {
//         title: "Deadline Tugas ⏰",
//         body: `Tugas "${task.title}" akan berakhir dalam 2 jam`,
//         url: "/tugas",
//       })
//     }
//   }
// }

/* =======================
   SCHEDULE REALTIME NOTIF
======================= */
const createScheduleNotifications = async () => {
  const query = `
    SELECT
      s.id AS schedule_id,
      c.user_id,
      c.name AS course_name,
      s.location,
      CURRENT_DATE AS occurrence_date,
      FLOOR(
        EXTRACT(EPOCH FROM (
          (CURRENT_DATE + s.start_time)
          - (NOW() AT TIME ZONE 'Asia/Jakarta')
        )) / 60
      ) AS remaining_minutes
    FROM schedules s
    JOIN courses c ON c.id = s.course_id
    JOIN users u ON u.id = c.user_id
    WHERE u.notif_schedule = true
      AND s.day = (
        CASE EXTRACT(DOW FROM (NOW() AT TIME ZONE 'Asia/Jakarta')::date)
          WHEN 0 THEN 'minggu'::days
          WHEN 1 THEN 'senin'::days
          WHEN 2 THEN 'selasa'::days
          WHEN 3 THEN 'rabu'::days
          WHEN 4 THEN 'kamis'::days
          WHEN 5 THEN 'jumat'::days
          WHEN 6 THEN 'sabtu'::days
        END
      )
      AND (CURRENT_DATE + s.start_time) > (NOW() AT TIME ZONE 'Asia/Jakarta')
      AND (CURRENT_DATE + s.start_time) <= (NOW() AT TIME ZONE 'Asia/Jakarta') + INTERVAL '30 minutes'
  `

  const { rows } = await pool.query(query)
  if (!rows.length) return

  for (const s of rows) {
    if (s.remaining_minutes <= 0) continue

    const title = `Jadwal Kuliah 📚`
    const message = `Kuliah ${s.course_name} akan dimulai ${s.remaining_minutes} menit lagi di ruangan ${s.location}`

    const { rowCount } = await pool.query(
      `
      INSERT INTO notifications (
        id,
        user_id,
        type,
        reference_id,
        occurrence_date,
        title,
        message,
        notify_at
      )
      VALUES ($1, $2, 'schedule', $3, $4, $5, $6, NOW())
      ON CONFLICT (user_id, type, reference_id, occurrence_date) DO NOTHING
      `,
      [
        uuid(),
        s.user_id,
        s.schedule_id,
        s.occurrence_date,
        title,
        message,
      ]
    )

    if (rowCount > 0) {
      await pushToUser(s.user_id, {
        title,
        body: message,
        url: "/jadwal",
      })
    }
  }
}


// const createScheduleNotifications = async () => {
//   const query = `
//     SELECT
//       s.id AS schedule_id,
//       c.user_id,
//       c.name AS course_name,
//       FLOOR(
//         EXTRACT(EPOCH FROM (
//           (CURRENT_DATE + s.start_time)
//           - (NOW() AT TIME ZONE 'Asia/Jakarta')
//         )) / 60
//       ) AS remaining_minutes
//     FROM schedules s
//     JOIN courses c ON c.id = s.course_id
//     JOIN users u ON u.id = c.user_id
//     WHERE u.notif_schedule = true
//       AND s.day = (
//         CASE EXTRACT(DOW FROM (NOW() AT TIME ZONE 'Asia/Jakarta')::date)
//           WHEN 0 THEN 'minggu'::days
//           WHEN 1 THEN 'senin'::days
//           WHEN 2 THEN 'selasa'::days
//           WHEN 3 THEN 'rabu'::days
//           WHEN 4 THEN 'kamis'::days
//           WHEN 5 THEN 'jumat'::days
//           WHEN 6 THEN 'sabtu'::days
//         END
//       )
//       AND (CURRENT_DATE + s.start_time) > (NOW() AT TIME ZONE 'Asia/Jakarta')
//       AND (CURRENT_DATE + s.start_time) <= (NOW() AT TIME ZONE 'Asia/Jakarta') + INTERVAL '30 minutes'
//   `

//   const { rows } = await pool.query(query)
//   console.log('Pasti Jalan bang');
//   console.log(rows);
//   if (!rows.length) return
//   for (const s of rows) {
//     // safety guard
//     if (s.remaining_minutes <= 0) continue

//     const { rowCount } = await pool.query(
//       `
//       INSERT INTO notifications (
//         id,
//         user_id,
//         type,
//         reference_id,
//         title,
//         message,
//         notify_at
//       )
//       VALUES ($1, $2, 'schedule', $3, $4, $5, NOW())
//       ON CONFLICT (user_id, type, reference_id) DO NOTHING
//       `,
//       [
//         uuid(),
//         s.user_id,
//         s.schedule_id,
//         "Jadwal Kuliah 📚",
//         `Kuliah "${s.course_name}" akan dimulai dalam ${s.remaining_minutes} menit`,
//       ]
//     )

//     if (rowCount > 0) {
//       await pushToUser(s.user_id, {
//         title: "Jadwal Kuliah 📚",
//         body: `Kuliah "${s.course_name}" akan dimulai dalam ${s.remaining_minutes} menit`,
//         url: "/jadwal",
//       })
//     }
//   }
// }
