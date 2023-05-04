const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.current_get)

router.get('/:userId')

module.exports = router