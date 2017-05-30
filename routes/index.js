(function () {
    var express = require('express');
    var blogDatabase = require('../data/blog-database');
    var checkAuth = require('./auth').checkAuth;
    var router = express.Router();

    var Article = blogDatabase.Article;
    var Category = blogDatabase.Category;

    function getMetaForArticle(articleName, callback) {
        Article.find().byName(articleName).exec(function (article) {
            var meta = {
                title : article.title,
                description : ''
            };
            // TODO: Finish filling out the meta for og:___ and twitter:___
            callback(meta);
        });
    }

    /**
     * GET the home page.
     * Renders the home page for the whole blog, which is distinct from the home page for the admin panel.
     * The page is formatted according to index.jade, and is a completely separate AngularJS app from that of the admin
     * panel site.
     */
    router.get('/', function (req, res, next) {
        res.render('index', {
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

        });
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
        res.render('index', {
            title : req.params.category + ' | Robert Mitchell',
            description: 'Description'
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
