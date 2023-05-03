const express = require('express')
const router = express.Router()

const chatController = require('../controllers/chatController')

//Get all chats
router.get('/', chatController.chats_get)


//Create Chat with participants
router.post('/', chatController.chats_post)

//Get chat last message
router.get('/:chatId/last-message', chatController.chats_last_message_get)


//Get messages under chat
router.get('/:chatId/messages', chatController.messages_get)

//Create message 
router.post('/:chatId/messages', chatController.messages_post)

//Delete message
router.delete('/:chatId/messages/:messageId', chatController.messages_delete)


module.exports = router