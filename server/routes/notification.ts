import express, { Router } from 'express'
import * as notificationController from '../controllers/notificationController'

const router: Router = express.Router()

router.get('/', notificationController.notification_get)

router.put('/viewed', notificationController.notification_viewed_put)

router.put('/:notificationId', notificationController.notification_put)

router.delete('/:notificationId', notificationController.notification_delete)

export default router