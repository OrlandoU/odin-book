const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const Post = require('../models/post')

exports.login = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user) => {
        if (err || !user) {
            return next(err)
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                return next(err)
            }
        })

        const token = jwt.sign(user.toObject(), 'OdinBook')
        return res.json({ token, user })
    })(req, res, next)
}

exports.login_facebook = (req, res, next) => {
    passport.authenticate('facebook', {session: false}, (err, user)=>{
        console.log(err, user)
        console.log('ok')
    })(req, res, next)
}

exports.sign_up = [
    body('first_name')
        .trim()
        .escape()
        .isLength({ min: 4 })
        .withMessage('Minimum of 8 chars on first name'),
    body('last_name')
        .trim()
        .escape()
        .isLength({ min: 4 })
        .withMessage('Minimum of 8 chars on last name'),
    body('email')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Invalid email')
        .custom(async (value)=>{
            const user = await User.findOne({email: value})
            if(!user){
                return true
            }
            throw new Error('Email already in use')
        }),
    body('password')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Minimum of 8 chars on password')
        .custom((value, { req }) => {
            if (value === req.body.passwordConfirmation) {
                return true
            }
            throw new Error("Passwords don't match")
        })
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array())
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            console.log(req.body)
            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: hashedPassword
            })

            const result = await user.save()

            const post = new Post({
                user_id: result._id,
                type: 'birth'
            })

            await post.save()

            req.login(user, { session: false }, (err) => {
                if (err) {
                    return next(err)
                }
            })

            const token = jwt.sign(user.toObject(), 'OdinBook')
            return res.json({
                token,
                user
            })
        } catch (error) {
            next(error)
        }
    }
]