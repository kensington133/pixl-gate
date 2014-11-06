var express = require('express');
var router = express.Router();

var connection = require('../mysql.js');
var hash = require('password-hash');

/* GET register page. */
router.get('/', function(req, res) {
  res.render('register', { title: 'Register | Pixl Gate', showForm: true, showGame: false });
});

/* POST register page */
router.post('/', function(req, res) {

    if(connection) {
        //remove second password - not needed
        delete req.body.password2;
        //hash the password using the password-hash node module
        req.body.password = hash.generate(req.body.password);
        //mysql save user
        connection.query('INSERT INTO `users_table` SET ?', req.body ,function(err, result) {

        if(err) { throw err; }
        });
    } else {
        console.error('Err: No Connection to MySQL Database for Registration Query');
    }
    //after query - send back to registration page without form
    res.render('register', { title: 'Register | Pixl Gate', showForm: false, name: req.body.fname +' '+ req.body.sname, showGame: false });
});

module.exports = router;
