import { Result, ValidationError, body, validationResult } from 'express-validator'
import Notification, { NotificationInterface } from '../models/notification'
import { Middleware, NextFunction, Request, Response } from 'express'
import { UpdateWriteOpResult } from 'mongoose'
import { handleRemoveMultipleNotifications, handleUpsertNotification } from '../functions/notificationHandler'
import User, { UserInterface } from '../models/user'

export const notification_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { limit, sort, skip, ...filter } = req.query
        const parsedSkip: number = skip ? +skip : 0
        const parsedLimit: number = limit ? +limit : 0
        const notifications: NotificationInterface[] = await Notification.find(filter).sort({ create_date: -1 }).skip(parsedSkip).limit(parsedLimit).populate('sender_id', '-password')
            .populate({
                path: 'post',
                populate: {
                    path: 'group'
                }
            }).populate('reaction').populate('request').populate('group')
        return res.json(notifications)
    } catch (error) {
        next(error)
    }
}

export const notification_upsert: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    console.log(req.body)
    try {
        if (req.body.type === 'invite') {
            const user: UserInterface | null = await User.findById(req.body.user_id)
            if (user && !user.groups.includes(req.body.group)) {
                const notification: NotificationInterface | null | void = await handleUpsertNotification({ ...req.body, sender_id: req.user!._id })
                return res.json(notification)
            }
        } else {
            const notification: NotificationInterface | null | void = await handleUpsertNotification({ ...req.body, sender_id: req.user!._id })
            return res.json(notification)
        }
    } catch (error) {
        next(error)
    }
}

export const notification_viewed_put: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const notifications: UpdateWriteOpResult = await Notification.updateMany({ user_id: req.user!._id }, { isViewed: true })
        return res.json(notifications)
    } catch (error) {
        next(error)
    }
}

export const notification_put: Middleware[] = [
    async (req: Request, res: Response, next: NextFunction) => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array())
        }

        try {
            const notification: NotificationInterface | null = await Notification.findById(req.params.notificationId)
            if (!notification) {
                return res.sendStatus(404)
            } else if (!req.user!._id.equals(notification.user_id!)) {
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

export const notification_delete: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const notification: NotificationInterface | null = await Notification.findById(req.params.notificationId)
        if (!notification) {
            return res.sendStatus(200)
        }
        if (!req.user!._id.equals(notification.user_id!)) {
            return res.sendStatus(403)
        }
        const result: NotificationInterface | null = await Notification.findByIdAndRemove(req.params.notificationId)
        return res.json(result)
    } catch (error) {
        next(error)
    }
}

export const notifications_delete: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    handleRemoveMultipleNotifications({ ...req.body })
}