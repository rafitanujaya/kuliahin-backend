import { NotFoundError } from "../errors/notFoundError.js"
import { getListNotificationRepository, markAllNotificationsReadRepository, markNotificationReadRepository } from "../repositories/notificationRepository.js"

export const getNotificationsService = async (userId) => {
  return await getListNotificationRepository(userId)
}

export const markNotificationReadService = async (id, userId) => {
  const notif = await markNotificationReadRepository(id, userId)
  if (!notif) {
    throw new NotFoundError('Notification not found')
  }
  return notif
}

export const markAllNotificationsReadService = async (userId) => {
  await markAllNotificationsReadRepository(userId)
}
