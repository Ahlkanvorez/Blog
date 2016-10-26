var bcrypt = require('bcrypt');
var express = require('express');

/* Security Features implemented:
  - Check username before password, to avoid needless hash computations.
  - Record the frequency of login attempts for a specific username, and
     after N login attempts for some N, reject the password for a time
     without checking it to prevent brute force and DDoS attacks. */

module.exports.checkAuth = function checkAuth (req, res, next) {
	if (!req.session.userId) {
		// This prevents a user from accessing a restricted page, logging out,
		//   and then using the back button to access the page again.
		//   http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js/8003291#8003291
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		console.log('Forbidden login attempt.');
		res.redirect(403, '/users/login');
	} else {
		// TODO: Determine if you need to check the validity of userID each time.
		next();
	}
};
