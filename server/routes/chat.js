const express = require('express')
const router = express.Router()

//Get all chats
router.get('/')

//Create Chat with participants
router.post('/')

//Delete chat and related data
router.delete('/:chatId')

//Get messages under chat
router.get('/:chatId/messages')


router.post('/:chatId/message')


//Create friend requests
router.post('/:userId/friend-request')


module.exports = router