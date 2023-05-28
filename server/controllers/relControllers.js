const User = require('../models/user')
const Chat = require('../models/chat')
const Relationship = require('../models/relationship')
const Message = require('../models/message')
const { handleNewNotification, handleRemoveMultipleNotifications } = require('../functions/notificationHandler')

exports.friends_get = async (req, res, next) => {
    const { limit } = req.query
    try {
        const friends = await Relationship.find({
            $or: [{ user1_id: req.params.userId }, { user2_id: req.params.userId }],
            request_state: 'Accepted'
        }).populate('user1_id').populate('user2_id').limit(limit)

        return res.json(friends)
    } catch (error) {
        next(error)
    }
}

exports.relationship_get = async (req, res, next) => {
    try {
        const friend = await Relationship.findOne({
            $or: [{ user1_id: req.params.userId, user2_id: req.user._id },
            { user1_id: req.user._id, user2_id: req.params.userId }],
        }).populate('user1_id').populate('user2_id')

        return res.json(friend)
    } catch (error) {
        next(error)
    }
}

exports.friends_suggestions_get = async (req, res, next) => {
    try {
        let friends = await Relationship.find({
            $or: [{ user1_id: req.user._id }, { user2_id: req.user._id }],
            $or: [{ request_state: 'Accepted' }, { request_state: 'Pending', sender_id: { $ne: req.user._id } }]
        })
        friends = friends.map(rel => {
            if (req.user._id.equals(rel.user2_id)) {
                return rel.user1_id
            }
            return res.user2_id
        })
        const users = await User.find({ _id: { $nin: [...friends, req.user._id] } })
        return res.json(users)
    } catch (error) {
        next(error)
    }

}

exports.friends_in_common_get = async (req, res, next) => {

    const result = await Relationship.aggregate([
        { $match: { user1_id: { $in: [req.user._id, req.params.userId] }, user2_id: { $in: [req.user._id, req.params.userId] } } },
        { $lookup: { from: "users", localField: "user1_id", foreignField: "_id", as: "user1" } },
        { $lookup: { from: "users", localField: "user2_id", foreignField: "_id", as: "user2" } },
        { $unwind: "$user1" },
        { $unwind: "$user2" },
        { $project: { common_friends: { $setIntersection: ["$user1.friends", "$user2.friends"] } } }
    ])
    return res.json(result)
}

exports.friends_delete = async (req, res, next) => {
    if (req.user._id.equals(req.params.userId)) {
        return res.json({ message: 'Same user' })
    }
    try {
        const friend = await Relationship.findOneAndRemove({
            $or: [{
                user1_id: req.user._id,
                user2_id: req.params.userId
            },
            {
                user1_id: req.params.userId,
                user2_id: req.user._id
            }]
        })

        await handleRemoveMultipleNotifications({ type: 'request', request: friend._id, user_id: req.user._id })
        await handleRemoveMultipleNotifications({ type: 'request', request: friend._id, user_id: req.params.userId })

        return res.json(friend)
    } catch (error) {
        next(error)
    }
}

exports.requests_get = async (req, res, next) => {
    try {
        const requests = await Relationship.find({
            $or: [{ user1_id: req.user._id }, { user2_id: req.user._id }],
            sender_id: { $ne: req.user._id },
            request_state: 'Pending'
        }).populate('user1_id', '-password').populate('user2_id', '-password')
        return res.json(requests)
    } catch (error) {
        next(error)
    }
}

exports.requests_accept = async (req, res, next) => {
    try {
        const relationship = await Relationship.findOne({
            $or: [{
                user1_id: req.user._id,
                user2_id: req.params.userId
            },
            {
                user1_id: req.params.userId,
                user2_id: req.user._id
            }],
            sender_id: req.params.userId,
        }).populate('user1_id').populate('user2_id')

        if (!relationship) {
            return res.status(404).send('Request not found')
        }

        relationship.request_state = 'Accepted'
        const result = await relationship.save()

        //Handle Notification
        await handleNewNotification(req.params.userId, req.user._id, {
            type: 'request',
            request: result._id
        })

        //Upserting chat between users
        const queriedchat = await Chat.findOne({
            participants: { $all: [req.user._id, req.params.userId] },
            isGroup: false
        })
        if (!queriedchat) {
            const chat = new Chat({
                participants: [req.user._id, req.params.userId],
                isGroup: false
            })
            const firstMessage = new Message({
                chat_id: chat._id,
                user_id: req.user._id,
                isFirst: true,
            })

            const messageResult = await firstMessage.save()
            await chat.save()
        }

        return res.json(result)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.requests_post = async (req, res, next) => {
    try {
        const queriedRequest = await Relationship.findOne({
            $or: [{
                user1_id: req.user._id,
                user2_id: req.params.userId
            },
            {
                user1_id: req.params.userId,
                user2_id: req.user._id
            }],
        })
        if (queriedRequest) {
            return res.json(queriedRequest)
        } else if (req.user._id.equals(req.params.userId)) {
            return res.json({ message: 'Same user' })
        }

        const request = new Relationship({
            user1_id: req.user._id,
            user2_id: req.params.userId,
            sender_id: req.user._id,
        })
        const result = await request.save()

        //Handle Notification
        await handleNewNotification(req.params.userId, req.user._id, {
            type: 'request',
            request: result._id
        })

        return res.json(result)
    } catch (error) {
        next(error)
    }
}