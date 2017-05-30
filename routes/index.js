(function () {
    var express = require('express');
    var blogDatabase = require('../data/blog-database');
    var checkAuth = require('./auth').checkAuth;
    var router = express.Router();

    var Article = blogDatabase.Article;
    var Category = blogDatabase.Category;

    const default_meta = {
            title : 'Blog | Robert Mitchell',
            description : "I write to investigate the Good, the Beautiful, the Simple, the Sublime, and the Just, in order to better understand what wisdom is, what a good education is, and what a good life is.",
            url : 'https://www.hrodebert.com/',
            type : 'blog',
            image : 'http://www.hrodebert.com/img/favicon.png',
            image_secure_url : 'https://www.hrodebert.com/img/favicon.png',
            image_width : '556',
            image_height : '554',
            twitter_site : '@RobertMitchel_l',
            twitter_card : 'summary'
    };

    function getMetaForArticle(articleName, callback) {
        var correctedName = articleName.split('-').join(' ');
        Article.find().public().byTitle(correctedName).exec(function (err, articles) {
            if (articles === []) {
                /* No such article exists, so send the default meta for the site. */
                console.log("Couldn't find the desired article: " + correctedName);
                callback(default_meta);
                return;
            }
            const article = articles[0];
            /* The description should be the first sentence of the article, with any wrapping HTML tags trimmed. */
            /* TODO: Determine whether HTML is supported in Open Graph meta tags and Twitter card meta tags. */
            var snippet = new RegExp("^([^.!?。]+.)").exec(article.content)[0];
            if (snippet.indexOf('<p>') === 0) {
                snippet = snippet.substring('<p>'.length);
            }
            if (snippet.indexOf('<blockquote>') === 0) {
                snippet = snippet.substring('<blockquote>'.length);
            }
            callback({
                title : article.title + (article.category != 'Miscellany' ? ' | ' + article.category : ''),
                description : snippet.trim(),
                url : 'https://www.hrodebert.com/articles/' + article.title,
                type : 'blog',
                image : 'http://www.hrodebert.com/' + article.image,
                image_secure_url : 'https://www.hrodebert.com/' + article.image,
                image_width : article.image_dimensions.width,
                image_height : article.image_dimensions.height,
                twitter_site : '@RobertMitchel_l',
                twitter_card : 'summary'
            });
        });
    }

    function getMetaForCategory(categoryName, callback) {
        Category.find().public().byName(categoryName).exec(function (err, categories) {
            if (categories === []) {
                /* No such category exists, so send the default meta for the site. */
                console.log("Couldn't find the desired category: " + categoryName);
                callback(default_meta);
            }
            const category = categories[0];
            var name = category.name;
            if (name === 'Everything') {
                name = 'Latest Articles';
            }
            callback({
                title : name + ' | Robert Mitchell',
                description : category.aboutAuthor,
                url : "https://www.hrodebert.com/article-list/" + category.name,
                type : 'blog',
                image : 'http://www.hrodebert.com/' + category.image,
                image_secure_url : 'https://www.hrodebert.com/' + category.image,
                image_width : category.image_dimensions.width,
                image_height : category.image_dimensions.height,
                twitter_site : '@RobertMitchel_l',
                twitter_card : 'summary'
            });
        });
    }

    /**
     * GET the home page.
     * Renders the home page for the whole blog, which is distinct from the home page for the admin panel.
     * The page is formatted according to index.jade, and is a completely separate AngularJS app from that of the admin
     * panel site.
     */
    router.get('/', function (req, res, next) {
        res.render('index', default_meta);
    });

    /**
     * GET the about page.
     * Renders the about page with the proper meta tags for SEO.
     */
    router.get('/about', function (req, res, next) {
        res.render('index', {
            title : 'About | Robert Mitchell',
            description : "I write to investigate the Good, the Beautiful, the Simple, the Sublime, and the Just, in order to better understand what wisdom is, what a good education is, and what a good life is.",
            url : 'https://www.hrodebert.com/about',
            type : 'blog',
            image : 'http://www.hrodebert.com/img/Me.jpg',
            image_secure_url : 'https://www.hrodebert.com/img/Me.jpg',
            image_width : '638',
            image_height : '638',
            twitter_site : '@RobertMitchel_l',
            twitter_card : 'summary'
        });
    });

    /**
     * GET the article-list page with default filters.
     * Renders the article-list page with the proper meta tags for SEO.
     */
    router.get('/article-list', function (req, res, next) {
        res.render('index', {
            title : 'Latest Articles | Robert Mitchell',
            description: 'Description'
        });
    });

    /**
     * GET the article-list page with default filters.
     * Renders the article-list page with the proper meta tags for SEO.
     */
    router.get('/article-list/:category', function (req, res, next) {
        getMetaForCategory(req.params.category, function (meta) {
            res.render('index', meta);
        });
    });

    /**
     * GET the article-list page with default filters.
     * Renders the article-list page with the proper meta tags for SEO.
     */
    router.get('/article-list/:category/:authorName', function (req, res, next) {
        res.render('index', {
            title : req.params.authorName + ' | ' + req.params.category + ' | Robert Mitchell',
            description: 'Description'
        });
    });

    /**
     * GET the article-list page with default filters.
     * Renders the article-list page with the proper meta tags for SEO.
     */
    router.get('/article-list/:category/:startDate/:endDate', function (req, res, next) {
        res.render('index', {
            title : 'Latest Articles | Robert Mitchell',
            description: 'Description'
        });
    });

    /**
     * GET the article-list page with default filters.
     * Renders the article-list page with the proper meta tags for SEO.
     */
    router.get('/article-list/:category/:authorName/:startDate/:endDate', function (req, res, next) {
        res.render('index', {
            title : 'Latest Articles | Robert Mitchell',
            description: 'Description'
        });
    });

    /**
     * GET the article by the given name
     * Renders the article with the given name with the proper meta tags for SEO.
     */
    router.get('/articles/:title', function (req, res, next) {
        // TODO: Pull the article from the database and render the appropriate meta tags.
        getMetaForArticle(req.params.title, function (meta) {
            res.render('index', meta);
        });
    });

    /**
     * GET the admin page.
     * Renders the home page for the admin panel, which is distinct from the home page for the normal blog.
     * The page is formatted according to admin.jade, and is a completely separate AngularJS app from that of the public
     * site.
     */
    router.get('/admin', checkAuth, function (req, res, next) {
        res.render('admin', {title: 'Admin'});
    });


    module.exports = router;
})();
