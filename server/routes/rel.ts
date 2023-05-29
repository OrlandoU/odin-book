import express, { Router } from 'express'
import * as relController from '../controllers/relControllers'

const router: Router = express.Router()

//Get friend requests
router.get('/requests', relController.requests_get)

//Get friends suggestions
router.get('/suggestions', relController.friends_suggestions_get)

//Get friends in common
router.get('/in-common/:userId', relController.friends_in_common_get)

//Get relationship 
router.get('/:userId/relationship', relController.relationship_get)

//Get friends
router.get('/:userId', relController.friends_get)

//Remove friend
router.delete('/:userId', relController.friends_delete)

//Create friend requests
router.post('/:userId', relController.requests_post)

//Accept Request
router.put('/:userId/accept', relController.requests_accept)


export default router