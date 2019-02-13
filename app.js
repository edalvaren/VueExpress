
//requirements
/* Require all dependencies..duh */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
var io = require('socket.io');

// Add real time socket functionality
//allow cross origin requests
var cors = require('cors');
var corsOptions = {
  "origin": ["http://localhost:8081", "http://192.168.128.33:8081"],
  "allowedHeaders": "Content-Type,Authorization",
  "credentials": false,
  "optionsSuccessStatus": 204
};
const allowedOrigins = ['http://localhost:8081',
  'http://192.168.128.33:8081'];


//spawns child processes.. dirty
const { spawn } = require('child_process');
//our main app object


var app = express();




/* Socket IO functionality */
// io.on("connection", function( socket ) {
//   console.log("A user connected");
// });



// //TODO encapsulate the spawning of a child process
// const child = spawn('node', ['ethernet.js'], {
//   cwd: './'
//     });
// child.stdout.on('data', (data) => {
//
//   // console.log(`child stdout: \n${data}`);
// });
// child.on('message', (msg) => {
//   // console.log(`message: \n${msg}`);
// });
//
//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
