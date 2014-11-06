var express = require('express');
var router = express.Router();

var mailServer = require("../email.js");
var connection = require('../mysql.js');

router.get('/', function(req, res){
    if(req.session.attempt) {
        delete req.session.attempt;
    }
    res.render('reset', { title: 'Password Reset | Pixl Gate', post: false });
});

router.post('/', function(req, res){
    var email = req.body.email;
    if(email) {

    	//message and way to reset TBD
        var message = {
            text: "Test reset email!",
            from: "Pixl Gate <pixl.gate.game@gmail.com>",
            to: "You <"+email+">",
            subject: "Pixl Gate - Testing"
        }

        connection.query('SELECT `id` FROM `users_table` WHERE `email`='+ connection.escape(email) +'', function(err, result) {

            if(result.length === 1) {

	            mailServer.send(message, function(error, message) {
		    		if(err) { console.log(error); }
		    		res.render('reset', { title: 'Password Reset', post: true, sent: true });
	       		});

            } else {
            	res.render('reset', { title: 'Password Reset', post: true, sent: false });
            }

            if(err) { throw err; }
        });

    }
});

module.exports = router;
