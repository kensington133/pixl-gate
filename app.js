var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var mysql = require('mysql');

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
app.use(express.static(path.join(__dirname, 'public')));

//ROUTING

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

        connection.query('SELECT * FROM users_table', function(err, rows, fields) {
            if(err) { throw err; }

            console.warn('The solution is: ' + rows[0].solution);
        });
    } else {
        console.warn('Err: No Connection to MySQL Database');
        res.render('register', { title: 'Register | Pixl Gate', showForm: false });
    }
});

/* User Page */
app.get('/user', function(req, res){
    res.render('user', { title: 'User Area | Pixl Gate' });
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
