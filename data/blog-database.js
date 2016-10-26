(function () {
	var express = require('express');
	var mongoose = require('mongoose');
	var ArticleModel = require('../models/article.model');
	var CategoryModel = require('../models/category.model');
	var UserModel = require('../models/user.model');

	var Schema = mongoose.Schema;

	/* This is a simple wrapper for all the other Schema used
		by the database, collecting them in one place. */
	// Export the models.
	module.exports.Article = ArticleModel.Article
	module.exports.Category = CategoryModel.Category;
	module.exports.User = UserModel.User;

	// TODO: Look up where this is called and take away the 'function initialize()' wrapper.
	module.exports.initialize = function initialize() {

		// TODO: Remove before production: This is solely for testing.
		// require('../models/user.model.test').test();
	};
})();