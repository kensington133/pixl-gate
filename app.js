var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var hash = require('password-hash');

var connection = require('./mysql.js');

// var passport = require('passport');
// var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'pixl-gate'}));
app.use(express.static(path.join(__dirname, 'public')));

//ROUTING
/* Allowing access to session variables in templates */
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

/* Home Page. */
app.get('/', function(req, res) {
  res.render('index', { title: 'Welcome | Pixl Gate' });
});

/* Register Page. */
app.get('/register', function(req, res) {
  res.render('register', { title: 'Register | Pixl Gate', showForm: true });
});

/* Register Page. */
app.post('/register', function(req, res) {

    if(connection) {
        //remove second password - not needed
        delete req.body.password2;
        //hash the password using the password-hash node module
        req.body.password = hash.generate(req.body.password);
        //mysql save user
        connection.query('INSERT INTO `users_table` SET ?', req.body ,function(err, result) {
        // console.log('Result: '+result);
        if(err) { throw err; }
        });
    } else {
        console.error('Err: No Connection to MySQL Database for Registration Query');
    }
    //after query - send back to registration page without form
    res.render('register', { title: 'Register | Pixl Gate', showForm: false, name: req.body.fname +' '+ req.body.sname });
});

/* Login Page */
app.get('/login', function(req, res){
    res.render('login', { title: 'Login | Pixl Gate', loginFail: false });
});

/* Login Page */
app.post('/login', function(req, res){

    if(connection) {
        connection.query('SELECT `email`,`password`,`fname`,`sname`,`created` FROM `users_table` WHERE email = ' + connection.escape(req.body.email), function(err, result){

            if(hash.verify(req.body.password, result[0].password)) {
                req.session.fullName = result[0].fname +' '+ result[0].sname;
                req.session.firstName = result[0].fname;
                req.session.lastName = result[0].sname;
                req.session.joined = result[0].created.toString().slice(0, 24).replace('T', ' ');
                req.session.isLoggedIn = true;
                res.redirect('/user');
            } else {
                res.render('login', {title: 'Login Failed | Pixl Gate', loginFail: true});
            }
        });
    }
});

/* User Page */
app.get('/user/:path?', function(req, res){
    if(req.session.isLoggedIn === true) {

        var path;
        if(!req.params.path){
            path = 'profileinfo';
        } else {
            path = req.params.path
        }

        res.render('user', { title: 'User Area | Pixl Gate', path: path });

    } else {
        res.redirect('/login');
    }
});

app.get('/logout', function(req, res){
    req.session.isLoggedIn = false;
    res.redirect('/login');
    connection.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
