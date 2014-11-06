var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

//Including Routes
var indexRoute = require('./routes/index');
var registerRoute = require('./routes/register');
var loginRoute = require('./routes/login');
var userRoute = require('./routes/user');
var logoutRoute = require('./routes/logout');
var resetRoute = require('./routes/reset');
var gameRoute = require('./routes/play.js');

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

app.use('/', indexRoute);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/user', userRoute);
app.use('/logout', logoutRoute);
app.use('/reset', resetRoute);
app.use('/play', gameRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* error handlers */
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
