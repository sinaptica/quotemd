var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/create', function(req, res) {
  res.render('create');
});

module.exports = router;