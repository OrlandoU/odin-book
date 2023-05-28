const { emitNotification, emitRemoveNotification } = require("./socket")
const Notification = require('../models/notification')

exports.handleNewNotification = async (receiverId, sender_id, { type, post, request, reaction, comment }) => {
    const noti = new Notification({
        user_id: receiverId, sender_id, type, post, request, reaction, comment
    })
    const notification = await noti.save()
    const newNoti = await Notification.findById(notification._id)
        .populate('sender_id', '-password')
        .populate({
            path: 'post',
            populate: {
                path: 'group'
            }
        }).populate('reaction').populate('request')
    emitNotification(receiverId, newNoti)
    return newNoti
}

exports.handleUpsertNotification = async (oldNotificationDocument, notificationDocument) => {
    const upsertedNotification = await Notification.findOneAndUpdate(oldNotificationDocument, notificationDocument || oldNotificationDocument, { upsert: true, new: true })
    const newNoti = await Notification.findById(upsertedNotification._id)
        .populate('sender_id', '-password')
        .populate({
            path: 'post',
            populate: {
                path: 'group'
            }
        }).populate('reaction').populate('request')
    emitNotification(upsertedNotification.user_id, newNoti)
}

exports.handleRemoveNotification = async (notificationDocument) => {
    const notification = await Notification.findOneAndRemove(notificationDocument)
    if (notification) {
        emitRemoveNotification(notification.user_id, notification)
    }
}

exports.handleRemoveMultipleNotifications = async (notificationDocument) => {
    const notifications = await Notification.find(notificationDocument)
    notifications.forEach(notification => {
        emitRemoveNotification(notification.user_id, notification)
    })
    await Notification.deleteMany(notificationDocument)
}