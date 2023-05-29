import Post, { PostInterface } from '../models/post'
import Comment, { CommentInterface } from '../models/comment'
import Reaction, { ReactionInterface } from '../models/reaction'
import Relationship, { RelationshipInterface } from '../models/relationship'
import { Result, ValidationError, body, validationResult } from 'express-validator'
import fs from 'fs/promises'
import { handleNewNotification, handleUpsertNotification, handleRemoveNotification } from '../functions/notificationHandler'
import { Middleware, NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'

export const posts_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { sort, limit, skip, ...filter } = req.query
        const parsedLimit: number = limit ? +limit : 0
        const parsedSkip: number = skip ? +skip : 0

        const posts: PostInterface[] = await Post.find(filter).populate('user_id', '-password').populate('group').sort({ create_date: -1 }).skip(parsedSkip).limit(parsedLimit)
        return res.json(posts)
    } catch (error) {
        next(error)
    }
}

export const posts_photos_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        let posts: PostInterface[]
        if (req.params.userId) {
            posts = await Post.find({ user_id: req.params.userId, scope: 'public', $or: [{ multiple_media: { $exists: true, $ne: [] } }, { media: { $exists: true } }] })
                .populate('user_id', '-password')
                .populate('group')
                .sort({ create_date: -1 })
        } else {
            posts = await Post.find({ ...req.query, $or: [{ multiple_media: { $exists: true, $ne: [] } }, { media: { $exists: true } }] })
                .populate('user_id', '-password')
                .populate('group')
                .sort({ create_date: -1 })
        }
        return res.json(posts)
    } catch (error) {
        next(error)
    }
}

export const posts_group_feed: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { limit, skip } = req.query
    const parsedLimit: number = limit ? +limit : 0
    const parsedSkip: number = skip ? +skip : 0

    try {
        const posts: PostInterface[] = await Post.find({ group: { $in: [...req.user!.groups] }, type: 'normal' })
            .populate('user_id', '-password')
            .populate('group')
            .sort({ create_date: -1 })
            .skip(parsedSkip)
            .limit(parsedLimit)

        return res.json(posts)
    } catch (error) {
        next(error)
    }
}


export const posts_feed: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { limit, skip } = req.query
        const parsedLimit: number = limit ? +limit : 0
        const parsedSkip: number = skip ? +skip : 0

        const relationships: RelationshipInterface[] = await Relationship.find({
            $or: [
                {
                    user1_id: req.user!._id
                },
                {
                    user2_id: req.user!._id
                }
            ]
        })
        const friends: Types.ObjectId[] = relationships.map((rel) => {
            if (req.user!._id.equals(rel.user1_id)) {
                return rel.user2_id
            } else {
                return rel.user1_id
            }
        })
        const posts: PostInterface[] = await Post.aggregate([
            {
                $match: {
                    isInTrash: false,
                    type: {
                        $in: [
                            'normal', 'cover', 'profile'
                        ]
                    },
                    $or: [
                        {
                            user_id: { $in: friends },
                        },
                        {
                            scope: 'public',
                        },
                        {
                            group: { $in: req.user!.groups },
                        }
                    ]
                }
            },
            { $addFields: { is_friend: { $in: ["$user_id", friends] } } },
            { $sort: { is_friend: -1, create_date: -1 } },
            { $skip: parsedSkip },
            { $limit: parsedLimit },
            {
                $lookup: {
                    from: 'users', // Replace with the actual collection name for users
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_id'
                }
            },
            {
                $lookup: {
                    from: 'groups', // Replace with the actual collection name for groups
                    localField: 'group',
                    foreignField: '_id',
                    as: 'group'
                }
            },
            {
                $addFields: {
                    user_id: { $arrayElemAt: ['$user_id', 0] },
                    group: { $arrayElemAt: ['$group', 0] }
                }
            }
        ]).exec();
        return res.json(posts)
    } catch (error) {
        next(error)
    }
}

export const posts_post: Middleware[] = [
    body('content')
        .optional({ checkFalsy: true })
        .escape()
        .isLength({ max: 300 })
        .withMessage('Content must be less than or equal to 300 chars'),
    body('media')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isURL()
        .withMessage('Invalid media url')
    , async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        console.log(req.body)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.sendStatus(400)
        }

        try {
            let multiple_media: string[] | null = null
            if (req.file && (Array.isArray(req.file))) {
                multiple_media = req.file.map((file: Express.Multer.File) => {
                    return `${req.protocol}://${req.hostname}:${req.socket.localPort}/images/post-images/${file.originalname}`
                })
            }
            let post: PostInterface
            if (req.body.group_id) {
                post = new Post({
                    content: req.body.content,
                    group: req.body.group_id ? req.body.group_id : null,
                    user_id: req.user!._id,
                    mentions: req.body.mentions,
                    multiple_media,
                    scope: req.body.scope
                })
                post.mentions.forEach(async (mention: Types.ObjectId) => {
                    await handleNewNotification(mention, req.user!._id, { type: 'post_mention', post: post._id })
                })
            } else {
                post = new Post({
                    content: req.body.content,
                    user_id: req.user!._id,
                    mentions: req.body.mentions,
                    multiple_media: multiple_media,
                    scope: req.body.scope
                })
                post.mentions.forEach(async (mention: Types.ObjectId) => {
                    await handleNewNotification(mention, req.user!._id, { type: 'post_mention', post: post._id })
                })
            }
            const result: PostInterface = await post.save()
            const populatedPost = await Post.findById(result._id).populate('user_id', '-password').populate('group')
            return res.json(populatedPost)
        } catch (error) {
            next(error)
        }
    }
]
export const post_trash_put: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const result: PostInterface | null = await Post.findByIdAndUpdate(req.params.postId, { isInTrash: req.body.isTrash }, { new: true })
        return res.json(result)
    } catch (error) {
        next(error)
    }
}

export const posts_delete: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const result: PostInterface | null = await Post.findByIdAndRemove(req.params.postId)
        if (result && result.multiple_media.length > 0) {
            for (const media of result.multiple_media) {
                const mediaString: string[] = media.split('/')
                const path: string = `./${mediaString[mediaString.length - 2]}/${mediaString[mediaString.length - 1]}`
                await fs.unlink(path)
            }
            return res.json(result)
        }
    } catch (error) {
        next(error)
    }
}

export const comments_count: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        let comments: number
        if (!req.params.parentCommentId) {
            comments = await Comment.countDocuments({
                post_id: req.params.postId
            })
        } else {
            comments = await Comment.countDocuments({
                post_id: req.params.postId,
                parent_comment: req.params.parentCommentId
            })
        }
        return res.json(comments)
    } catch (error) {
        next(error)
    }
}

export const comments_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        let comments: CommentInterface[] = await Comment.find({
            post_id: req.params.postId,
            parent_comment: req.params.parentCommentId
        }).populate('user_id')

        return res.json(comments)
    } catch (error) {
        next(error)
    }
}

export const comments_post: Middleware[] = [
    body('content')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ max: 300 })
        .withMessage('Content must be less than or equal to 300 chars'),
    body('media')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isURL()
        .withMessage('Invalid media url')
    , async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        }

        try {
            const post: PostInterface | null = await Post.findById(req.params.postId)
            if (!post) {
                return res.status(404).send('Post not found')
            }
            if (req.params.parentCommentId) {
                const parent_comment: CommentInterface | null = await Comment.findById(req.params.parentCommentId)
                if (!parent_comment) {
                    return res.status(404).send('Parent comment not found')
                }
            }

            const comment: CommentInterface = new Comment({
                user_id: req.user!._id,
                post_id: post._id,
                parent_comment: req.params.parentCommentId,
                content: req.body.content,
                mentions: req.body.mentions,
                media: req.body.media
            })

            comment.mentions.forEach(async (mention: Types.ObjectId) => {
                await handleNewNotification(mention, req.user!._id, { type: 'comment_mention', comment: comment._id, post: post._id })
            })
            const parentComment: CommentInterface | null = await Comment.findById(req.params.parentCommentId)

            if (parentComment) {
                if (!req.user!._id.equals(parentComment.user_id)) {
                    await handleUpsertNotification({
                        sender_id: req.user!._id,
                        user_id: parentComment.user_id,
                        post: post._id,
                        comment: comment._id,
                        type: 'reply'
                    })
                }
            }
            if (!req.user!._id.equals(post.user_id)) {
                await handleUpsertNotification({
                    sender_id: req.user!._id,
                    user_id: post.user_id,
                    post: post._id,
                    type: 'comment'
                })
            }
            const result: CommentInterface = await comment.save()
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
]

export const comments_delete: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const deleteCommentsRecursively = async (id: Types.ObjectId): Promise<void> => {
            const comments: CommentInterface[] = await Comment.find({ parent_comment: id })
            for (const comment of comments) {
                await deleteCommentsRecursively(comment._id)
            }
            await Comment.deleteMany({ parent_comment: id })
        }
        const removedComment: CommentInterface | null = await Comment.findByIdAndRemove(req.params.commentId)
        if (removedComment) {
            await deleteCommentsRecursively(removedComment._id)
        }
        return res.json(removedComment)
    } catch (error) {
        next(error)
    }
}

export const reaction_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const reactions: ReactionInterface[] = await Reaction.find({ parent_id: req.params.id }).populate('user_id')
        return res.json(reactions)
    } catch (error) {
        next(error)
    }
}
export const reaction_count: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const reactions: number = await Reaction.countDocuments({ parent_id: req.params.id })
        return res.json(reactions)
    } catch (error) {
        next(error)
    }
}

export const reaction_post: Middleware[] = [
    body('type')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
    , async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result: ReactionInterface | null = await Reaction.findOneAndUpdate(
                {
                    user_id: req.user!._id, parent_id: req.params.id
                },
                {
                    parent_id: req.params.id,
                    user_id: req.user!._id,
                    type: req.body.type,
                    parent_collection: req.body.parentCollection
                },
                {
                    new: true,
                    upsert: true
                }).populate('user_id')

            if (!req.user!._id.equals(req.body.parentAuthor)) {
                if (req.body.parentCollection === 'post') {
                    await handleUpsertNotification({
                        user_id: req.body.parentAuthor,
                        sender_id: req.user!._id,
                        type: 'post_reaction',
                        post: req.params.id
                    }, {
                        user_id: req.body.parentAuthor,
                        sender_id: req.user!._id,
                        type: 'post_reaction',
                        post: req.params.id,
                        reaction: result._id
                    })
                } else {
                    const comment: CommentInterface | null = await Comment.findById(req.params.id)
                    if (comment) {
                        await handleUpsertNotification({
                            user_id: req.body.parentAuthor,
                            sender_id: req.user!._id,
                            type: 'comment_reaction',
                            post: comment.post_id,
                            comment: req.params.id
                        }, {
                            user_id: req.body.parentAuthor,
                            sender_id: req.user!._id,
                            type: 'comment_reaction',
                            post: comment.post_id,
                            comment: req.params.id,
                            reaction: result._id
                        })
                    }
                }
            }
            return res.json(result)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
]


export const reaction_delete: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const removedReaction: ReactionInterface | null = await Reaction.findOneAndRemove({
            user_id: req.user!._id, parent_id: req.params.id
        })
        if (removedReaction && removedReaction.parent_collection === 'post') {
            await handleRemoveNotification({
                sender_id: req.user!._id,
                type: 'post_reaction',
                post: req.params.id,
                comment: { $exists: false }
            })
        } else {
            await handleRemoveNotification({
                sender_id: req.user!._id,
                type: 'comment_reaction',
                comment: req.params.id
            })
        }
        return res.json(removedReaction)
    } catch (error) {
        next(error)
    }
}


export const query_posts: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { query, isFriends, isMedia, skip, limit } = req.query
    const parsedLimit: number = limit ? +limit : 0
    const parsedSkip: number = skip ? +skip : 0

    try {
        let friends: Types.ObjectId[] = []
        if (isFriends) {
            const relationships = await Relationship.find({
                $or: [
                    {
                        user1_id: req.user!._id
                    },
                    {
                        user2_id: req.user!._id
                    }
                ]
            })
            friends = relationships.map((rel) => {
                if (req.user!._id.equals(rel.user1_id)) {
                    return rel.user2_id
                } else {
                    return rel.user1_id
                }
            })
        }
        const matchMedia: object[] = isMedia ? [
            {
                multiple_media: { $exists: true }
            }, {
                media: { $exists: true }
            }
        ] : [
            { _id: { $exists: true } }
        ]

        const matchObject = isFriends ?
            {
                $or: [
                    {
                        $and: [
                            { user_id: { $in: friends } },
                            { scope: { $in: ['friends', 'public'] } },
                            ...matchMedia
                        ]
                    },
                    {
                        $and: [
                            { group: { $in: req.user!.groups } },
                            { scope: { $in: ['public', 'group'] } },
                            ...matchMedia
                        ]
                    },

                ],
            } :
            {
                scope: 'public',
                ...matchMedia
            }
        const posts: PostInterface[] = await Post.aggregate([
            {
                $search: {
                    index: "posts",
                    autocomplete: {
                        query: query,
                        path: "content",
                        fuzzy: {
                            maxEdits: 2
                        }
                    }
                }
            },
            {
                $match: matchObject
            },
            { $sort: { create_date: -1 } },
            { $skip: parsedSkip },
            { $limit: parsedLimit },
            {
                $lookup: {
                    from: 'users', // Replace with the actual collection name for users
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_id'
                }
            },
            {
                $lookup: {
                    from: 'groups', // Replace with the actual collection name for groups
                    localField: 'group',
                    foreignField: '_id',
                    as: 'group'
                }
            },
            {
                $addFields: {
                    user_id: { $arrayElemAt: ['$user_id', 0] },
                    group: { $arrayElemAt: ['$group', 0] }
                }
            }
        ]).exec()
        return res.json(posts)
    } catch (error) {
        next(error)
    }
}