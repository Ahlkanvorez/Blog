(function () {
    const express = require('express');
    const path = require('path');
    const blogDatabase = require('../data/blog-database');
    const checkAuth = require('./auth').checkAuth;
    const router = express.Router();

    const Article = blogDatabase.Article;
    const Category = blogDatabase.Category;

    const angular2Template = path.resolve(__dirname, '..', 'public', 'dist', 'index.html');

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

    const getMetaForArticle = function getMetaForArticle(articleName, callback) {
        var correctedName = articleName.split('-').join(' ');
        Article.find().public().byTitle(correctedName).exec(function (err, articles) {
            if (articles === []) {
                /* No such article exists, so send the default meta for the site. */
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
                title : article.title + (article.category !== 'Miscellany' ? ' | ' + article.category : ''),
                description : snippet.trim(),
                url : 'https://www.hrodebert.com/articles/' + article.title,
                type : 'blog',
                image : 'http://www.hrodebert.com/' + (article.image || 'img/favicon.png'),
                image_secure_url : 'https://www.hrodebert.com/' + (article.image || 'img/favicon.png'),
                image_width : article.image_dimensions.width || default_meta.image_width,
                image_height : article.image_dimensions.height || default_meta.image_height,
                twitter_site : '@RobertMitchel_l',
                twitter_card : 'summary'
            });
        });
    };

    const getMetaForCategory = function getMetaForCategory(categoryName, callback) {
        if (!categoryName) {
            categoryName = 'Everything';
        }
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
                image : 'http://www.hrodebert.com/' + (category.image || 'img/favicon.png'),
                image_secure_url : 'https://www.hrodebert.com/' + (category.image || 'img/favicon.png'),
                image_width : category.image_dimensions.width || default_meta.image_width,
                image_height : category.image_dimensions.height || default_meta.image_height,
                twitter_site : '@RobertMitchel_l',
                twitter_card : 'summary'
            });
        });
    };

    /**
     * GET the home page.
     * Renders the home page for the whole blog, which is distinct from the home page for the admin panel.
     * The page is formatted according to index.jade, and is a completely separate AngularJS app from that of the admin
     * panel site.
     */
    router.get('/', function (req, res, next) {
        // res.render('index', default_meta);
        res.renderFile(angular2Template, default_meta);
    });

    /**
     * GET the about page.
     * Renders the about page with the proper meta tags for SEO.
     */
    router.get('/about', function (req, res, next) {
        // res.render('index', {
        res.renderFile(angular2Template, {
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
        const meta = JSON.parse(JSON.stringify(default_meta));
        meta.title = 'Latest Articles | Robert Mitchell';
        meta.url = 'https://www.hrodebert.com/article-list';
        // res.render('index', meta);
        res.renderFile(angular2Template, meta);
    });

    /**
     * GET the article-list page with default filters.
     * Renders the article-list page with the proper meta tags for SEO.
     */
    router.get('/article-list/:category', function (req, res, next) {
        getMetaForCategory(req.params.category, function (meta) {
            // res.render('index', meta);
            res.renderFile(angular2Template, meta);
        });
    });

    /**
     * GET the article-list page with default filters.
     * Renders the article-list page with the proper meta tags for SEO.
     */
    router.get('/article-list/:category/:author', function (req, res, next) {
        getMetaForCategory(req.params.category, function (meta) {
            meta.url = 'https://www.hrodebert.com/article-list/' + req.params.category + '/' + req.params.author;
            // res.render('index', meta);
            res.renderFile(angular2Template, meta);
        });
    });

    /**
     * GET the article-list page with default filters.
     * Renders the article-list page with the proper meta tags for SEO.
     */
    router.get('/article-list/:category/:startDate/:endDate', function (req, res, next) {
        getMetaForCategory(req.params.category, function (meta) {
            meta.url = 'https://www.hrodebert.com/article-list/' + req.params.category + '/' + req.params.startDate + '/' + req.params.endDate;
            // res.render('index', meta);
            res.renderFile(angular2Template, meta);
        });
    });

    /**
     * GET the article-list page with default filters.
     * Renders the article-list page with the proper meta tags for SEO.
     */
    router.get('/article-list/:category/:authorName/:startDate/:endDate', function (req, res, next) {
        getMetaForCategory(req.params.category, function (meta) {
            meta.url = 'https://www.hrodebert.com/article-list/' + req.params.category + '/' + req.params.authorName + '/' + req.params.startDate + '/' + req.params.endDate;
            // res.render('index', meta);
            res.renderFile(angular2Template, meta);
        });
    });

    /**
     * GET the article by the given name
     * Renders the article with the given name with the proper meta tags for SEO.
     */
    router.get('/articles/:title', function (req, res, next) {
        getMetaForArticle(req.params.title, function (meta) {
            // res.render('index', meta);
            res.renderFile(angular2Template, meta);
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
