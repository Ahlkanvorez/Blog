var express = require('express');
var User = require('../models/user.model').User;
var router = express.Router();

/* TODO: GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
	res.render('login', { title : 'Login' });
});

/* TODO: Investigate 
 - https://github.com/bnoguchi/everyauth
 - https://github.com/ncb000gt/node.bcrypt.js/
 */

/* POST login for users (should only be blog authors) */
router.post('/login', function(req, res, next) {
	User.getAuthenticated(req.body.username, req.body.password, function (err, user, reason) {
		if (err) {
			throw err;
		}

		// Login was successful if we have a user
		if (user) {
			req.session.userId = user._id;
			res.redirect('/admin');
			return;
		}

		var reasons = User.failedLogin;
		switch (reason) {
			case reasons.NOT_FOUND:
			case reasons.PASSWORD_INCORRECT:
				// Don't tell the user why the login failed, just that it did.
				break;
			case reasons.MAX_ATTEMPTS:
				// TODO: Send an email to the user to notify them that their account has been 
				//   temporarily locked.
				break;
		}
		res.send('Bad login credentials.');
	});
});

// TODO: Does this need to be wrapped in 'checkauth'?
router.get('/logout', function(req, res) {
	delete req.session.userId;
	res.redirect('/users/login');
});

module.exports = router;
