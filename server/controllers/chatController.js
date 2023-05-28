const Chat = require('../models/chat')
const Message = require('../models/message')
const { body, validationResult } = require('express-validator')
const { emitMessage, emitMessageUpdate } = require('../functions/socket')

exports.chats_get = async (req, res, next) => {
    try {
        const chats = await Chat.find({ participants: req.user._id }).populate('participants', '-password').sort({ lastActive: -1 })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}
exports.chats_user_get = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({
            participants: { $all: [req.user._id, req.params.userId] },
            isGroup: false
        }).populate('participants', '-password')
        return res.json(chat)
    } catch (error) {
        next(error)
    }
}

exports.chats_unread_get = async (req, res, next) => {
    try {
        const myChats = (await Chat.find({ participants: req.user._id })).map(chat => chat._id)
        const unreadChats = await Message.aggregate([
            {
                $match: { isRead: false, chat_id: { $in: myChats }, user_id: { $ne: req.user._id } }
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
exports.chats_unviewed_get = async (req, res, next) => {
    try {
        const myChats = (await Chat.find({ participants: req.user._id })).map(chat => chat._id)
        const unreadChats = await Message.aggregate([
            {
                $match: { isViewed: false, chat_id: { $in: myChats }, user_id: { $ne: req.user._id } }
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

exports.chats_message_toViewed_put = async (req, res, next) => {
    try {
        const chats = await Message.updateMany({ isViewed: false, chat_id: req.params.chatId, user_id: { $ne: req.user._id } }, { isViewed: true })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}

exports.chats_message_toRead_put = async (req, res, next) => {
    try {
        const chats = await Message.updateMany({ isRead: false, chat_id: req.params.chatId, user_id: { $ne: req.user._id } }, { isRead: true })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}

exports.chats_message_removed_put = async (req, res, next) => {
    try {
        const chats = await Message.updateMany({ chat_id: req.params.chatId, isFirst: false }, { $addToSet: { removed: req.user._id } })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}

exports.chats_last_message_get = async (req, res, next) => {
    try {
        //Fetch last message that is not removed by this user
        const message = await Message.findOne({ chat_id: req.params.chatId, removed: { $nin: [req.user._id] }, isUnsent: false }).sort({ create_date: -1 })
        return res.json(message)
    } catch (error) {
        next(error)
    }
}

exports.chats_details_get = async (req, res, next) => {
    try {
        const chats = await Chat.findById(req.params.chatId).populate('participants', '-password')
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}

exports.chats_post = async (req, res, next) => {
    try {
        let participants = typeof req.body.participants == 'string' ? [req.body.participants] : req.body.participants

        if (typeof req.body.participants == 'string') {
            const chat = await Chat.findOne({
                participants: { $all: [req.user._id, participants] },
                isGroup: false
            }).populate('participants', '-password')
            if (chat) {
                return res.json(chat)
            }
        }
        const chat = new Chat({
            participants: [...participants, req.user._id],
            isGroup: typeof req.body.participants == 'string' ? false : true
        })

        const firstMessage = new Message({
            chat_id: chat._id,
            user_id: req.user._id,
            isFirst: true,
        })

        const messageResult = await firstMessage.save()
        const result = await chat.save()
        const fetchedChat = await Chat.findById(result._id).populate('participants', '-password')
        return res.json(fetchedChat)
    } catch (error) {
        next(error)
    }
}

exports.messages_get = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
        if (!chat) {
            return res.status(404).send('Chat not found')
        }

        const messages = await Message.find({ chat_id: req.params.chatId, removed: { $nin: [req.user._id] } }).sort({ create_date: -1 }).populate('user_id')
        return res.json(messages)
    } catch (error) {
        next(error)
    }
}

exports.messages_post = [
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
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send(errors.array())
        }

        try {
            const chat = await Chat.findById(req.params.chatId)
            if (!chat) {
                return res.status(404).send('Chat not found')
            }

            const message = new Message({
                chat_id: chat._id,
                user_id: req.user._id,
                content: req.body.content,
                media: req.body.media
            })

            const result = await message.save()
            await Chat.findByIdAndUpdate(chat._id, { lastActive: new Date() })
            const chatUser = req.user._id.equals(chat.participants[0]) ? chat.participants[1] : chat.participants[0]
            const newMessage = await Message.findById(result._id).populate('user_id')

            emitMessage(chatUser, newMessage)
            emitMessage(req.user._id, newMessage)
            return res.json(newMessage)
        } catch (error) {
            next(error)
        }
    }
]

exports.messages_put = async (req, res, next) => {
    const { isUnsent, removeForMe } = req.body
    try {
        const message = await Message.findById(req.params.messageId)
        let chatUser = await Chat.findById(message.chat_id)
        chatUser = chatUser.participants[0].equals(req.user._id) ? chatUser.participants[1] : chatUser.participants[0]
        if (message.user_id.equals(req.user._id) && isUnsent !== undefined) {
            const updatedMessage = await Message.findByIdAndUpdate(req.params.messageId, { isUnsent }, { new: true }).populate('user_id')
            emitMessageUpdate(chatUser, updatedMessage)
            return res.json(updatedMessage)
        }
        if (removeForMe) {
            const updatedMessage = await Message.findByIdAndUpdate(req.params.messageId, { $push: { removed: req.user._id } }, { new: true }).populate('user_id')
            emitMessageUpdate(req.user._id, updatedMessage)
            return res.json(updatedMessage)
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}
