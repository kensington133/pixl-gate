var express = require('express');
var router = express.Router();

/* GET register page. */
router.get('/register', function(req, res) {
  res.render('register/index', { title: 'Register | Pixl Gate' });
});

module.exports = router;
