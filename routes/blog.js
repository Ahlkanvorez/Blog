var express = require('express');
var path = require('path');
var blogDatabase = require('../data/blog-database');
var checkAuth = require('./auth').checkAuth;
var router = express.Router();

var Article = blogDatabase.Article;
var Category = blogDatabase.Category;

/**
 * A simple helper factory for callback functions which send the resulting data as JSON to the client, or log an error
 * upon erring.
 *
 * @param res The response passed into the router function, and here captured via a closure for use in the callback.
 * @returns a lambda which takes the potential error and the data to send to the client, and sends them on the response
 *          object from the calling router.
 */
function callback(res) {
    return function sendData(err, data) {
        if (err) {
            console.log(err); /* This will be output into server.log, since all console output is piped thereto. */
            res.send(500, {error: err});
        } else {
            res.json(data);
        }
    };
}

/*
 * Blog article related API.
 */

/**
 * GET a list of all public articles, as a JSON array of objects.
 */
router.get('/article-list', function (req, res, next) {
    Article.find().public().exec(callback(res));
});

/**
 * GET a list of all articles, public or private, as a JSON array of objects.
 *
 * TODO: Determine whether this should be protected by checkAuth or not.
 */
router.get('/all-article-list', function (req, res, next) {
    Article.find().exec(callback(res));
});

/**
 * GET a list of all public articles in the given category (which can be either a plain String, or a regex pattern),
 * as a JSON array of objects. Note, that '/article-list/Everything' is equivalent to '/article-list'
 */
router.get('/article-list/:category', function (req, res, next) {
    var category = req.params.category;
    if (category === 'Everything') {
        Article.find().public().exec(callback(res));
    } else {
        Article.find().public().byCategory(category).exec(callback(res))
    }
});

/**
 * GET a list of all articles, public or private, in the given category (which can be either a plain String, or a regex
 * pattern), as a JSON array of objects. Note that '/all-article-list/Everything' is equivalent to '/all-article-list'
 *
 * TODO: Determine whether this should be protected by checkAuth or not.
 */
router.get('/all-article-list/:category', function (req, res, next) {
    var category = req.params.category;
    if (category === 'Everything') {
        Article.find().exec(callback(res));
    } else {
        Article.find().byCategory(category).exec(callback(res))
    }
});

/**
 * GET a list of all public articles in the given category by the specified author (which can both be either a plain
 * String, or a regex pattern), as a JSON array of objects. Note that if no particular category is desired,
 * '/article-list/Everything/:author' will return all public articles of any category by the specified author.
 * Also note, that '/article-list/Everything/Everything' is equivalent to '/article-list', and that
 * '/article-list/:category/Everything' is equivalent to '/article-list/:category'.
 */
router.get('/article-list/:category/:author', function (req, res, next) {
    var category = req.params.category;
    var author = req.params.author;

    // TODO: validate params
    if (category === 'Everything') {
        Article.find().public().byAuthor(author).exec(callback(res));
    } else if (author === 'Everything') {
        Article.find().public().byCategory(category).exec(callback(res));
    } else {
        Article.find().public().byCategory(category).byAuthor(author).exec(callback(res));
    }
});

/**
 * GET a list of all articles, public or private, in the given category by the specified author (which can both be
 * either a plain String, or a regex pattern), as a JSON array of objects. Note that if no particular category is
 * desired, '/all-article-list/Everything/:author' will return all articles of any category by the specified author.
 * Also note, that '/all-article-list/Everything/Everything' is equivalent to '/all-article-list', and that
 * '/all-article-list/:category/Everything' is equivalent to '/all-article-list/:category'.
 *
 * TODO: Determine whether this should be protected by checkAuth or not.
 */
router.get('/all-article-list/:category/:author', function (req, res, next) {
    var category = req.params.category;
    var author = req.params.author;

    // TODO: validate params
    if (category === 'Everything') {
        Article.find().byAuthor(author).exec(callback(res));
    } else if (author === 'Everything') {
        Article.find().byCategory(category).exec(callback(res));
    } else {
        Article.find().byCategory(category).byAuthor(author).exec(callback(res));
    }
});

/**
 * GET a list of all public articles in the given category (which can be either a plain String, or a regex pattern)
 * between the two specified dates, inclusive for the first date, and exclusive for the second date, as a JSON array of
 * objects. Note, that '/article-list/Everything/:startDate/:endDate' will return all public articles between the
 * specified dates, of all categories.
 */
router.get('/article-list/:category/:startDate/:endDate', function (req, res, next) {
    var category = req.params.category;
    var startDate = new Date();
    var endDate = new Date();

    startDate.setTime(parseInt(req.params.startDate));
    endDate.setTime(parseInt(req.params.endDate));

    // Validate the dates
    if (startDate.toString() !== 'Invalid Date' && endDate.toString() !== 'Invalid Date') {
        if (category === 'Everything') {
            Article.find().public().betweenDates(startDate, endDate).exec(callback(res));
        } else {
            Article.find().public().byCategory(category).betweenDates(startDate, endDate).exec(callback(res));
        }
    }
});

/**
 * GET a list of all articles, public or private, in the given category (which can be either a plain String, or a regex
 * pattern) between the two specified dates, inclusive for the first date, and exclusive for the second date, as a JSON
 * array of objects. Note, that '/all-article-list/Everything/:startDate/:endDate' will return all articles between the
 * specified dates, of all categories.
 *
 * TODO: Determine whether this should be protected by checkAuth or not.
 */
router.get('/all-article-list/:category/:startDate/:endDate', function (req, res, next) {
    var category = req.params.category;
    var startDate = new Date();
    var endDate = new Date();

    startDate.setTime(parseInt(req.params.startDate));
    endDate.setTime(parseInt(req.params.endDate));

    /* Ensure the dates are valid. */
    if (startDate.toString() !== 'Invalid Date' && endDate.toString() !== 'Invalid Date') {
        if (category === 'Everything') {
            Article.find().betweenDates(startDate, endDate).exec(callback(res));
        } else {
            Article.find().byCategory(category).betweenDates(startDate, endDate).exec(callback(res));
        }
    }
});

/**
 * GET the unique public article with the specified ID, as a JSON object. Note, that unlike the other handles in this
 * REST API, this one does NOT return a JSON Array.
 */
router.get('/get-article/:id', function (req, res, next) {
    var articleId = req.params.id;

    Article.find().public().byId(articleId).exec(function (err, docs) {
        if (err || docs.length == 0) {
            res.send(500, {error: err});
        } else {
            res.json(docs[0]);
        }
    });
});

/**
 * Get the unique article, public or private, with the specified ID, as a JSON object. Note, that unlike the other
 * handles in this REST API, this one does NOT return a JSON Array.
 *
 * TODO: Determine whether this should be protected by checkAuth or not.
 */
router.get('/get-private-article/:id', function (req, res, next) {
    var articleId = req.params.id;

    Article.find().byId(articleId).exec(function (err, docs) {
        if (err || docs.length == 0) {
            res.send(500, {error: err});
        } else {
            res.json(docs[0]);
        }
    });
});

/**
 * POST the provided article to the database. The article must be provided as a JSON object. For more information on the
 * possible fields in an article, see the articleSchema in article.model.js
 *
 * Note, that this handle requires the user be logged in, and will not be called unless proper authentication succeeds.
 * For more on that process, see auth.js, user.js, and user.model.js
 */
router.post('/post-article', checkAuth, function (req, res, next) {
    var article = req.body;

    /* TODO: Validate the contents of the article.
     *   Validate all of: title, author (name & email), date, content, comments.
     *     ^^ Should be done because of the Schema. Only email needs validation.
     */

    var dbArticle = new Article(article);

    dbArticle.save(function (err, article) {
        if (err) {
            res.send(500, {error: err});
        } else {
            res.json({'Ok': article});
        }
    });
});

/**
 * PUT updates the unique article with the provided ID, by overwriting fields in the database which are provided in the
 * update object. Updates must be provided as a JSON Object. For more information on the possible fields in an article,
 * see the articleSchema in article.model.js
 *
 * Note, that this handle requires the user be logged in, and will not be called unless proper authentication succeeds.
 * For more on that process, see auth.js, user.js, and user.model.js
 */
router.put('/update-article/:id', checkAuth, function (req, res, next) {
    var articleId = req.params.id;

    var updates = req.body;

    /* TODO: Validate updates. */

    Article.findOneAndUpdate({_id: articleId}, updates, {new: true},
        function (err, article) {
            if (err) {
                res.send(500, {error: err});
            } else {
                res.json({'Success': article});
            }
        });
});

/**
 * DELETE the unique article with the provided ID. Note that this operation cannot be undone, and when requested in the
 * admin portal is protected by confirmation fields.
 *
 * Note, that this handle requires the user be logged in, and will not be called unless proper authentication succeeds.
 * For more on that process, see auth.js, user.js, and user.model.js
 */
router.delete('/remove-article/:id', checkAuth, function (req, res, next) {
    var articleId = req.params.id;

    Article.findById(articleId).remove().exec(callback(res));
});

/*
 Blog Category related API
 */

/**
 * GET a list of all public categories, as a JSON array of objects.
 */
router.get('/category-list', function (req, res, next) {
    Category.find().public().exec(callback(res));
});

/**
 * GET a list of all categories, public or private, as a JSON array of objects.
 *
 * TODO: Determine whether this should be protected by checkAuth or not.
 */
router.get('/all-category-list', function (req, res, next) {
    Category.find().exec(callback(res));
});

/**
 * GET a list of all public categories with names matching the provided name (which can be either a plain String, or a
 * regex pattern), as a JSON array of objects. Note that '/get-category/Everything' is the unique category which
 * technically does not contain any articles, but is used to represent the category of all articles.
 */
router.get('/get-category/:name', function (req, res, next) {
    var name = req.params.name;

    /* TODO: Validate name. */
    if (name === 'Everything') {
        Category.find().public().exec(callback(res));
    } else {
        Category.find().public().byName(name).exec(callback(res));
    }
});


/**
 * GET a list of all categories, public or private, with names matching the provided name (which can be either a plain
 * String, or a regex pattern), as a JSON array of objects. Note that '/get-private-category/Everything' is the unique
 * category which technically does not contain any articles, but is used to represent the category of all articles.
 *
 * TODO: Determine whether this should be protected by checkAuth or not.
 */
router.get('/get-private-category/:name', function (req, res, next) {
    var name = req.params.name;

    /* TODO: Validate name. */
    if (name === 'Everything') {
        Category.find().exec(callback(res));
    } else {
        Category.find().byName(name).exec(callback(res));
    }
});

/**
 * POST the provided category to the database. The category must be provided as a JSON object. For more information on
 * the possible fields in a category, see the categorySchema in category.model.js
 *
 * Note, that this handle requires the user be logged in, and will not be called unless proper authentication succeeds.
 * For more on that process, see auth.js, user.js, and user.model.js
 */
router.post('/post-category', checkAuth, function (req, res, next) {
    var category = req.body;

    /* TODO: validate category data. */
    var dbCategory = new Category(category);

    dbCategory.save(function (err) {
        if (err) {
            res.send(500, {error: err});
        } else {
            category._id = dbCategory._id;
            res.json({'Ok': category});
        }
    });
});

/**
 * PUT updates the unique category with the provided ID, by overwriting fields in the database which are provided in the
 * update object. Updates must be provided as a JSON Object. For more information on the possible fields in a category,
 * see the categorySchema in category.model.js
 *
 * Note, that this handle requires the user be logged in, and will not be called unless proper authentication succeeds.
 * For more on that process, see auth.js, user.js, and user.model.js
 */
router.put('/update-category/:id', checkAuth, function (req, res, next) {
    var id = req.params.id;

    /* TODO: validate updates & id. */
    var updates = req.body;

    Category.findById(id, function (err, doc) {
        if (err) {
            res.send(500, {error: err});
        } else {
            doc.name = updates.name;
            doc.private = updates.private;
            doc.description = updates.description;
            doc.aboutAuthor = updates.aboutAuthor;

            doc.save(function (err) {
                if (err) {
                    res.send(500, {error: err});
                } else {
                    res.json(doc);
                }
            });
        }
    });
});

/**
 * DELETE the unique category with the provided ID. Note that this operation cannot be undone, and when requested in the
 * admin portal is protected by confirmation fields.
 *
 * Note, that this handle requires the user be logged in, and will not be called unless proper authentication succeeds.
 * For more on that process, see auth.js, user.js, and user.model.js
 */
router.delete('/remove-category/:id', checkAuth, function (req, res, next) {
    var id = req.params.id;

    /* TODO: validate id. */

    Category.findById(id).remove().exec(callback(res));
});

/**
 * Exports the above implemented routes so they can be used by the app server.
 */
module.exports = router;
