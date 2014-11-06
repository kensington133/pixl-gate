var express = require('express');
var router = express.Router();

router.get('/', function(req, res){

    if(req.session.isLoggedIn === true) {
       res.render('game', {title: 'Pixl Gate', showGame: true})
    } else {
        res.redirect('/login');
    }

});

module.exports = router;
