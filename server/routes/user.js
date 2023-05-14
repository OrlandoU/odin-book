const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'user-images/');
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.originalname);
    }
});

const uploadProfile = multer({ storage: storage })

//Get current user data
router.get('/', userController.current_get)

//Query user
router.get('/search', userController.query_user)

//Update current user data just nonsensitive info
router.put('/', uploadProfile.any(), userController.current_put)

//Update profile
router.put('/profile', uploadProfile.single('profile'), userController.current_profile_put)

//Update cover
router.put('/cover', uploadProfile.single('cover'), userController.current_cover_put)

//Create job on current user
router.post('/job' , userController.current_job_post)

//Update job on current user
router.put('/job/:jobId', userController.current_job_put)

//Delete job on current user
router.delete('/job/:jobId', userController.current_job_delete)

//Create academic record on current user
router.post('/academic', userController.current_academic_post)

//Update academic record on current user
router.put('/academic/:academicId', userController.current_academic_put)

//Delete academic record on current user
router.delete('/academic/:academicId', userController.current_academic_delete)

router.get('/:userId', userController.user_get)

module.exports = router