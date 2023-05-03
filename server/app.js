var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var passportjwt = require('passport-jwt')
var JwtStrategy = passportjwt.Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var ExtractJwt = passportjwt.ExtractJwt
const bcrypt = require('bcryptjs')
require('dotenv').config();
require('./mongoConfig')

const User = require('./models/user')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var postRouter = require('./routes/post')
var chatRouter = require('./routes/chat')
var relRouter = require('./routes/rel')

var app = express();



passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
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
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/oauth2/redirect/facebook',
}, function verify(accessToken, refreshToken, profile, cb) {
  console.log(accessToken)
  cb(null)
}))


passport.use(new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'OdinBook' }, async (jwtPayLoad, done) => {
  try {
    const user = await User.findById(jwtPayLoad._id)
    done(null, user)
  } catch (error) {
    done(error)
  }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/rel', passport.authenticate('jwt', { session: false }), relRouter)
app.use('/posts', passport.authenticate('jwt', { session: false }), postRouter)
app.use('/chats', passport.authenticate('jwt', { session: false }), chatRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;
