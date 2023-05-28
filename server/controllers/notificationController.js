const { body, validationResult } = require('express-validator')
const Notification = require('../models/notification')

exports.notification_get = async (req, res, next) => {
    try {
        const { limit, sort, skip, ...filter } = req.query
        const notifications = await Notification.find(filter).sort({ create_date: -1 }).skip(skip || 0).limit(limit || 0).populate('sender_id', '-password')
            .populate({
                path: 'post',
                populate: {
                    path: 'group'
                }
            }).populate('reaction').populate('request')
        return res.json(notifications)
    } catch (error) {
        next(error)
    }
}

exports.notification_viewed_put = async (req, res, next) => {
    try {
        const notifications = await Notification.updateMany({ user_id: req.user._id }, { isViewed: true })
        return res.json(notifications)
    } catch (error) {
        next(error)
    }
}

exports.notification_put = [
     async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array())
        }

        try {
            const notification = await Notification.findById(req.params.notificationId)
            if (!notification) {
                return res.sendStatus(404)
            } else if (!req.user._id.equals(notification.user_id)) {
                return res.sendStatus(403)
            }

            notification.isVisited = req.body.isVisited
            const response = await notification.save()
            return res.json(response)
        } catch (error) {
            next(error)
        }
    }
]

exports.notification_delete = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.notificationId)
        if (!req.user._id.equals(notification.user_id)) {
            return res.sendStatus(403)
        }
        const result = await Notification.findByIdAndRemove(req.params.notificationId)
        return res.json(result)
    } catch (error) {
        next(error)
    }
}
