import { Middleware, NextFunction, Request, Response } from "express"
import { RelationshipInterface } from "../models/relationship"
import { Types } from "mongoose"
import { UserInterface } from "../models/user"

import User from '../models/user'
import Chat, { ChatInterface } from '../models/chat'
import Relationship from '../models/relationship'
import Message, { MessageInterface } from '../models/message'
import { handleNewNotification, handleRemoveMultipleNotifications } from '../functions/notificationHandler'

export const friends_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const { limit } = req.query
    const parsedLimit: number = limit ? +limit : 0
    try {
        const friends: RelationshipInterface[] = await Relationship.find({
            $or: [{ user1_id: req.params.userId }, { user2_id: req.params.userId }],
            request_state: 'Accepted'
        }).populate('user1_id').populate('user2_id').limit(parsedLimit)
        return res.json(friends)
    } catch (error) {
        next(error)
    }
}

export const relationship_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const friend: RelationshipInterface | null = await Relationship.findOne({
            $or: [{ user1_id: req.params.userId, user2_id: req.user!._id },
            { user1_id: req.user!._id, user2_id: req.params.userId }],
        }).populate('user1_id').populate('user2_id')

        return res.json(friend)
    } catch (error) {
        next(error)
    }
}

export const friends_suggestions_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const rels: RelationshipInterface[] = await Relationship.find({
            $or: [
                {
                    $and: [
                        { user1_id: req.user!._id },
                        { request_state: 'Accepted' }
                    ]
                },
                {
                    $and: [
                        { user2_id: req.user!._id },
                        { request_state: 'Accepted' }
                    ]
                },
                {
                    $and: [
                        { user1_id: req.user!._id },
                        { request_state: 'Pending' },
                        { sender_id: { $ne: req.user!._id } }
                    ]
                },
                {
                    $and: [
                        { user2_id: req.user!._id },
                        { request_state: 'Pending' },
                        { sender_id: { $ne: req.user!._id } }
                    ]
                }
            ],
        })
        const friends: Types.ObjectId[] = rels.map((rel: RelationshipInterface) => {
            if (req.user!._id.equals(rel.user2_id)) {
                return rel.user1_id
            }
            return rel.user2_id
        })
        const users: UserInterface[] = await User.find({ _id: { $nin: [...friends, req.user!._id] } })
        return res.json(users)
    } catch (error) {
        next(error)
    }

}

export const friends_in_common_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {

    const result: RelationshipInterface[] = await Relationship.aggregate([
        { $match: { user1_id: { $in: [req.user!._id, req.params.userId] }, user2_id: { $in: [req.user!._id, req.params.userId] } } },
        { $lookup: { from: "users", localField: "user1_id", foreignField: "_id", as: "user1" } },
        { $lookup: { from: "users", localField: "user2_id", foreignField: "_id", as: "user2" } },
        { $unwind: "$user1" },
        { $unwind: "$user2" },
        { $project: { common_friends: { $setIntersection: ["$user1.friends", "$user2.friends"] } } }
    ])
    return res.json(result)
}

export const friends_delete: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (req.user!._id.equals(req.params.userId)) {
        return res.json({ message: 'Same user' })
    }
    try {
        const friend: RelationshipInterface | null = await Relationship.findOneAndRemove({
            $or: [{
                user1_id: req.user!._id,
                user2_id: req.params.userId
            },
            {
                user1_id: req.params.userId,
                user2_id: req.user!._id
            }]
        })
        if (friend) {
            await handleRemoveMultipleNotifications({ type: 'request', request: friend._id, user_id: req.user!._id })
            await handleRemoveMultipleNotifications({ type: 'request', request: friend._id, user_id: req.params.userId })
        }

        return res.json(friend)
    } catch (error) {
        next(error)
    }
}

export const requests_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const requests: RelationshipInterface[] = await Relationship.find({
            $or: [{ user1_id: req.user!._id }, { user2_id: req.user!._id }],
            sender_id: { $ne: req.user!._id },
            request_state: 'Pending'
        }).populate('user1_id', '-password').populate('user2_id', '-password')
        return res.json(requests)
    } catch (error) {
        next(error)
    }
}

export const requests_accept: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const relationship: RelationshipInterface | null = await Relationship.findOne({
            $or: [{
                user1_id: req.user!._id,
                user2_id: req.params.userId
            },
            {
                user1_id: req.params.userId,
                user2_id: req.user!._id
            }],
            sender_id: req.params.userId,
        }).populate('user1_id').populate('user2_id')

        if (!relationship) {
            return res.status(404).send('Request not found')
        }

        relationship.request_state = 'Accepted'
        const result: RelationshipInterface = await relationship.save()

        //Handle Notification
        await handleNewNotification(req.params.userId, req.user!._id, {
            type: 'request',
            request: result._id
        })

        //Upserting chat between users
        const queriedchat: ChatInterface | null = await Chat.findOne({
            participants: { $all: [req.user!._id, req.params.userId] },
            isGroup: false
        })
        if (!queriedchat) {
            const chat: ChatInterface = new Chat({
                participants: [req.user!._id, req.params.userId],
                isGroup: false
            })
            const firstMessage: MessageInterface = new Message({
                chat_id: chat._id,
                user_id: req.user!._id,
                isFirst: true,
            })

            await chat.save()
            await firstMessage.save()
        }
        return res.json(result)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


export const requests_post: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const queriedRequest: RelationshipInterface | null = await Relationship.findOne({
            $or: [{
                user1_id: req.user!._id,
                user2_id: req.params.userId
            },
            {
                user1_id: req.params.userId,
                user2_id: req.user!._id
            }],
        })
        if (queriedRequest) {
            return res.json(queriedRequest)
        } else if (req.user!._id.equals(req.params.userId)) {
            return res.json({ message: 'Same user' })
        }

        const request: RelationshipInterface = new Relationship({
            user1_id: req.user!._id,
            user2_id: req.params.userId,
            sender_id: req.user!._id,
        })
        const result: RelationshipInterface = await request.save()

        //Handle Notification
        await handleNewNotification(req.params.userId, req.user!._id, {
            type: 'request',
            request: result._id
        })

        return res.json(result)
    } catch (error) {
        next(error)
    }
}