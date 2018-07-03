var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// allow access to models
require("./models/author");
require("./models/book");

var index = require('./routes/index');
var users = require('./routes/users');

var dotenv = require('dotenv');
dotenv.config();
var url = process.env.MLAB_URL;

var app = express();

// mongoose --> mongoDB connection
var mongoose = require('mongoose');
mongoose.connect(url);
mongoose.Promise = global.Promise;
// Connection instance
var db = mongoose.connection;

// create Schema
const Schema = mongoose.Schema;
// const mySchema = new Schema({
//   name: { type: String, required: true },
//   age: { type: Number, min: 18, max: 90, required: true }
// });
// // create Model
// const testModel = db.model('TestModel', mySchema);
// // create instance
// const instance = new testModel();
// instance.name = "David";

/*
        first_name: { type: String, required: true, max: 100 },
        family_name: { type: String, required: true, max: 100 },
        date_of_birth: { type: Date },
        date_of_death: { type: Date },
*/

var authorModel = require('mongoose').model('Author');
var bookModel = require('mongoose').model('Book');

var author = new authorModel({
  first_name: "Tom",
  family_name: "Ka",
  date_of_birth: "6/22",
  date_of_death: "7/01"
});
author.save(function (err, model) {
  if (err) throw err;
  console.log("new author saved");
});

var book = new bookModel({
  title: "2001",
  summary: "very good",
  isbn: "001",
});
book.save(function (err, model) {
  if (err) throw err;
  console.log("new book saved");
});

/*
 title: { type: String, required: true },
        author: { type: Schema.ObjectId, ref: 'Author', required: false },
        summary: { type: String, required: true },
        isbn: { type: String, required: true },
        genre: [{ type: Schema.ObjectId, ref: 'Genre' }]
    }
  */


db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
