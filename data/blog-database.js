(function () {
	var ArticleModel = require('../models/article.model');
	var CategoryModel = require('../models/category.model');
	var UserModel = require('../models/user.model');

	/* This is a simple wrapper for all the other Schema used
	 * by the database, collecting them in one place.
	 */

	/* Export the models. */
        module.exports.Article = ArticleModel.Article;
	module.exports.Category = CategoryModel.Category;
	module.exports.User = UserModel.User;
})();
