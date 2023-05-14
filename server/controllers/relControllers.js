const User = require('../models/user')
const Chat = require('../models/chat')
const Relationship = require('../models/relationship')

exports.friends_get = async (req, res, next) => {
    try {
        const friends = await Relationship.find({
            $or: [{ user1_id: req.user._id }, { user2_id: req.user._id }],
            request_state: 'Accepted'
        }).populate('user1_id').populate('user2_id')

        return res.json(friends)
    } catch (error) {
        next(error)
    }
}

exports.friends_suggestions_get = async (req, res, next) => {
    let friends = await Relationship.find({
        $or: [{ user1_id: req.user._id }, { user2_id: req.user._id }],
        request_state: 'Accepted'
    })
    console.log(friends)
    friends = friends.map(rel => {
        if (req.user._id.equals(rel.user2_id)) {
            return rel.user1_id
        }
        return res.user2_id
    })
    const users = await User.find({ _id: { $nin: [...friends, req.user._id] } })
    return res.json(users)
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
        })
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
        })

        if (!relationship) {
            return res.status(404).send('Request not found')
        }

        relationship.request_state = 'Accepted'
        await relationship.save()

        const queriedchat = await Chat.findOne({
            participants: { $all: [req.user._id, req.params.userId] },
            isGroup: false
        })
        if (!queriedchat) {
            const chat = new Chat({
                participants: [req.user._id, req.params.userId],
                isGroup: false
            })

            await chat.save()
        }

        return res.json(relationship)
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
            sender_id: req.user._id,
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
        return res.json(result)
    } catch (error) {
        next(error)
    }
}