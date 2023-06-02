import { Middleware, NextFunction, Request, Response } from "express"

import { Result, ValidationError, body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import User, { UserInterface } from '../models/user'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import Post from '../models/post'

export const login: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('local', { session: false }, (err: Error, user: UserInterface): Response | void => {
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

export const login_facebook: Middleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('facebook', { session: false }, (err: Error, user: UserInterface) => {
        console.log('ok')
    })(req, res, next)
}

export const sign_up: Middleware[] = [
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
        .custom(async (value: string): Promise<boolean> => {
            const user: UserInterface | null = await User.findOne({ email: value })
            if (!user) {
                return true
            }
            throw new Error('Email already in use')
            return false
        }),
    body('password')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Minimum of 8 chars on password')
        .custom((value: string, { req }) => {
            if (value === req.body.passwordConfirmation) {
                return true
            }
            throw new Error("Passwords don't match")
        })
    , async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array())
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
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