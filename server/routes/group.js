const express = require('express')
const router = express.Router()
const groupController = require('../controllers/groupController')

//Create group
router.post('/', groupController.group_post)

//Delete group
router.delete('/:groupId', groupController.group_delete)

//Remove user from group
router.delete('/:groupId/:userId')

//Join group
router.post('/:groupId/join')

//Separate from group
router.delete('/:groupId/separate')

module.exports = router