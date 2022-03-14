//var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000
//var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

// router collection
var teacherRouter = require('./routes/teacher');
var studentRouter = require('./routes/student');
var loginRouter = require('./routes/login');
var goForceRouter = require('./routes/goforce');
const { authenticateToken } = require('./middleware');
var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// app settings
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// set cors settings
app.use(cors({
  origin: "*" ,//"http://localhost:3000",
  methods: ["GET", "POST"] //limit http method
  //credentials: true //allowing cookies to send
}));

// app use router
app.use('/api/v1/teacher', teacherRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/goforce', goForceRouter);
app.use(authenticateToken);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, err => {
  if (err) {
    return console.log("ERROR", err);
  }
  console.log(`Server listening on port ${PORT}`);
  app._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      console.log(r.route.path)
    }
  })
  // console.log(process.env.API_ENDPOINT);
  // console.log(app._router.stack);
});
//module.exports = app;