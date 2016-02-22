//Dependencies
//====================================================================
   var bodyParser   = require('body-parser');
   var compression  = require('compression');
   var cookieParser = require('cookie-parser');
   var express      = require('express');
   var favicon      = require('serve-favicon');
   var fs           = require('fs');
   var http         = require('http');
   var https        = require('https');
   var logger       = require('morgan');
   var session      = require('express-session');
   var path         = require('path');
   var i18n         = require('i18n');

//Create error log Stream
var errorLogStream = fs.createWriteStream(__dirname + '/logs/error.log', {flags: 'a'});

//Error handling, avoiding crash
process.on('uncaughtException', function (err) {
   var date = new Date();
   console.error("+++++++ "+ date + " error found, logging event +++++++ ");
   errorLogStream.write(date+ '\n'+ err.stack+'\n\n');
});

//Routes
//=====================================================================
var index      = require('./routes/index');
//var routei18n  = require('./routes/i18n');

//Express configuration
//======================================================================
var app = express();

//Compress middleware to gzip content
app.use(compression());
//app.use(favicon(__dirname + '/public/img/favicon.png'));

//View engine setup
//======================================================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('json spaces', 2);

var cacheTime = 86400000*30;

app.use(express.static(path.join(__dirname, 'public'),{maxAge: cacheTime}));

var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'});
app.use(logger('short', {stream: accessLogStream}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('wq.io'));

app.use(session({
   name: 'wq.io',
   secret:'KI(/ytGT%rtgjk_',
   saveUninitialized: true,
   resave: true,
   cookie: { maxAge: 1000*60*60*2 }
/*   store: new MongoStore({
      db: 'bc-sessions',
      host: 'localhost',
      collection: 'user-session',
      autoReconnect: true,
      clear_interval: 3600
   })*/
}));

// i18n Configuration =========================================================
/*
var i18nconf = {
   "locales"        : ["en", "es"],
   "cookie"         : "langcookiei18n",
   "defaultLocale:" : "es",
   "directory"      : path.join(__dirname, "lang"),
   "objectNotation" : true
};
i18n.configure(i18nconf);
app.use(i18n.init);

app.use(function(req, res, next){
   if(req.session.locale)
      req.setLocale(req.session.locale);
   next();
});
*/
//Routes usage =====================================================
app.use('/', index);
//app.use('/', routei18n);

//Disable server banner
app.disable('x-powered-by');



// error handlers
//=======================================================================
// catch 404 and forward to error handler
app.use( function(req, res, next) {
   var err = new Error('');
   err.status = 404;
   next(err);
});

// production error handler
app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('404', {
      msg: err.message,
      error: {},
      index: -1
   });
});

//Firing Up express
//====================================================================

app.set('port', process.env.PORT || 2020);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});


module.exports = app;
