(function () {
    /*
     * For the origin of this authentication implementation, see:
     * - http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
     * - http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
     * For additional reference on Bcryptjs, see: https://www.npmjs.com/package/bcryptjs
     */

    var express = require('express');
    var mongoose = require('mongoose');
    var bcrypt = require('bcryptjs');
    const saltWorkFactor = 10;

    /* After five attempts, lock the account for two hours. */
    const maxLoginAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000;

    var Schema = mongoose.Schema;

    /**
     * Defines the contents of a User, which has the capability to log into the admin section of the site, and create,
     * edit, and delete both articles and categories.
     * The 'username' attribute is used in the first field of the login form, and no two users can have the same
     * username.
     * The 'password' attribute is used in the second field of the login form, and can be any valid String, although
     * you have to be pretty dumb to use a simple password like 'password'. 'Paszw0rb' is much better, right? ... right?
     * The 'email' attribute is not used in the login form, but is used for notifying the user if their account has
     * been locked due to excessive login attempts. No two Users can have the same email.
     * The 'loginAttempts' attribute keeps track of the number of consecutive failed login attempts, not discriminating
     * between failed attempts for different reasons, and is used to indicate when a User ought to be locked out of the
     * login, when it exceeds five.
     * The 'lockUntil' attribute records the date and time after which a User should be unlocked. It is set to two hours
     * after the moment the User account is locked, and cannot be reset until that time period has expired.
     *
     * TODO: Create a page in the Admin panel for adding new users, so that only admins can make new users.
     */
    var userSchema = new Schema({
        username: {
            type: String,
            required: true,
            index: { unique: true }
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
        loginAttempts: {
            type: Number,
            required: true,
            default: 0
        },
        lockUntil: {
            type: Number
        }
    });

    /* An enum for reasons why a login has failed. NOTE: This information should NOT BE EXPOSED TO THE USER. */
    var reasons = {
        NOT_FOUND: 0,
        PASSWORD_INCORRECT: 1,
        MAX_ATTEMPTS: 2
    };

    /**
     * Adds the reasons enum as a static variable named 'failedLogin' of the User class, so it can be easily referenced
     * in all userSchema methods, virtuals, etc.
     *
     * TODO: Consider in-lining this definition.
     */
    userSchema.static('failedLogin', reasons);

    /**
     * Adds the Query Helper 'byName', which filters the User list and returns only those Users whose username match
     * the given regex pattern, or are equal to the given String if it is a plain string.
     *
     * @param name The regex pattern or username to use in filtering User objects by username.
     * @returns A list of Users whose username match the given pattern.
     */
    userSchema.query.byName = function queryByName(name) {
        return this.find({username: new RegExp(name, 'i')});
    };

    /**
     * Adds the Query Helper 'byEmail', which filters the User list and returns only those Users whose email match the
     * given regex pattern, or are equal to the given String if it is a plain string.
     *
     * @param email The regex pattern or email to use in filtering User objects by email.
     * @returns A list of Users whose email match the given pattern.
     */
    userSchema.query.byEmail = function queryByEmail(email) {
        return this.find({email: new RegExp(email, 'i')});
    };

    /**
     * Adds the Virtual Property Getter (which ipso facto does not persist in MongoDB) 'isLocked', which returns true if
     * the User on which it is invoked is locked, and false otherwise. Whether it is locked is determined by checking if
     * the 'lockUnitl' attribute is defined, and if it is, whether the Date contained therein is a later date than the
     * current time.
     */
    userSchema.virtual('isLocked').get(function () {
        /* Check for a future lockUntil timestamp; !! makes it either true or false. */
        return !!(this.lockUntil && this.lockUntil > Date.now());
    });

    /**
     * Defines a Pre-Hook for the 'save' method, which will be invoked just prior to 'save'. This hook checks whether
     * the 'password' attribute of the User has been edited, and if it has, it creates a new hash of that password with
     * a newly calculated salt, and overwrites the 'password' attribute of the User, so that when it is saved, only the
     * new hash is saved, and not the plaintext password.
     */
    userSchema.pre('save', function (next) {
        /* Because this is invoked on the User object, 'this' refers to that User object on which it is invoked.
         * So we save a reference to this for use within the closures below.
         */
        var user = this;

        /* If the password of this user has not been modified, then there's no need to hash it, so return to the
         * next function call (which, since there are no other Pre-Hooks for 'save', will be the 'save' method.)
         */
        if (!user.isModified('password')) {
            return next();
        }

        /* Generates a new salt for each hash, to decrease the probability that password hashes appear in precomputed
         * hash tables. After generating that salt, the password is hashed with the salt, and the User object has its
         * 'password' attribute overwritten with the hash, so that the database stores only the hash, not the plaintext
         * password. Because this is occurring prior to the 'save' methods invocation, the database will never have a
         * non-hashed password saved in it.
         */
        bcrypt.genSalt(saltWorkFactor, function (err, salt) {
            if (err) {
                return next(err);
            }

            /* Use the newly created salt to assist in hashing the given password, then overwrite the User's 'password'
             * attribute to be equal to the newly calculated hash, saving that to the database.
             */
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                /* Overwrite the plaintext password with the hash of that password and the salt, so that the database
                 * does not contain the password for security purposes.
                 */
                user.password = hash;
                next();
            });
        });
    });

    /**
     * Compares the given password to the hash of the password stored in the database for the User object on which this
     * method is invoked, then invokes the callback given, either with an error in the event an error occurs, or with
     * null for the error parameter, and a boolean of true if the given password matches the hash in the database, and
     * false otherwise.
     *
     * @param givenPassword The password to check against the hash stored in the database for the invoking User object
     * @param callback a function of the form callback(err, isMatch), to be invoked upon either erring or determining
     *        whether the given password matches the hash stored in the database for the invoking User object.
     */
    userSchema.methods.comparePassword = function (givenPassword, callback) {
        bcrypt.compare(givenPassword, this.password, function (err, isMatch) {
            if (err) {
                return callback(err);
            }
            // TODO: Determine if this needs to be returned.
            callback(null, isMatch);
        });
    };

    /**
     * This method increments the 'loginAttempts' attribute of the User on which it is invoked, if the User is not
     * currently locked. If the user was locked, but that lock has expired, the 'loginAttempts' attribute is reset to 1,
     * and the 'lockUntil' attribute is unset to ensure the account is unlocked.
     *
     * @param callback Passed to the update method when updating this User object to increment lockUntil.
     * @returns The query object resulting from calling update on the User object on which this method is invoked, with
     *          the given callback passed as an argument.
     */
    userSchema.methods.incLoginAttempts = function (callback) {
        /* If this User has a defined lockUntil date, and it has already passed, then the account should not be locked,
         * so reset the loginAttempts attribute to 1 (accounting for this attempt), and unset the lockUntil date to
         * ensure that the User is unlocked, then return the query resulting from updating the user with the given
         * callback.
         */
        if (this.lockUntil && this.lockUntil < Date.now()) {
            return this.update({
                $set: {loginAttempts: 1},
                $unset: {lockUntil: 1}
            }, callback);
        }

        /* Otherwise, create an object representing the updates to perform, which will
         * increment the loginAttempts attribute by 1.
         */
        var updates = {$inc: {loginAttempts: 1}};

        /* If incrementing the loginAttempts attribute will make it exceed the maxLoginAttempts constant, and the
         * User is not already locked, then add an additional update to set the lockUntil attribute to a time which is
         * lockTime ahead of the current time.
         */
        if (this.loginAttempts + 1 >= maxLoginAttempts && !this.isLocked) {
            updates.$set = {lockUntil: Date.now() + lockTime};
        }
        return this.update(updates, callback);
    };

    /**
     * Attempts to process a login attempt, by checking the validity of the given username, whether the desired User is
     * locked out or able to login, and whether the given password is equal to that from which the hash associated with
     * this User was generated. If unsuccessful, the failed login attempt is recorded, and if needed the User is locked
     * out of logging in for a set time, or either an error or a reason for failure will be given to the callback;
     * and if successful, then the desired User object is given to the callback.
     *
     * @param name The username of the User to be authenticated.
     * @param password the password to check for authentication.
     * @param callback a function of the form callback(error, user, reasonForLoginFailure)
     */
    userSchema.static('getAuthenticated', function (name, password, callback) {
        /* Searches the database for a User of the specified username.
         * If an error occurs, fail authentication by invoking the callback to handle the error and return.
         * If no such user exists, fail authentication by invoking the callback and telling it that no such user exists.
         * If such a user exists, but it is locked, fail authentication by invoking the callback and tell it that.
         * Otherwise, check the password.
         */
        this.findOne({ username : name }).exec(function (err, user) {
            if (err) {
                return callback(err);
            }

            console.log('Login attempt from:', user);

            /* If no such User exists, fail authentication. */
            if (!user) {
                return callback(null, null, reasons.NOT_FOUND);
            }

            /* If the User is locked, fail authentication. */
            if (user.isLocked) {
                console.log('User locked');
                return user.incLoginAttempts(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, null, reasons.MAX_ATTEMPTS);
                });
            }

            /* Compare the given password against the hash stored in the database. */
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                }

                /* The isMatch parameter is provided by comparePassword(...), which will be true if the given password
                 * is equal to that from which the hash stored in the database was generated.
                 */
                if (isMatch) {
                    /* If the User isn't locked, and has no logged attempts, just give the user to the callback and
                     * return.
                     */
                    if (!user.loginAttempts && !user.lockUntil) {
                        return callback(null, user);
                    }

                    /* Otherwise, make sure to reset the User to a state with no loginAttempts, and unset the lockUntil
                     * date to make sure the account won't be accidentally locked if they log out and have a failed
                     * attempt logging back in.
                     */
                    var updates = {
                        $set: {loginAttempts: 0},
                        $unset: {lockUntil: 1}
                    };

                    /* Push the updates to the database, then pass the User to the callback and return. */
                    return user.update(updates, function (err) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, user);
                    });
                }

                /* If the password was incorrect, then increment the number of attempted logins, and lock the User if
                 * needed.
                 */
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
