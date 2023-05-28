const express = require('express')
const router = express.Router()

const notificationController = require('../controllers/notificationController')

router.get('/', notificationController.notification_get)

router.put('/viewed', notificationController.notification_viewed_put)

router.put('/:notificationId', notificationController.notification_put)

router.delete('/:notificationId', notificationController.notification_delete)

module.exports = router