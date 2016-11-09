const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

/* Database requirements and initialization */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');
const db = mongoose.connection;

/* Route files */
const routes = require('./routes/index');
const users = require('./routes/users');
const blog = require('./routes/blog')

const app = express();

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/* uncomment the following after placing your favicon in '/public':
 * app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Ahlkanvorez')); // Initialize with a secret.
app.use(express.static(path.join(__dirname, 'public')));

/* Configure the session
 * TODO: Review the session settings.
 */
var sess = {
  secret : 'Ahlkanvorez',
  resave : false,
  cookie : { secure : false } // TODO: Make it work with secure : true.
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // Trust first proxy
  sess.cookie.secure = true; // Serve secure cookies
}

app.use(session(sess));

/* Make the database accessible to the router */
app.use(function(req, res, next) {
    req.db = db;
    next();
});

/* Register the routers for this app with the server. */
app.use('/', routes);
app.use('/users', users);
app.use('/blog', blog);

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Error handlers */

/* Development error handler will print stacktrace */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message : err.message,
      error : err
    });
  });
}

/* production error handler no stack-traces leaked to user */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message : err.message,
    error : {}
  });
});


module.exports = app;
