var express = require('express');
var path = require('path');
var blogDatabase = require('../data/blog-database');
var checkAuth = require('./auth').checkAuth;
var router = express.Router();

var Article = blogDatabase.Article;
var Category = blogDatabase.Category;

/**
 *
 * @param res
 * @returns {sendData}
 */
function callback(res) {
    return function sendData(err, data) {
        if (err) {
            console.log(err);
            res.send(500, {error: err});
        } else {
            res.json(data);
        }
    };
}

/*
 Blog article related API.
 */

/* GET list of all public articles */
/**
 *
 */
router.get('/article-list', function (req, res, next) {
    Article.find().public().exec(callback(res));
});

/* GET list of all articles */
/**
 *
 */
router.get('/all-article-list', function (req, res, next) {
    Article.find().exec(callback(res));
});

/* GET public articles by category */
/**
 *
 */
router.get('/article-list/:category', function (req, res, next) {
    var category = req.params.category;
    if (category === 'Everything') {
        Article.find().public().exec(callback(res));
    } else {
        Article.find().public().byCategory(category).exec(callback(res))
    }
});

/* GET all articles by category */
/**
 *
 */
router.get('/all-article-list/:category', function (req, res, next) {
    var category = req.params.category;
    if (category === 'Everything') {
        Article.find().exec(callback(res));
    } else {
        Article.find().byCategory(category).exec(callback(res))
    }
});

/* GET list of public articles by category & author */
/**
 *
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

/* GET list of all articles by category & author */
/**
 *
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

/* GET list of articles by category between two dates */
/**
 *
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

/* GET list of all articles by category between two dates */
/**
 *
 */
router.get('/all-article-list/:category/:startDate/:endDate', function (req, res, next) {
    var category = req.params.category;
    var startDate = new Date();
    var endDate = new Date();

    startDate.setTime(parseInt(req.params.startDate));
    endDate.setTime(parseInt(req.params.endDate));

    // Validate the dates
    if (startDate.toString() !== 'Invalid Date' && endDate.toString() !== 'Invalid Date') {
        if (category === 'Everything') {
            Article.find().betweenDates(startDate, endDate).exec(callback(res));
        } else {
            Article.find().byCategory(category).betweenDates(startDate, endDate).exec(callback(res));
        }
    }
});

/* GET a public article by article-id */
/**
 *
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

/* GET any article by article-id */
/**
 *
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

/* POST articles to the database, requiring authorization */
/**
 *
 */
router.post('/post-article', checkAuth, function (req, res, next) {
    var article = req.body;

    // TOOD: Validate the contents of the article.
    //   Validate all of: title, author (name & email), date, content, comments.
    //     ^^ Should be done because of the Schema. Only email needs validation.

    var dbArticle = new Article(article);

    dbArticle.save(function (err, article) {
        if (err) {
            res.send(500, {error: err});
        } else {
            res.json({'Ok': article});
        }
    });
});

/* PUT update articles in the database, by id, requiring authorization 
 NOTE: Attempting to update comments via this api will overwrite
 all existing comments. */
/**
 *
 */
router.put('/update-article/:id', checkAuth, function (req, res, next) {
    var articleId = req.params.id;

    var updates = req.body;

    // TODO: Validate updates.

    Article.findOneAndUpdate({_id: articleId}, updates, {new: true},
        function (err, article) {
            if (err) {
                res.send(500, {error: err});
            } else {
                res.json({'Success': article});
            }
        });
});

/* DELETE remove an article and all associated comments by article id,
 requiring authorization. */
/**
 *
 */
router.delete('/remove-article/:id', checkAuth, function (req, res, next) {
    var articleId = req.params.id;

    Article.findById(articleId).remove().exec(callback(res));
});

/*
 Blog Category related API
 */

/* GET a list of all public categories, with descriptions. */
/**
 *
 */
router.get('/category-list', function (req, res, next) {
    Category.find().public().exec(callback(res));
});

/* GET a list of all categories, with descriptions. */
/**
 *
 */
router.get('/all-category-list', function (req, res, next) {
    Category.find().exec(callback(res));
});

/* GET a specific public category by name */
/**
 *
 */
router.get('/get-category/:name', function (req, res, next) {
    var name = req.params.name;

    // TODO: Validate name.
    if (name === 'Everything') {
        Category.find().public().exec(callback(res));
    } else {
        Category.find().public().byName(name).exec(callback(res));
    }
});


/* GET a specific category by name */
/**
 *
 */
router.get('/get-private-category/:name', function (req, res, next) {
    var name = req.params.name;

    // TODO: Validate name.
    if (name === 'Everything') {
        Category.find().exec(callback(res));
    } else {
        Category.find().byName(name).exec(callback(res));
    }
});

/* POST a new category to the database */
/**
 *
 */
router.post('/post-category', checkAuth, function (req, res, next) {
    var category = req.body;

    console.log(category);

    // TODO: validate category data.
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

/* PUT updates to a specific category by ID */
/**
 *
 */
router.put('/update-category/:id', checkAuth, function (req, res, next) {
    var id = req.params.id;

    // TODO: validate updates & id.
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

/* DELETE a category by id */
/**
 *
 */
router.delete('/remove-category/:id', function (req, res, next) {
    var id = req.params.id;

    // TODO: validate id.

    Category.findById(id).remove().exec(callback(res));
});

module.exports = router;
