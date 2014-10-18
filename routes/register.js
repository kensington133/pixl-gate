var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res) {
  // res.render('index', { title: 'Express' });
  	res.send('Register page yo!');
});

module.exports = router;
