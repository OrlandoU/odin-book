import { emitNotification, emitRemoveNotification } from "./socket"
import Notification, { NotificationInterface } from '../models/notification'
import { FilterQuery, Types } from "mongoose"

export const handleNewNotification = async (receiverId: Types.ObjectId | string, sender_id: Types.ObjectId | string, notificationTemplate: object): Promise<void | NotificationInterface | null> => {
    try {
        const noti: NotificationInterface = new Notification({
            user_id: receiverId, sender_id, ...notificationTemplate
        })
        const notification: NotificationInterface = await noti.save()
        const newNoti: NotificationInterface | null = await Notification.findById(notification._id)
            .populate('sender_id', '-password')
            .populate({
                path: 'post',
                populate: {
                    path: 'group'
                }
            }).populate('reaction').populate('request').populate('group')
        emitNotification(receiverId, newNoti!)
        return newNoti
    } catch (error) {
        console.error(error)
    }
}

export const handleUpsertNotification = async (oldNotificationDocument: FilterQuery<NotificationInterface>, notificationDocument?: FilterQuery<NotificationInterface> | null): Promise<null | void | NotificationInterface> => {
    try {
        console.log(oldNotificationDocument)
        const upsertedNotification: NotificationInterface | null = await Notification.findOneAndUpdate(oldNotificationDocument, notificationDocument || oldNotificationDocument, { upsert: true, new: true })
        if (upsertedNotification) {
            const newNoti: NotificationInterface | null = await Notification.findById(upsertedNotification._id)
                .populate('sender_id', '-password')
                .populate({
                    path: 'post',
                    populate: {
                        path: 'group'
                    }
                }).populate('reaction').populate('request').populate('group')

            emitNotification(upsertedNotification.user_id!, newNoti!)
            return newNoti
        }
        return 
    } catch (error) {
        console.error(error)
    }
}

export const handleRemoveNotification = async (notificationDocument: FilterQuery<NotificationInterface>): Promise<void> => {
    try {
        const notification: NotificationInterface | null = await Notification.findOneAndRemove(notificationDocument)
        if (notification) {
            emitRemoveNotification(notification.user_id!, notification)
        }
    } catch (error) {
        console.error(error)
    }
}

export const handleRemoveMultipleNotifications = async (notificationDocument: FilterQuery<NotificationInterface>): Promise<void> => {
    try {
        const notifications: NotificationInterface[] = await Notification.find(notificationDocument)
        notifications.forEach((notification: NotificationInterface): void => {
            emitRemoveNotification(notification.user_id!, notification)
        })
        await Notification.deleteMany(notificationDocument)
    } catch (error) {
        console.error(error)
    }
}