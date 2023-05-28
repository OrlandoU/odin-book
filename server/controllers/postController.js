const Post = require('../models/post')
const Comment = require('../models/comment')
const Reaction = require('../models/reaction')
const Relationship = require('../models/relationship')
const { body, validationResult } = require('express-validator')
const fs = require('fs/promises')
const { handleNewNotification, handleUpsertNotification, handleRemoveNotification } = require('../functions/notificationHandler')

exports.posts_get = async (req, res, next) => {
    try {
        const { sort, limit, skip, ...filter } = req.query
        console.log(filter)
        const posts = await Post.find(filter).populate('user_id', '-password').populate('group').sort({ create_date: -1 }).skip(skip || 0).limit(limit || 0)
        return res.json(posts)
    } catch (error) {
        next(error)
    }
}

exports.posts_photos_get = async (req, res, next) => {
    try {
        let posts
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

exports.posts_group_feed = async (req, res, next) => {
    const { limit, skip } = req.query
    try {
        const posts = await Post.find({ group: { $in: [...req.user.groups] }, type: 'normal' })
            .populate('user_id', '-password')
            .populate('group')
            .sort({ create_date: -1 })
            .skip(skip)
            .limit(limit)

        return res.json(posts)
    } catch (error) {
        next(error)
    }
}


exports.posts_feed = async (req, res, next) => {
    try {
        const { limit, skip } = req.query
        let friends = await Relationship.find({
            $or: [
                {
                    user1_id: req.user._id
                },
                {
                    user2_id: req.user._id
                }
            ]
        })
        friends = friends.map((rel) => {
            if (req.user._id.equals(rel.user1_id)) {
                return rel.user2_id
            } else {
                return rel.user1_id
            }
        })
        const posts = await Post.aggregate([
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
                            group: { $in: req.user.groups },
                        }
                    ]
                }
            },
            { $addFields: { is_friend: { $in: ["$user_id", friends] } } },
            { $sort: { is_friend: -1, create_date: -1 } },
            { $skip: +skip },
            { $limit: +limit },
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

exports.posts_post = [
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
    , async (req, res, next) => {
        console.log(req.body)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.sendStatus(400)
        }

        try {
            const multiple_media = req.files.map(file => {
                return `${req.protocol}://${req.hostname}:${req.socket.localPort}/images/post-images/${file.originalname}`
            })
            let post
            if (req.body.group_id) {
                post = new Post({
                    content: req.body.content,
                    group: req.body.group_id ? req.body.group_id : null,
                    user_id: req.user._id,
                    mentions: req.body.mentions,
                    multiple_media: multiple_media,
                    scope: req.body.scope
                })
                post.mentions.forEach(async (mention) => {
                    await handleNewNotification(mention, req.user._id, { type: 'post_mention', post: post._id })
                })
            } else {
                post = new Post({
                    content: req.body.content,
                    user_id: req.user._id,
                    mentions: req.body.mentions,
                    multiple_media: multiple_media,
                    scope: req.body.scope
                })
                post.mentions.forEach(async (mention) => {
                    await handleNewNotification(mention, req.user._id, { type: 'post_mention', post: post._id })
                })
            }
            const result = await post.save()
            const populatedPost = await Post.findById(result._id).populate('user_id', '-password').populate('group')
            return res.json(populatedPost)
        } catch (error) {
            next(error)
        }
    }
]
exports.post_trash_put = async (req, res, next) => {
    try {
        console.log(req.body)
        const result = await Post.findByIdAndUpdate(req.params.postId, { isInTrash: req.body.isTrash }, { new: true })
        return res.json(result)
    } catch (error) {
        next(error)
    }
}

exports.posts_delete = async (req, res, next) => {
    try {
        const result = await Post.findByIdAndRemove(req.params.postId)
        if (result.multiple_media.length > 0) {
            for (const media of result.multiple_media) {
                const mediaString = media.split('/')
                const path = `./${mediaString[mediaString.length - 2]}/${mediaString[mediaString.length - 1]}`
                await fs.unlink(path)
            }
        }
        return res.json(result)
    } catch (error) {
        next(error)
    }
}

exports.comments_count = async (req, res, next) => {
    try {
        let comments
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

exports.comments_get = async (req, res, next) => {
    try {
        let comments = await Comment.find({
            post_id: req.params.postId,
            parent_comment: req.params.parentCommentId
        }).populate('user_id')

        return res.json(comments)
    } catch (error) {
        next(error)
    }
}

exports.comments_post = [
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
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        }

        try {
            const post = await Post.findById(req.params.postId)
            if (!post) {
                return res.status(404).send('Post not found')
            }
            if (req.params.parentCommentId) {
                const parent_comment = await Comment.findById(req.params.parentCommentId)
                if (!parent_comment) {
                    return res.status(404).send('Parent comment not found')
                }
            }

            const comment = new Comment({
                user_id: req.user._id,
                post_id: post._id,
                parent_comment: req.params.parentCommentId,
                content: req.body.content,
                mentions: req.body.mentions,
                media: req.body.media
            })

            comment.mentions.forEach(async (mention) => {
                await handleNewNotification(mention, req.user._id, { type: 'comment_mention', comment: comment._id, post: post._id })
            })
            const parentComment = await Comment.findById(req.params.parentCommentId)

            if (req.params.parentCommentId) {
                if (!req.user._id.equals(parentComment.user_id)) {
                    await handleUpsertNotification({
                        sender_id: req.user._id,
                        user_id: parentComment.user_id,
                        post: post._id,
                        comment: comment._id,
                        type: 'reply'
                    })
                }
            }
            if (!req.user._id.equals(post.user_id)) {
                await handleUpsertNotification({
                    sender_id: req.user._id,
                    user_id: post.user_id,
                    post: post._id,
                    type: 'comment'
                })
            }
            const result = await comment.save()
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
]

exports.comments_delete = async (req, res, next) => {
    try {
        const deleteCommentsRecursively = async (id) => {
            const comments = await Comment.find({ parent_comment: id })
            for (const comment of comments) {
                await deleteCommentsRecursively(comment._id)
            }
            await Comment.deleteMany({ parent_comment: id })
        }
        await deleteCommentsRecursively(req.params.commentId)
        const removedComment = await Comment.findByIdAndRemove(req.params.commentId)
        return res.json(removedComment)
    } catch (error) {
        next(error)
    }
}

exports.reaction_get = async (req, res, next) => {
    try {
        const reactions = await Reaction.find({ parent_id: req.params.id }).populate('user_id')
        return res.json(reactions)
    } catch (error) {
        next(error)
    }
}
exports.reaction_count = async (req, res, next) => {
    try {
        const reactions = await Reaction.countDocuments({ parent_id: req.params.id })
        return res.json(reactions)
    } catch (error) {
        next(error)
    }
}

exports.reaction_post = [
    body('type')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
    , async (req, res, next) => {
        try {
            const result = await Reaction.findOneAndUpdate(
                {
                    user_id: req.user._id, parent_id: req.params.id
                },
                {
                    parent_id: req.params.id,
                    user_id: req.user._id,
                    type: req.body.type,
                    parent_collection: req.body.parentCollection
                },
                {
                    new: true,
                    upsert: true
                }).populate('user_id')

            if (!req.user._id.equals(req.body.parentAuthor)) {
                if (req.body.parentCollection === 'post') {
                    await handleUpsertNotification({
                        user_id: req.body.parentAuthor,
                        sender_id: req.user._id,
                        type: 'post_reaction',
                        post: req.params.id
                    }, {
                        user_id: req.body.parentAuthor,
                        sender_id: req.user._id,
                        type: 'post_reaction',
                        post: req.params.id,
                        reaction: result._id
                    })
                } else {
                    const comment = await Comment.findById(req.params.id)
                    await handleUpsertNotification({
                        user_id: req.body.parentAuthor,
                        sender_id: req.user._id,
                        type: 'comment_reaction',
                        post: comment.post_id,
                        comment: req.params.id
                    }, {
                        user_id: req.body.parentAuthor,
                        sender_id: req.user._id,
                        type: 'comment_reaction',
                        post: comment.post_id,
                        comment: req.params.id,
                        reaction: result._id
                    })
                }
            }
            return res.json(result)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
]


exports.reaction_delete = async (req, res, next) => {
    try {
        const removedComment = await Reaction.findOneAndRemove({
            user_id: req.user._id, parent_id: req.params.id
        })
        if (removedComment.parent_collection === 'post') {
            await handleRemoveNotification({
                sender_id: req.user._id,
                type: 'post_reaction',
                post: req.params.id,
                comment: { $exists: false }
            })
        } else {
            await handleRemoveNotification({
                sender_id: req.user._id,
                type: 'comment_reaction',
                comment: req.params.id
            })
        }
        return res.json(removedComment)
    } catch (error) {
        next(error)
    }
}


exports.query_posts = async (req, res, next) => {
    const { query, isFriends, isMedia, skip, limit } = req.query
    console.log(req.query)
    try {
        let friends
        if (isFriends) {
            friends = await Relationship.find({
                $or: [
                    {
                        user1_id: req.user._id
                    },
                    {
                        user2_id: req.user._id
                    }
                ]
            })
            friends = friends.map((rel) => {
                if (req.user._id.equals(rel.user1_id)) {
                    return rel.user2_id
                } else {
                    return rel.user1_id
                }
            })
        }
        const matchMedia = isMedia ? [
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
                        user_id: { $in: friends },
                        scope: { $in: ['friends', 'public'] }
                    },
                    {
                        group: { $in: req.user.groups },
                        scope: { $in: ['public', 'group'] }
                    }
                ],
                $or: matchMedia
            } :
            {
                $or: [
                    { scope: 'public' },
                ],
                $or: matchMedia
            }
        const posts = await Post.aggregate([
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
            { $skip: +skip },
            { $limit: +limit },
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