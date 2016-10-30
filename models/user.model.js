(function () {
    /*
     For origin of authentication implementation, see:
     - http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
     - http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
     And for general bcrypt reference, see: https://www.npmjs.com/package/bcrypt
     */

    var express = require('express');
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt');
    const saltWorkFactor = 10;

    // After five attempts, lock the account for two hours.
    const maxLoginAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000;

    var Schema = mongoose.Schema;

    // Define the contents of a User.
    var userSchema = new Schema({
        username: {
            type: String,
            required: true,
            index: {unique: true}
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            index: {unique: true}
        },
        loginAttempts: { // The number of consecutive login failures seen.
            type: Number,
            required: true,
            default: 0
        },
        lockUntil: { // A timestamp until which this account is locked.
            type: Number
        }
    });

    /* An enum for reasons why a login has failed.
     NOTE: This information should NOT BE EXPOSED TO THE USER. */
    var reasons = {
        NOT_FOUND: 0,
        PASSWORD_INCORRECT: 1,
        MAX_ATTEMPTS: 2
    };

    userSchema.static('failedLogin', reasons);

    userSchema.query.byName = function queryByName(name) {
        return this.find({username: new RegExp(name, 'i')});
    };

    userSchema.query.byEmail = function queryByEmail(email) {
        return this.find({email: new RegExp(email, 'i')});
    };

    userSchema.virtual('isLocked').get(function () {
        // Check for a future lockUntil timestamp; !! makes it either true or false.
        return !!(this.lockUntil && this.lockUntil > Date.now());
    });

    userSchema.pre('save', function (next) {
        var user = this;

        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password')) {
            return next();
        }

        // Generate a salt
        bcrypt.genSalt(saltWorkFactor, function (err, salt) {
            if (err) {
                return next(err);
            }

            // hash the password along with our new salt
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                // Override the cleartext password with the hashed one
                user.password = hash;
                next();
            })
        });
    });

    // Precondition: callback is of the form function callback(err, isMatch).
    userSchema.methods.comparePassword = function (givenPassword, callback) {
        bcrypt.compare(givenPassword, this.password, function (err, isMatch) {
            if (err) {
                return callback(error);
            }
            callback(null, isMatch);
        });
    };

    userSchema.methods.incLoginAttempts = function (callback) {
        // If a previous lock has expired, reset the number of attempts to 1.
        if (this.lockUntil && this.lockUntil < Date.now()) {
            return this.update({
                $set: {loginAttempts: 1},
                $unset: {lockUntil: 1}
            }, callback);
        }

        // Otherwise, we're incrementing
        var updates = {$inc: {loginAttempts: 1}};

        // Lock the account if we've reached max attempts and it's not already locked
        if (this.loginAttempts + 1 >= maxLoginAttempts && !this.isLocked) {
            updates.$set = {lockUntil: Date.now() + lockTime};
        }
        return this.update(updates, callback);
    };

    // Precondition: callback is of the form function callback(err, user, loginFailureReason).
    userSchema.static('getAuthenticated', function (name, password, callback) {
        // Search the database for the given user
        this.findOne({username: name}).exec(function (err, user) {
            if (err) {
                return callback(err);
            }

            console.log(user);

            // Make sure the user exists
            if (!user) {
                return callback(null, null, reasons.NOT_FOUND);
            }

            // Check if the account is currently locked
            if (user.isLocked) {
                console.log('User locked');
                // If it iss, just incrememt the login attempts.
                return user.incLoginAttempts(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, null, reasons.MAX_ATTEMPTS);
                });
            }

            // Test for a matching password
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                }

                // Check if the password was a match
                if (isMatch) {
                    // If there's no lock or failed attempts, just return the user
                    if (!user.loginAttempts && !user.lockUntil) {
                        return callback(null, user);
                    }

                    // Reset attempts and lock info
                    var updates = {
                        $set: {loginAttempts: 0},
                        $unset: {lockUntil: 1}
                    };

                    return user.update(updates, function (err) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, user);
                    });
                }

                // Otherwise, password is incorrect, so increment login attempts.
                user.incLoginAttempts(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, null, reasons.PASSWORD_INCORRECT);
                });
            });
        });
    });

    module.exports.User = mongoose.model('User', userSchema);
})();