var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors=require('cors');
var routes = require('./routes/index');
// var user=require('./routes/user');
var app = express();


//connection for mongo
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let configObj=require('./config/config');
// https:selomart.com/
// mongodb://sysop:moon@localhost/records
///mongoose.connect('mongodb://selomart:selomart@https:selomart.com/localshop', { promiseLibrary: require('bluebird') })
// mongoose.connect('mongodb://52.66.114.206:27017/localshop', { promiseLibrary: require('bluebird') })
mongoose.connect(configObj.dbconnectUrlProd, { promiseLibrary: require('bluebird') })
// mongoose.connect(configObj.dbconnectUrlDevelopement, { promiseLibrary: require('bluebird') })
// .exec()  
.then(() =>  console.log('connection succesful to database.'))
  .catch((err) => {
    console.log('There was problem while connecting to database.Check if mongodb is running.')
  console.error(err)
  });
// Parsers
// app.use(bodyParser.json());
app.use(bodyParser.json({ 'type': '*/*',limit: '20mb' }));

app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors());
app.use(logger('dev'));

app.use(cookieParser());

app.use('/',routes);
// app.use('/Students',Students);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
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
    console.log("Error Message 1 : "+err.message);
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
  console.log("Error Message 2 : "+err.message);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
