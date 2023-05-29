import express, { Router } from 'express';
import * as authController from '../controllers/authController';

const router: Router   = express.Router();

/* GET users listing. */
router.post('/login', authController.login)

router.get('/login-facebook', authController.login_facebook)

router.post('/sign-up', authController.sign_up);

export default router;
