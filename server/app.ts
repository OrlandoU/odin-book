var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var passportjwt = require('passport-jwt')
var ExtractJwt = passportjwt.ExtractJwt
var LocalStrategy = require('passport-local').Strategy
var JwtStrategy = passportjwt.Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var cors = require('cors')
import bcrypt from 'bcryptjs';

require('dotenv').config();
require('./mongoConfig')

import User, { UserInterface } from './models/user';

import groupRouter from './routes/group';
import { NextFunction, Response, Request } from 'express';

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import postRouter from './routes/post';
import chatRouter from './routes/chat';
import relRouter from './routes/rel';
import userRouter from './routes/user';
import notificationRouter from './routes/notification';
import { populateFirebase} from './firebase';

const app = express();



app.use(cors())
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email: string, password: string, done: (error: unknown, user?: UserInterface | false, message?: { message: string }) => void) => {
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return done(null, false, { message: 'Incorrect email' })
    }
    bcrypt.compare(password, user.password, (err, result) => {
      console.log(user)
      if (err || !result) {
        return done(err, false, { message: 'Incorrect password' })
      }

      return done(null, user)
    })

  } catch (error) {
    done(error)
  }
}))


passport.use(new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'OdinBook' }, async (jwtPayLoad: UserInterface, done: (error: Error | unknown, user?: UserInterface | null) => void) => {
  try {
    const user = await User.findById(jwtPayLoad._id)
    done(null, user)
  } catch (error) {
    done(error)
  }
}))

app.use(populateFirebase);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), userRouter)
app.use('/rel', passport.authenticate('jwt', { session: false }), relRouter)
app.use('/posts', passport.authenticate('jwt', { session: false }), postRouter)
app.use('/chats', passport.authenticate('jwt', { session: false }), chatRouter)
app.use('/groups', passport.authenticate('jwt', { session: false }), groupRouter)
app.use('/notifications', passport.authenticate('jwt', { session: false }), notificationRouter)

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err)
  // render the error page
  res.sendStatus(res.locals.error.status || 500);
});

module.exports = app;
