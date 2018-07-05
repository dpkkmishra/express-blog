var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var categoriesRouter = require('./routes/categories');

var app = express();

app.locals.moment = require('moment');

app.locals.truncateText = function(text, length) {
	return text.substring(0, length);	
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Handle file uploads
app.use(multer({dest:path.join(__dirname, 'public/images/uploads')}).single('mainimage'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Handle Express Sessions																			
app.use(session({
	secret: 'any-secret-key',
	saveUninitialized: true,
	resave: true
}));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

// connect flash middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Make our db accessible to router
app.use(function(req, res, next) {
	req.db = db;
	next();
})

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/categories', categoriesRouter);

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
