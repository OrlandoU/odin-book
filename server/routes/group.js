const express = require('express')
const router = express.Router()
const groupController = require('../controllers/groupController')

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'group-covers/');
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage})

//Get Groups
router.get('/', groupController.group_get)

//Query post
router.get('/query', groupController.query_group)

router.get('/:groupId', groupController.group_details_get)

router.get('/:groupId/last-active', groupController.group_last_active_get)

router.get('/:groupId/members-count', groupController.group_member_count_get)

router.get('/:groupId/members', groupController.group_members_get)

//Create group
router.post('/', groupController.group_post)

//Delete group
router.delete('/:groupId', groupController.group_delete)

//Update group
router.put('/:groupId', upload.single('cover'), groupController.group_put)

//Join group
router.post('/:groupId/join', groupController.group_join)

//Separate from group
router.delete('/:groupId/leave', groupController.group_leave)

//Ban user from group
router.delete('/:groupId/:userId', groupController.group_ban)

module.exports = router