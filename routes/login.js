var express = require('express');
var router = express.Router();

var connection = require('../mysql.js');
var hash = require('password-hash');

/* Login Page */
router.get('/', function(req, res){
    req.session.attempt = 1;
    res.render('login', { title: 'Login | Pixl Gate', loginFail: false, showGame: false });
});

/* Login Page */
router.post('/', function(req, res){

    if(connection) {

        connection.query('SELECT `email`,`password`,`fname`,`sname`,`created`,`id` FROM `users_table` WHERE email = ' + connection.escape(req.body.email), function(err, result){

            if(result.length > 0) {
                if(hash.verify(req.body.password, result[0].password)) {

                    req.session.userID = result[0].id;
                    req.session.fullName = result[0].fname +' '+ result[0].sname;
                    req.session.firstName = result[0].fname;
                    req.session.lastName = result[0].sname;
                    req.session.joined = result[0].created.toString().slice(0, 24).replace('T', ' ');
                    req.session.isLoggedIn = true;
                    delete req.session.attempt;
                    res.redirect('/user');

                } else {
                    req.session.attempt++;
                    res.render('login', {title: 'Login Failed | Pixl Gate', loginFail: true, showGame: false, attempt: req.session.attempt});
                }
            } else {
                req.session.attempt++;
                res.render('login', {title: 'Login Failed | Pixl Gate', loginFail: true, showGame: false, attempt: req.session.attempt});
            }
        });
    }
});

module.exports = router;
