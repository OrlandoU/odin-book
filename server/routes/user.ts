import express, { Request, Router } from 'express';
import * as userController from '../controllers/userController';
import multer, { Multer, StorageEngine } from 'multer';

const router: Router = express.Router()
const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: null | Error, destination: string) => void) {
        cb(null, 'dist/uploads/user-images/');
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: null | Error, destination: string) => void) {
        const currentDate = new Date().toISOString().replace(/:/g, '-');
        const uniqueFileName = currentDate + '-' + file.originalname;
        cb(null, uniqueFileName);
    }
});

const uploadProfile: Multer = multer({ storage: storage })

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
router.post('/job', userController.current_job_post)

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

export default router