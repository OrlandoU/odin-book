const { body, validationResult } = require('express-validator')
const Group = require('../models/group')
const User = require('../models/user')
const Post = require('../models/post')

exports.group_get = async (req, res, next) => {
    try {
        const { sort, limit, ...filter } = req.query
        const groups = await Group.find(filter).sort({ last_active: -1 }).limit(limit || 0)
        return res.json(groups)
    } catch (error) {
        next(error)
    }
}

exports.group_last_active_get = async (req, res, next) => {
    try {
        const posts = await Post.find({ isInTrash: false, group: req.params.groupId }).sort({ _id: -1 }).limit(1)
        return res.json(posts[0].create_date)
    } catch (error) {
        next(error)
    }
}

exports.query_group = async (req, res, next) => {
    try {
        const { query } = req.query
        const groups = await Group.aggregate([
            {
                $search: {
                    index: "groups",
                    autocomplete: {
                        query: query,
                        path: "name",
                        fuzzy: {
                            maxEdits: 1
                        }
                    }
                }
            }, {
                $sort: {
                    last_active: -1
                }
            }
        ])

        return res.json(groups)
    } catch (error) {
        next(error)
    }
}

exports.group_member_count_get = async (req, res, next) => {
    try {
        const count = await User.countDocuments({ groups: req.params.groupId })
        return res.json({ count })
    } catch (error) {
        next(error)
    }
}

exports.group_members_get = async (req, res, next) => {
    try {
        const count = await User.find({ groups: req.params.groupId })
        return res.json(count)
    } catch (error) {
        next(error)
    }
}

exports.group_details_get = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.groupId).populate('creator', '-password')
        return res.json(group)
    } catch (error) {
        next(error)
    }
}

exports.group_post = [
    body('name')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Missing group name'),
    body('privacy')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Missing privacy mode'),
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array)
        }
        try {
            const group = new Group({
                creator: req.user._id,
                name: req.body.name,
                privacy: req.body.privacy
            })

            const result = await group.save()
            const post = new Post({
                group: result._id,
                user_id: req.user._id,
                type: 'group-create',
                scope: req.body.privacy == 'public' ? 'public' : 'group'
            })
            await post.save()
            await User.findByIdAndUpdate(req.user._id, { $push: { groups: result._id } })
            return res.json(result)
        } catch (error) {
            return next(error)
        }

    }
]

exports.group_put = [
    body('name')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Missing group name'),
    body('cover')
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    async (req, res, next) => {
        const group = await Group.findById(req.params.groupId)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array)
        } else if (!req.user._id.equals(group.creator)) {
            return res.sendStatus(403)
        }

        try {
            const path = `${req.protocol}://${req.hostname}:${req.socket.localPort}/images/group-covers/${req.file.originalname}`

            const updatedGroup = await Group.findByIdAndUpdate(req.params.groupId, {
                cover: req.file ? path : null,
                name: req.body.name,
            }, { new: true })

            const post = new Post({
                group: updatedGroup._id,
                content: req.body.content,
                media: path,
                user_id: req.user._id,
                type: 'group-cover',
                scope: updatedGroup.privacy == 'public' ? 'public' : 'group'
            })
            await post.save()

            return res.json(updatedGroup)
        } catch (error) {
            return next(error)
        }

    }
]

exports.group_delete = async (req, res, next) => {
    try {
        //Delete posts under group
        await Group.deleteMany({ group: req.params.groupId })
        const group = await Group.findByIdAndRemove(req.params.groupId)
    } catch (error) {
        next(error)
    }
}

exports.group_join = async (req, res, next) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, banned: { $nin: [req.user._id] } })
        if (!group) {
            return res.status(404).send('Group not found')
        } else if (req.user.groups.includes(req.param.groupId)) {
            return res.sendStatus(400)
        }

        await User.findByIdAndUpdate(req.user._id, { $push: { groups: req.params.groupId } })
        return res.json(group)
    } catch (error) {
        next(error)
    }
}

exports.group_leave = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.groupId)
        if (!group) {
            return res.status(404).send('Group not found')
        }

        await User.findByIdAndUpdate(req.user._id, { $pull: { groups: req.params.groupId } })
        return res.json(group)
    } catch (error) {
        next(error)
    }
}

exports.group_ban = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.groupId)
        if (!req.user._id.equals(group.creator)) {
            return res.sendStatus(403)
        } else if (!group) {
            return res.status(404).send('Group not found')
        }
        await User.findByIdAndUpdate(req.params.userId, { $pop: { groups: req.params.groupId } })
        await Group.findByIdAndUpdate(req.params.groupId, { $push: { banned: req.params.userId } })
        return res.json(group)
    } catch (error) {
        next(error)
    }
}