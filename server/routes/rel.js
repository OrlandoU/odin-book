const express = require('express')
const router = express.Router()
const relController = require('../controllers/relControllers')

//Get friends
router.get('/', relController.friends_get)

//Remove friend
router.delete('/:userId', relController.friends_delete)

//Get friend requests
router.get('/friend-requests', relController.requests_get)

//Create friend requests
router.post('/:userId/friend-requests', relController.requests_post)

//Accept Request
router.put('/:userId/accept', relController.requests_accept)


module.exports = router