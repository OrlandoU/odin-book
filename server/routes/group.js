const express = require('express')
const router = express.Router()
const groupController = require('../controllers/groupController')

//Get Groups
router.get('/', groupController.group_get)

//Create group
router.post('/', groupController.group_post)

//Delete group
router.delete('/:groupId', groupController.group_delete)

//Update group
router.put('/:groupId', groupController.group_put)

//Join group
router.post('/:groupId/join', groupController.group_join)

//Separate from group
router.delete('/:groupId/leave', groupController.group_leave)

//Ban user from group
router.delete('/:groupId/:userId', groupController.group_ban)

module.exports = router