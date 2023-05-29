import Chat, { ChatInterface } from '../models/chat'
import Message, { MessageInterface } from '../models/message'
import { Result, ValidationError, body, validationResult } from 'express-validator'
import { emitMessage, emitMessageUpdate } from '../functions/socket'
import { Middleware, NextFunction, Response } from 'express'
import { Types, UpdateWriteOpResult } from 'mongoose'
import { Request } from 'express-serve-static-core';


export const chats_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const chats: ChatInterface[] = await Chat.find({ participants: req.user!._id }).populate('participants', '-password').sort({ lastActive: -1 })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}
export const chats_user_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const chat: ChatInterface | null = await Chat.findOne({
            participants: { $all: [req.user!._id, req.params.userId] },
            isGroup: false
        }).populate('participants', '-password')
        return res.json(chat)
    } catch (error) {
        next(error)
    }
}

export const chats_unread_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const myChats: Types.ObjectId[] = (await Chat.find({ participants: req.user!._id })).map(chat => chat._id)
        const unreadChats: MessageInterface[] = await Message.aggregate([
            {
                $match: { isRead: false, chat_id: { $in: myChats }, user_id: { $ne: req.user!._id } }
            },
            {
                $group: {
                    _id: "$chat_id",
                }
            }
        ]).exec()
        return res.json(unreadChats)
    } catch (error) {
        next(error)
    }
}

export const chats_unviewed_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const myChats: Types.ObjectId[] = (await Chat.find({ participants: req.user!._id })).map(chat => chat._id)
        const unreadChats: MessageInterface[] = await Message.aggregate([
            {
                $match: { isViewed: false, chat_id: { $in: myChats }, user_id: { $ne: req.user!._id } }
            },
            {
                $group: {
                    _id: "$chat_id",
                }
            }
        ]).exec()
        return res.json(unreadChats)
    } catch (error) {
        next(error)
    }
}

export const chats_message_toViewed_put: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const chats: UpdateWriteOpResult = await Message.updateMany({ isViewed: false, chat_id: req.params.chatId, user_id: { $ne: req.user!._id } }, { isViewed: true })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}

export const chats_message_toRead_put: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const chats: UpdateWriteOpResult = await Message.updateMany({ isRead: false, chat_id: req.params.chatId, user_id: { $ne: req.user!._id } }, { isRead: true })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}

export const chats_message_removed_put: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const chats: UpdateWriteOpResult = await Message.updateMany({ chat_id: req.params.chatId, isFirst: false }, { $addToSet: { removed: req.user!._id } })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}

export const chats_last_message_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        //Fetch last message that is not removed by this user
        const message: MessageInterface | null = await Message.findOne({ chat_id: req.params.chatId, removed: { $nin: [req.user!._id] }, isUnsent: false }).sort({ create_date: -1 })
        return res.json(message)
    } catch (error) {
        next(error)
    }
}

export const chats_details_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const chats: ChatInterface | null = await Chat.findById(req.params.chatId).populate('participants', '-password')
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}

export const chats_post: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        let participants: string | Types.ObjectId[] = typeof req.body.participants == 'string' ? [req.body.participants] : req.body.participants

        if (typeof req.body.participants == 'string') {
            const chat: ChatInterface | null = await Chat.findOne({
                participants: { $all: [req.user!._id, participants] },
                isGroup: false
            }).populate('participants', '-password')
            if (chat) {
                return res.json(chat)
            }
        }
        const chat: ChatInterface = new Chat({
            participants: [...participants, req.user!._id],
            isGroup: typeof req.body.participants == 'string' ? false : true
        })

        const firstMessage: MessageInterface = new Message({
            chat_id: chat._id,
            user_id: req.user!._id,
            isFirst: true,
        })

        await firstMessage.save()
        const result: ChatInterface = await chat.save()
        const fetchedChat: ChatInterface | null = await Chat.findById(result._id).populate('participants', '-password')
        return res.json(fetchedChat)
    } catch (error) {
        next(error)
    }
}

export const messages_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const chat: ChatInterface | null = await Chat.findById(req.params.chatId)
        if (!chat) {
            return res.status(404).send('Chat not found')
        }

        const messages: MessageInterface[] = await Message.find({ chat_id: req.params.chatId, removed: { $nin: [req.user!._id] } }).sort({ create_date: -1 }).populate('user_id')
        return res.json(messages)
    } catch (error) {
        next(error)
    }
}

export const messages_post: Middleware[] = [
    body('content')
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    body('media')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isURL()
        .withMessage('Invalid media url')
    , async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array())
        }

        try {
            const chat: ChatInterface | null = await Chat.findById(req.params.chatId)
            if (!chat) {
                return res.status(404).send('Chat not found')
            }

            const message: MessageInterface = new Message({
                chat_id: chat._id,
                user_id: req.user!._id,
                content: req.body.content,
                media: req.body.media
            })

            const result: MessageInterface = await message.save()
            await Chat.findByIdAndUpdate(chat._id, { lastActive: new Date() })
            const chatUser: Types.ObjectId = req.user!._id.equals(chat.participants[0]) ? chat.participants[1] : chat.participants[0]
            const newMessage: MessageInterface | null = await Message.findById(result._id).populate('user_id')

            emitMessage(chatUser, newMessage)
            emitMessage(req.user!._id, newMessage)
            return res.json(newMessage)
        } catch (error) {
            next(error)
        }
    }
]

export const messages_put: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { isUnsent, removeForMe } = req.body
    try {
        const message: MessageInterface | null = await Message.findById(req.params.messageId)
        if (!message) {
            return res.status(404).send("Message not found")
        }
        const chat: ChatInterface | null = await Chat.findById(req.params.chatId)
        if (!chat) {
            return res.status(404).send('Chat does not exist')
        }
        const chatUser: Types.ObjectId = chat.participants[0].equals(req.user!._id) ? chat.participants[1] : chat.participants[0]
        
        if (message.user_id.equals(req.user!._id) && isUnsent !== undefined) {
            const updatedMessage: MessageInterface | null = await Message.findByIdAndUpdate(req.params.messageId, { isUnsent }, { new: true }).populate('user_id')
            emitMessageUpdate(chatUser, updatedMessage!)
            return res.json(updatedMessage)
        }
        if (removeForMe) {
            const updatedMessage: MessageInterface | null = await Message.findByIdAndUpdate(req.params.messageId, { $push: { removed: req.user!._id } }, { new: true }).populate('user_id')
            emitMessageUpdate(req.user!._id, updatedMessage!)
            return res.json(updatedMessage)
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}
