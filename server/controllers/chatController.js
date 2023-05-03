const Chat = require('../models/chat')
const Message = require('../models/message')
const { body, validationResult } = require('express-validator')

exports.chats_get = async (req, res, next) => {
    try {
        const chats = await Chat.find({ participants: req.user._id })
        return res.json(chats)
    } catch (error) {
        next(error)
    }
}

exports.chats_last_message_get = async (req, res, next) => {
    try {
        const message = await Message.findOne({ chat_id: req.params.chatId }).sort({ create_date: -1 })
        return res.json(message)
    } catch (error) {
        next(error)
    }
}

exports.chats_post = async (req, res, next) => {
    try {
        let participants = typeof req.body.participants == 'string' ? [req.body.participants] : req.body.participants

        if (typeof req.body.participants == 'string') {
            const chat = await Chat.findOne({
                participants: { $all: [req.user._id, ...participants] },
                isGroup: false
            })
            if (chat) {
                return res.json(chat)
            }
        }
        const chat = new Chat({
            participants: [...participants, req.user._id],
            isGroup: typeof req.body.participants == 'string' ? false : true
        })


        const result = await chat.save()
        return res.json(result)
    } catch (error) {
        next(error)
    }
}

exports.messages_get = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
        if(!chat){
            return res.status(404).send('Chat not found')
        }

        const messages = await Message.find({chat_id: req.params.chatId}).sort({create_date: -1})
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
    ,async (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
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
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
]

exports.messages_delete = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.messageId)
        if(!message.user_id.equals(req.user._id)){
            return res.sendStatus(403)
        }
        const deletedMessage = await Message.findByIdAndRemove(req.params.messageId)
        return res.json(deletedMessage)
    } catch (error) {
        console.log(error)
        next(error)
    }
}