const createError = require('http-errors');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const gameRouter = require('./routes/game');
const playerRouter = require('./routes/player');
const paymentRouter = require('./routes/payment');
const liffRouter = require('./routes/liff');

const app = express();

// view engine setup1
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(cookieParser());
app.use(session({
  secret: "mySuperSecret",
  resave: false,
  saveUninitialized: false,
}))
app.use(cors());
app.use(flash());

app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/api', apiRouter);
app.use('/game', gameRouter);
app.use('/player', playerRouter);
app.use('/payment', paymentRouter);
app.use('/liff', liffRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
