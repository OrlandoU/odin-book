const express = require('express')
const router = express.Router()
const relController = require('../controllers/relControllers')

//Get friends
router.get('/', relController.friends_get)

//Get friend requests
router.get('/requests', relController.requests_get)

router.get('/suggestions', relController.friends_suggestions_get)

//Get friends in common
router.get('/in-common/:userId', relController.friends_in_common_get)

//Remove friend
router.delete('/:userId', relController.friends_delete)

//Create friend requests
router.post('/:userId', relController.requests_post)

//Accept Request
router.put('/:userId/accept', relController.requests_accept)


module.exports = router