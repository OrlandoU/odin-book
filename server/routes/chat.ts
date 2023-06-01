import express, { Request, Response, Router } from 'express'
import * as chatController from '../controllers/chatController'
import multer, { StorageEngine } from 'multer'

const storageOption: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'dist/uploads/chat-images/')
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storageOption })

const router: Router = express.Router()

//Get all chats
router.get('/', chatController.chats_get)

//Get unviewed chats
router.get('/unviewed', chatController.chats_unviewed_get)

//Get unread chats
router.get('/unread', chatController.chats_unread_get)

//Get chat with user
router.get('/user/:userId', chatController.chats_user_get)

//Get chat
router.get('/:chatId', chatController.chats_details_get)

//Create Chat with participants
router.post('/', chatController.chats_post)

//Get chat last message
router.get('/:chatId/last-message', chatController.chats_last_message_get)


//Get messages under chat
router.get('/:chatId/messages', chatController.messages_get)

//Create message 
router.post('/:chatId/messages', upload.array('media'), chatController.messages_post)

//Update message
router.put('/:chatId/messages/:messageId', chatController.messages_put)

//Update messages state under chat 
router.put('/:chatId/viewed', chatController.chats_message_toViewed_put)

//Update messages state under chat 
router.put('/:chatId/read', chatController.chats_message_toRead_put)




export default router