const express = require('express');
const session = require('client-sessions');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

/* Database requirements and initialization */
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/blog');
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
app.use(express.static(path.join(__dirname, 'public')));

/* Configure the session
 * For a good reference on the session library used, see:
 * - https://github.com/mozilla/node-client-sessions
 * - https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
 */
app.use(session({
    cookieName : 'session', /* The key name added to the req object. */
    secret : 'RAg1H7DnxA36tU8nhRIgjTER05RT3YStF8CXuvAJZdSn8iMXmu',
    duration : 30 * 60 * 1000, /* 30 minutes */
    activeDuration : 15 * 60 * 1000, /* activity adds 15 minutes */
    httpOnly : true, /* Cookie is inaccessible via javascript */
    // secure : true, /* Cookie will only be sent over SSL */
    ephemeral : true /* Delete cookies on browser exit, so it's safer to login on a public computer. TODO: Fix. */
}));

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
    error : {},
  });
});


module.exports = app;
