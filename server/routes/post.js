const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

//Get Posts
router.get('/', postController.posts_get)

//Create post
router.post('/', postController.posts_post)

//Delete Post
router.delete('/:postId', postController.posts_delete)



//Get comments count under post
router.get('/:postId/comments/:parentCommentId?/count', postController.comments_count)

//Get comments under post and comment
router.get('/:postId/comments/:parentCommentId?', postController.comments_get)

//Create comment
router.post('/:postId/comments/:parentCommentId?', postController.comments_post)

//Remove comment
router.delete('/:postId/comments/:commentId', postController.comments_delete)



//Get reactions of post or comment
router.get('/:id/reaction', postController.reaction_get)

//Get reactions count of post or comment
router.get('/:id/reaction/count', postController.reaction_count)

//Create or update post or comment reaction
router.post('/:id/reaction', postController.reaction_post)

//Remove reaction
router.delete('/:id/reaction', postController.reaction_delete)

module.exports = router