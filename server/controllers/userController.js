const { body, validationResult } = require('express-validator')
const User = require('../models/user')
const Post = require('../models/post')
const Job = require('../models/Job')
const Academic = require('../models/academic')
const mongoose = require('mongoose')

exports.current_get = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('groups').populate('jobs').populate('academics')
        return res.json(user)
    } catch (error) {
        next(error)
    }
}

exports.query_user = async (req, res, next) => {
    try {
        const { query } = req.query
        console.log(query)
        const users = await User.aggregate([
            {
                $search: {
                    index: "users",
                    autocomplete: {
                        query: query,
                        path: "first_name",
                        fuzzy: {
                            maxEdits: 1
                        }
                    }
                }
            },
            {
                $unionWith: {
                    coll: "users",
                    pipeline: [
                        {
                            $search: {
                                index: "users",
                                autocomplete: {
                                    query: query,
                                    path: "last_name",
                                    fuzzy: {
                                        maxEdits: 1
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$_id",
                    documents: {
                        $addToSet: "$$ROOT"
                    }
                }
            },
            {
                $unwind: "$documents"
            },
            {
                $replaceRoot: {
                    newRoot: "$documents"
                }
            }
        ])

        return res.json(users)
    } catch (error) {
        next(error)
    }
}


exports.current_put = [
    body('birth_place')
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    body('current_place')
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    body('bio')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
    , async (req, res, next) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.sendStatus(403)
        }

        try {
            const result = await User.findByIdAndUpdate(req.user._id, {
                birth_place: req.body.birth_place,
                current_place: req.body.current_place,
                bio: req.body.bio
            })
            return res.json(result)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }]

exports.current_profile_put = [
    body('content')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ max: 300 })
        .withMessage('Content must be less than or equal to 300 chars')
    , async (req, res, next) => {
        const path = `${req.protocol}://${req.hostname}:${req.socket.localPort}/images/user-images/${req.file.originalname}`
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        }

        try {
            await User.findByIdAndUpdate(req.user._id, { profile: path })
            const post = new Post({
                content: req.body.content,
                media: path,
                user_id: req.user._id,
                type: 'profile',
            })
            await post.save()
            return res.json(post)
        } catch (error) {
            next(error)
        }
    }
]

exports.current_cover_put = [
    body('cover')
        .isObject()
        .withMessage('Invalid cover file')
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        }

        try {
            console.log(req.file)
        } catch (error) {
            next(error)
        }
    }
]

exports.current_job_post = [
    body('company')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid company length')
    , body('position')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid position length')
    , body('location')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid location length')
    , body('isCurrent')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('isCurrent invalid type must be boolean value')
    , async (req, res, next) => {
        console.log(req.body)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(403).send(errors[0])
        }

        try {
            const job = new Job({
                position: req.body.position,
                location: req.body.location,
                company: req.body.company,
                is_current: req.body.isCurrent
            })

            const result = await job.save()
            await User.findByIdAndUpdate(req.user._id, { $push: { jobs: result._id } })
            return res.json(result)
        } catch (error) {
            next(error)
        }

    }]

exports.current_job_put = [
    body('company')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid company length')
    , body('position')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid position length')
    , body('location')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid location length')
    , body('isCurrent')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('isCurrent invalid type must be boolean value')
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(403).send(errors.array())
        }

        try {
            const job = new Job({
                _id: req.params.jobId,
                position: req.body.position,
                location: req.body.location,
                company: req.body.company,
                is_current: req.body.isCurrent
            })

            const result = await Job.findByIdAndUpdate(req.params.jobId, job, { new: true })
            return res.json(result)
        } catch (error) {
            next(error)
        }

    }]

exports.current_job_delete = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndRemove(req.params.jobId)
        await User.findByIdAndUpdate(req.user._id, { $pull: { jobs: req.params.jobId } })
        return res.json(job)
    } catch (error) {
        next
    }
}

exports.current_academic_post = [
    body('school')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid school chars length')
    , body('isCurrent')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('isCurrent must be a boolean value')
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(403).send(errors.array())
        }

        try {
            const academic = new Academic({
                school: req.body.school,
                is_current: req.body.isCurrent
            })

            const result = await academic.save()
            await User.findByIdAndUpdate(req.user._id, { $push: { academics: result._id } })
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }]

exports.current_academic_put = [
    body('school')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid school chars length')
    , body('isCurrent')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('isCurrent must be a boolean value')
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(403).send(errors.array())
        }

        try {
            const academic = new Academic({
                _id: req.params.academicId,
                school: req.body.school,
                is_current: req.body.isCurrent
            })

            const result = await Academic.findByIdAndUpdate(req.params.academicId, academic, { new: true })
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }]

exports.current_academic_delete = async (req, res, next) => {
    try {
        const academic = await Academic.findByIdAndRemove(req.params.academicId)
        await User.findByIdAndUpdate(req.user._id, { $pull: { academics: req.params.academicId } })
        return res.json(academic)
    } catch (error) {
        next(error)
    }
}

exports.user_get = async (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
            const user = await User.findById(req.params.userId, { password: 0 }).populate('groups').populate('jobs').populate('academics')
            return res.json(user)
        }
        return res.json(null)
    } catch (error) {
        next(error)
    }
}


