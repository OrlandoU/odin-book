const User = require('../models/user')
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

exports.friends_delete = async (req, res, next) => {
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