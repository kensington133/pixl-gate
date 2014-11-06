var express = require('express');
var router = express.Router();

var connection = require('../mysql.js');
var hash = require('password-hash');

router.get('/:tab?', function(req, res){

	console.log(req.params);
    console.log(req.params.tab);

    if(req.session.isLoggedIn === true) {
        var path = req.params.tab || 'profileinfo';
        res.render('user', { title: 'User Area | Pixl Gate', path: path , post: false, showGame: false });

    } else {
        res.redirect('/login');
    }
});

router.post('/:tab?', function(req, res){
    if(req.session.isLoggedIn === true) {

        if(connection) {

            var newPassword = hash.generate(req.body.password);
            connection.query('UPDATE `users_table` SET password='+ connection.escape(newPassword) +' WHERE `id`='+ req.session.userID +'', function(err, result) {

                if(result.affectedRows === 1){
                    res.render('user', { title: 'Password Updated | Pixl Gate', path: 'resetpassword', post: true ,updated: true, showGame: false});
                } else {
                    res.render('user', { title: 'Update Failed | Pixl Gate', path: 'resetpassword', post: true, updated: false, showGame: false });
                }

                if(err) { throw err; }
            });

        } else {
            console.error('Err: No Connection to MySQL Database for Password Rest Query');
        }
    } else {
        res.redirect('/login');
    }
});


module.exports = router;
