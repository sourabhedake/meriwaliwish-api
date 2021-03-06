//************************************//
//IMPORTS
//************************************//
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('./mongo/mongo-connect');
var indexRouter = require('./routes/index');
var itemRouter = require('./routes/item');
const { sleep } = require('./modules/util');

//************************************//
let isDBLoaded = false;
mongoose.connect().then(() => {
  isDBLoaded = true;
});


// while (!isDBLoaded) {
//   console.log("Server is waiting for a successful DB connection.");
//   sleep(500);
// }

var app = express();
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(cookieParser());

  // Load Routes
  console.log("Routes > Loading endpoints...");
  app.use('/', indexRouter);
  app.use('/_api/items', itemRouter);
  console.log("Routes > Loaded endpoints");

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
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;
