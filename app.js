const express = require('express');
const session = require('client-sessions');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston'); /* logging */
const winston = require('winston');
const get_ip = require('ipware')().get_ip;

/* Database requirements and initialization */
const mongoose = require('mongoose');
/* The mongoose default Promise library is deprecated; this enables one that isn't. */
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/blog');
const db = mongoose.connection;

/* Route files */
const routes = require('./routes/index');
const users = require('./routes/users');
const blog = require('./routes/blog');

const app = express();

/* Provides many automatic security boosts. */
const helmet = require('helmet');
app.use(helmet());

/* Provides automatic performance boosts. */
const compression = require('compression');
app.use(compression());

/* view engine setup */
const engines = require('consolidate');
app.engine('jade', require('jade').__express);
app.engine('html', require('ejs').renderFile);

app.use(favicon(path.join(__dirname, 'public/img', 'favicon.png')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Generate a random string of alphanumeric characters
 */
function randomSecretString() {
    /* This string is long unless the number is a simple fraction, a very low probability event. */
    function randomString() {
        return Math.random().toString(36).substring(2);
    }
    /* The probability that all three are short is too unlikely to worry about. */
    return randomString() + randomString() + randomString();
}

/* Configure the session
 * For a good reference on the session library used, see:
 * - https://github.com/mozilla/node-client-sessions
 * - https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions
 */
app.use(session({
    cookieName : 'session', /* The key name added to the req object. */
    secret : randomSecretString(), /* A secret string generated on startup. */
    duration : 30 * 60 * 1000, /* 30 minutes */
    activeDuration : 15 * 60 * 1000, /* activity adds 15 minutes */
    httpOnly : true, /* Cookie is inaccessible via javascript */
    secure : true, /* Cookie will only be sent over SSL */
    ephemeral : true /* Delete cookies on browser exit, so it's safer to login on a public computer. TODO: Fix. */
}));

/* Log requests using winston */
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
}));

/* Inform webcrawlers not to investigate the /users, /blog, or /admin sections of the site. */
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /admin/\nDisallow: /users/\nDisallow: /blog/");
});

/* Make the database accessible to the router */
app.use(function(req, res, next) {
    req.db = db;
    next();
});

/* Register the routers for this app with the server. */
app.use('/', routes);
app.use('/users', users);
app.use('/blog', blog);

/* Log errors using winston. */
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
}));

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

  /* Log the IP information for each request */
  app.use(function(req, res, next) {
    var ip_info = get_ip(req);
    console.log(ip_info);
    next();
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
