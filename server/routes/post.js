const express = require('express')
const router = express.Router()

//Get Posts
router.get('/')

//Create post
router.post('/')

//Delete Post
router.delete('/:postId')



//Get comments count under post
router.get('/:postId/comments/:parentCommentId/count')

//Get comments under post and comment
router.get('/:postId/comments/:parentCommentId')

//Create comment
router.post('/:postId/comments/:commentId')

//Remove comment
router.delete('/:postId/comments/:commentId')



//Get reactions of post or comment
router.get('/:id/reaction')

//Get reactions count of post or comment
router.get('/:id/reaction/count')

//Create or update post or comment reaction
router.post('/:id/reaction')

module.exports = router