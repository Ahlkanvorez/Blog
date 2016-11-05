var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');

var blogDatabase = require('./data/blog-database.js');
var db = mongoose.connection;

// Routes
var routes = require('./routes/index');
var users = require('./routes/users');
var blog = require('./routes/blog')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Ahlkanvorez')); // Initialize with a secret.
app.use(express.static(path.join(__dirname, 'public')));

// Configure the session
var sess = {
  secret : 'Ahlkanvorez',
  resave : false,
  cookie : { secure : false } // TODO: Make work with secure : true.
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // Trust first proxy
  sess.cookie.secure = true; // Serve secure cookies
}

app.use(session(sess));

// Make the database accessible to the router
app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/blog', blog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stack-traces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
