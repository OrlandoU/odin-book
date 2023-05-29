import express, { Request } from 'express';
const router = express.Router()
import * as postController from '../controllers/postController';

import multer, { DiskStorageOptions, Multer, StorageEngine } from 'multer';
import post from '../models/post';

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: null | Error, destination: string) => void) {
        cb(null, 'post-images/');
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: null | Error, filename: string) => void) {
        cb(null, file.originalname);
    }
});

const upload: Multer = multer({ storage: storage, limits: { files: 5 } })

//Get Posts
router.get('/', postController.posts_get)

//Query post
router.get('/query', postController.query_posts)

//Get posts with photos
router.get('/photos/:userId?', postController.posts_photos_get)

//Get feed posts
router.get('/feed', postController.posts_feed)

//Get group feed posts
router.get('/group_feed', postController.posts_group_feed)

//Create post
router.post('/', upload.array('multiple_media'), postController.posts_post)

//Delete Post
router.put('/:postId', postController.post_trash_put)

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

export default router