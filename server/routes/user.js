const express = require('express')
const router = express.Router()

//Get friend requests
router.get('/friend-requests')

//Update user data
router.put('/:userId')

//Delete user and related data
router.delete('/:userId')

//Create friend requests
router.post('/:userId/friend-request')


module.exports = router