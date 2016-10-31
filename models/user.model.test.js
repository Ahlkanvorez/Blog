(function () {
	var User = require('./user.model').User;

    // TODO: Use a real testing suite ...
	module.exports.test = function test() {
		// Create a new user
		var testUserObject = {
			username: 'joebob123',
			password: 'supersecret',
			email: 'cool@site.com'
		};

		// If the user is already in the db, remove him to re add (this is a test after all)
		User.find({username: testUserObject.username}).remove(function callback() {
			// Save user to database
			var testUser = new User(testUserObject);
			testUser.save(function (err) {
				if (err) {
					throw err;
				}

				User.getAuthenticated('joebob123', 'supersecret', function (err, user, reason) {
					if (err) {
						throw err;
					}
					// Login was successful if we have a user
					if (user) {
						// handle login success
						console.log('login success');
						return;
					}

					console.log(reason);

					var reasons = User.failedLogin;
					switch (reason) {
						case reasons.NOT_FOUND:
						case reasons.PASSWORD_INCORRECT:
							// Don't tell the user why the login failed, just that it did.
							console.log('failed');
							break;
						case reasons.MAX_ATTEMPTS:
							// Send an email to the user to notify them that their account has been
							//   temporarily locked.
							console.log('locked');
							break;
					}
					// Remove the test user to clean up.
					User.find({username: testUserObject.username}).remove();
				});
			});
		});
	};
})();