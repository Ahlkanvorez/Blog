var express = require('express');
var User = require('../models/user.model').User;
var router = express.Router();
var checkAuth = require('./auth').checkAuth;

/**
 * GET a user listing; specifically, an array of JSON objects formatted as follows:
 * {
 *   username : ___,
 *   email : ___
 * }
 *
 * TODO: Determine whether this needs authentication or not.
 */
router.get('/', checkAuth, function (req, res, next) {
    User.find().exec(function callback(err, data) {
        res.json(data.map(function (user) {
            return {
                username: user.username,
                email: user.email
            }
        }));
    });
});

/**
 * GET the login page.
 * Renders the login page, which is formatted by login.jade
 */
router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Login'});
});

/* TODO: Investigate 
 - https://github.com/bnoguchi/everyauth
 - https://github.com/ncb000gt/node.bcrypt.js/
 */

/**
 * POST login requests for users (which should only be from blog authors).
 * If an account sustains five failed login attempts, it will be locked and automatically reject further attempts
 * for the next two hours. This effectively makes brute force login attempts impossible.
 */
router.post('/login', function (req, res, next) {
    User.getAuthenticated(req.body.username, req.body.password, function (err, user, reason) {
        if (err) {
            throw err;
        }

        /* Login was successful if user is not null. */
        if (user) {
            req.session.userId = user._id;
            res.redirect('/admin');
            return;
        }

        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                /* Don't tell the user why the login failed, just that it did. If the person trying to log in
                 * knows that it was the username or password which was incorrect, then they are that much closer to
                 * guessing the correct answer.
                 */
                break;
            case reasons.MAX_ATTEMPTS:
                /* TODO: Send an email to the user to notify them that their account has been temporarily locked, and
                 *       inform them of the time that their account will be unlocked again.
                 */
                break;
        }
        res.send('Bad login credentials.');
    });
});

/**
 * GET the logout request, which will delete the token indicating that the requesting user is logged in, and prevent
 * them from accessing any protected pages without first logging in again. If someone requests this handle without
 * first being logged in, there should be no negative effect, since the value being deleted is already null; they will
 * simply be redirected to the login page.
 *
 * TODO: Does this need to be wrapped in 'checkauth'? I don't think it does.
 */
router.get('/logout', function (req, res) {
    delete req.session.userId;
    res.redirect('/users/login');
});

module.exports = router;
