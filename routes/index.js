var express = require('express');
var checkAuth = require('./auth').checkAuth;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Robert Mitchell' });
});

router.get('/admin', checkAuth, function(req, res, next) {
  res.render('admin', { title : 'Admin' });
});



module.exports = router;
