var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController')

/* GET users listing. */
router.post('/login', authController.login)

router.post('/login-facebook', authController.login_facebook)

router.post('/sign-up', authController.sign_up);

module.exports = router;
