var express = require('express');
var checkAuth = require('./auth').checkAuth;
var router = express.Router();

/**
 * GET the home page.
 * Renders the home page for the whole blog, which is distinct from the home page for the admin panel.
 * The page is formatted according to index.jade, and is a completely separate AngularJS app from that of the admin
 * panel site.
 */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Robert Mitchell'});
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
