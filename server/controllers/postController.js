const Post = require('../models/post')
const Comment = require('../models/comment')
const Reaction = require('../models/reaction')
const Relationship = require('../models/relationship')
const { body, validationResult } = require('express-validator')

exports.posts_get = async (req, res, next) => {
    try {
        const { sort, ...filter } = req.query
        const posts = await Post.find(filter).populate('user_id', '-password').sort({ create_date: -1 })
        return res.json(posts)
    } catch (error) {
        next(error)
    }
}

exports.posts_feed = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('user_id', '-password').sort({ create_date: -1 })
        let friends = await Relationship({
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
        Post.aggregate([
            {
                $match: {
                    $or: [
                        {
                            user_id: {$in: friends},
                        },
                        {
                            scope: 'global'
                        },{
                            group: {$in: req.user.groups}
                        }
                    ]
                }
            },
            { $addFields: { is_friend: { $in: ["$user_id", friends] } } },
            { $sort: { is_friend: -1, create_date: -1 } }
        ])
        return res.json(posts)
    } catch (error) {
        next(error)
    }
}

exports.posts_post = [
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
            res.sendStatus(400)
        }

        try {
            const post = new Post({
                content: req.body.content,
                media: req.body.media,
                user_id: req.user._id
            })

            const result = await post.save()
            return res.json(result)
        } catch (error) {
            next(error)
        }
    }
]

exports.posts_delete = async (req, res, next) => {
    try {
        const result = await Post.findByIdAndRemove(req.params.postId)
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
        })

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
                post_id: req.params.postId,
                parent_comment: req.params.parentCommentId,
                content: req.body.content,
                media: req.body.media
            })

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
        const reactions = await Reaction.find({ parent_id: req.params.id })
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
                    type: req.body.type
                },
                {
                    new: true,
                    upsert: true
                })
            console.log(result)
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
        },)
        return res.json(removedComment)
    } catch (error) {
        next(error)
    }
}