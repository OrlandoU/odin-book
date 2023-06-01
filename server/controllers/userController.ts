//@ts-check
import { Result, ValidationError, body, validationResult } from 'express-validator'
import User, { UserInterface } from '../models/user'
import Post, { PostInterface } from '../models/post'
import Job, { JobInterface } from '../models/job'
import Academic, { AcademicInterface } from '../models/academic'
import mongoose from 'mongoose'
import { Middleware, NextFunction, Request, Response } from 'express'

export const current_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const user: UserInterface | null = await User.findById(req.user!._id).populate('groups').populate('jobs').populate('academics')
        return res.json(user)
    } catch (error) {
        next(error)
    }
}

export const query_user: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const { query } = req.query
        const users: UserInterface[] = await User.aggregate([
            {
                $search: {
                    index: "user",
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
                                index: "user",
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
                $match: {
                    _id: { $ne: req.user!._id }
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


export const current_put = [
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
    , async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            res.sendStatus(403)
        }

        try {
            const result: UserInterface | null = await User.findByIdAndUpdate(req.user!._id, {
                birth_place: req.body.birth_place,
                current_place: req.body.current_place,
                bio: req.body.bio
            })
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }]

export const current_profile_put = [
    body('content')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ max: 300 })
        .withMessage('Content must be less than or equal to 300 chars')
    , async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        const path: string | undefined = req.file && `${req.protocol}://${req.hostname}/images/uploads/user-images/${req.file.filename}`
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        } else if (!path) {
            return res.sendStatus(400)
        }

        try {
            await User.findByIdAndUpdate(req.user!._id, { profile: path })
            const post: PostInterface = new Post({
                content: req.body.content,
                media: path,
                user_id: req.user!._id,
                type: 'profile',
            })
            await post.save()
            return res.json(post)
        } catch (error) {
            next(error)
        }
    }
]

export const current_cover_put = [
    body('content')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ max: 300 })
        .withMessage('Content must be less than or equal to 300 chars')
    , async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        const path: string | undefined = req.file && `${req.protocol}://${req.hostname}/images/uploads/user-images/${req.file.filename}`
        const errors: Result<ValidationError> = validationResult(req)

        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        } else if (!path) {
            return res.sendStatus(400)
        }

        try {
            await User.findByIdAndUpdate(req.user!._id, { cover: path })
            const post: PostInterface = new Post({
                content: req.body.content,
                media: path,
                user_id: req.user!._id,
                type: 'cover',
            })
            await post.save()
            return res.json(post)
        } catch (error) {
            next(error)
        }
    }
]

export const current_job_post = [
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
    , async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(403).send(errors.array()[0])
        }

        try {
            const job: JobInterface = new Job({
                position: req.body.position,
                location: req.body.location,
                company: req.body.company,
                is_current: req.body.isCurrent
            })

            const result: JobInterface = await job.save()
            await User.findByIdAndUpdate(req.user!._id, { $push: { jobs: result._id } })
            return res.json(result)
        } catch (error) {
            next(error)
        }

    }]

export const current_job_put = [
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
    , async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(403).send(errors.array())
        }

        try {
            const job: JobInterface = new Job({
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

export const current_job_delete: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const job: JobInterface | null = await Job.findByIdAndRemove(req.params.jobId)
        await User.findByIdAndUpdate(req.user!._id, { $pull: { jobs: req.params.jobId } })
        return res.json(job)
    } catch (error) {
        next
    }
}

export const current_academic_post = [
    body('school')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid school chars length')
    , body('isCurrent')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('isCurrent must be a boolean value')
    , async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(403).send(errors.array())
        }

        try {
            const academic: AcademicInterface = new Academic({
                school: req.body.school,
                is_current: req.body.isCurrent
            })

            const result: AcademicInterface = await academic.save()
            await User.findByIdAndUpdate(req.user!._id, { $push: { academics: result._id } })
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }]

export const current_academic_put = [
    body('school')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid school chars length')
    , body('isCurrent')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('isCurrent must be a boolean value')
    , async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(403).send(errors.array())
        }

        try {
            const academic: AcademicInterface = new Academic({
                _id: req.params.academicId,
                school: req.body.school,
                is_current: req.body.isCurrent
            })
            const result: AcademicInterface | null = await Academic.findByIdAndUpdate(req.params.academicId, academic, { new: true })
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }]

export const current_academic_delete: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        const academic: AcademicInterface | null = await Academic.findByIdAndRemove(req.params.academicId)
        await User.findByIdAndUpdate(req.user!._id, { $pull: { academics: req.params.academicId } })
        return res.json(academic)
    } catch (error) {
        next(error)
    }
}

export const user_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
            const user: UserInterface | null = await User.findById(req.params.userId, { password: 0 }).populate('groups').populate('jobs').populate('academics')
            return res.json(user)
        }
        return res.json(null)
    } catch (error) {
        next(error)
    }
}


