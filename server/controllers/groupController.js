const { body, validationResult } = require('express-validator')
const Group = require('../models/group')

exports.group_post = [
    body('creator')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Missing creator id'),
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
            return res.json(result)
        } catch (error) {
            return next(error)
        }

    }
]

exports.group_delete = async (req, res, next) => {
    
}