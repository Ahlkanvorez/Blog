(function () {
    var bcrypt = require('bcrypt');
    var express = require('express');

    /* Security Features implemented:
     * - Check username before password, to avoid needless hash computations.
     * - Record the frequency of login attempts for a specific username, and after 5 login attempts, reject the password
     *     for a time (two hours) without checking it to help prevent brute force and DDoS attacks.
     */

    /**
     * A helper function for use in making private certain REST API handles. Any handle with this function applied will
     * not be accessible unless a user has first logged in using the '.../users/login' request.
     *
     * This is implemented by adding it to the definition of the routes desired to be protected, such as follows:
     *
     * router.get('/path', checkAuth, function handler (req, res, next) {});
     */
    module.exports.checkAuth = function checkAuth(req, res, next) {
        if (!req.session.userId) {
            /* This prevents a user from accessing a restricted page, logging out,
             *   and then using the back button to access the page again.
             *   http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js/8003291#8003291
             */
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            console.log('Forbidden login attempt.');
            res.redirect(403, '/users/login');
        } else {
            /* TODO: Determine if you need to check the validity of userID each time. */
            next();
        }
    };
})();