const { body, validationResult } = require('express-validator')
const Group = require('../models/group')
const User = require('../models/user')

exports.group_get = async (req, res, next) => {
    try {
        const { sort, ...filter } = req.query
        const groups = await Group.find(filter).sort(sort)
        return res.json(groups)
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
    body('profile')
        .trim()
        .escape(),
    body('cover')
        .trim()
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array)
        }
        try {
            const group = new Group({
                creator: req.user._id,
                name: req.body.name,
            })

            const result = await group.save()
            await User.findByIdAndUpdate(req.user._id, { $push: { groups: result._id } })
            return res.json(result)
        } catch (error) {
            return next(error)
        }

    }
]

exports.group_put = [
    body('name')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Missing group name'),
    body('profile')
        .trim()
        .escape(),
    body('cover')
        .trim()
        .escape(),
    async (req, res, next) => {
        const group = await Group.findById(req.params.groupId)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array)
        } else if(!req.user._id.equals(group.creator)){
            return res.sendStatus(403)
        }

        try {
            const updatedGroup = await Group.findByIdAndUpdate(req.params.groupId, {
                creator: req.user._id,
                name: req.body.name,
            }, {new: true})
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
        } else if(req.user.groups.includes(req.param.groupId)){
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

        await User.findByIdAndUpdate(req.user._id, { $pop: { groups: req.params.groupId } })
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