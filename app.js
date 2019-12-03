
//requirements
/* Require all dependencies..duh */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const _ = require('lodash');
const morgan = require('morgan');

const winston = require('./config/winston');
// Add real time socket functionality
//allow cross origin requests
const cors = require('cors');
const corsOptions = {
  "origin": ["http://localhost:8081", "http://spiralcontrols.com", "http://spiralcontrols.com:8000",
    "http://172.16.31.104:8080",
    "138.197.69.15", "138.197.69.15:8000", "http://192.168.128.33:8081", "http://localhost:8083", "http://172.16.17.55:8080"],
  "allowedHeaders": "Content-Type,Authorization",
  "credentials": false,
  "optionsSuccessStatus": 204
};

//spawns child processes.. dirty
// const { spawn } = require('child_process');
//our main app object


const app = express();


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

const publicPath = path.join(__dirname, 'public');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* APP USE */


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicPath));


//morgan logging
app.use(morgan('combined', {stream: winston.stream}));



app.use('/', router);
//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};



  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

winston.info(publicPath);

/**  process handlers **/
process.stdin.resume();//so the program will not close instantly
function exitHandler(options, exitCode){
  if (options.cleanup) console.log('clean');
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));



module.exports = app;
