var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://127.0.0.1:27017/vcec', {useMongoClient: true});
var fs = require('fs');

//create uploads folder
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

if (!fs.existsSync('./uploads/images')) {
    fs.mkdirSync('./uploads/images');
}

if (!fs.existsSync('./uploads/videos')) {
    fs.mkdirSync('./uploads/videos');
}

if (!fs.existsSync('./uploads/pdf')) {
    fs.mkdirSync('./uploads/pdf');
}

mongoose.connection.on('error', function () {
    throw new Error('Database is not running');
});

mongoose.connection.once('open', function () {
    console.log('connected to database');
});

autoIncrement.initialize(mongoose.connection);

var authController = require('./auth/authController');
var portfolioRoute = require('./api/routes/portfolioRoutes');
var groupsRoute = require('./api/routes/groupsRoutes');
var categoryRoute = require('./api/routes/categoryRoutes');
var testimonialRoute = require('./api/routes/testimonialRoutes');
var subCategoryRoute = require('./api/routes/subCategoryRoutes');
var articleRoute = require('./api/routes/articleRoutes');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('./uploads'));

var uploadRoute = require('./api/routes/uploadRoutes');

//to enable loggin on console
app.use(morgan('dev'));

//CORS handling
app.use(function (req, res, next) {
    /*  var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
      if (auth) {*/
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Cache-Control ,Origin,Accept," +
        " X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization,x-access-token");
    next();
    /*  } else {
          var error = new Error('Unauthorized access!');
          error.status = 401;
          next(error);
      }*/
});

//redirect request to specific router
app.use('/group', groupsRoute);
app.use('/category', categoryRoute);
app.use('/portfolio', portfolioRoute);
app.use('/upload', uploadRoute);
app.use('/testimonial', testimonialRoute);
app.use('/subCategory', subCategoryRoute);
app.use('/article', articleRoute);
app.use('/api/auth', authController);

//to handle user requested path other that defined api path
app.use('/', function (req, res, next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//middleware to handle error thrown from anywhere(500 db errors)
app.use(function (error, req, res, next) {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;