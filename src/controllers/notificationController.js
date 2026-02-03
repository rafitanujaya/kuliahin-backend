import { getNotificationsService, markAllNotificationsReadService, markNotificationReadService } from "../services/notificationService.js"

export const getNotificationsController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const data = await getNotificationsService(userId)
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

export const markNotificationReadController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { notificationId } = req.params

    const data = await markNotificationReadService(notificationId, userId)
    res.json({ data })
  } catch (err) {
    next(err)
  }
}

export const markAllNotificationsReadController = async (req, res, next) => {
  try {
    const userId = req.user.id
    await markAllNotificationsReadService(userId)
    res.json({ message: 'All notifications marked as read' })
  } catch (err) {
    next(err)
  }
}