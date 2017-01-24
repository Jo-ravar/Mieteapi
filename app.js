var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
//var db = 'mongodb://localhost:27017/img';
//mongoose.connect(db);
mongoose.connect(process.env.MONGODB_URI);
require('./src/utilities/passport')(passport);
var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine','hbs');
app.set('views','src/views');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(passport.initialize());

var indexRoute=require('./src/routes/index');
var bookRoute=require('./src/routes/books');
var uploadRoute=require('./src/routes/uploadapi');
var apiRoute=require('./src/routes/api');
app.use('/',indexRoute);
app.use('/books',bookRoute);
app.use('/upload',uploadRoute);
app.use('/api',apiRoute);

app.listen(3000,function(err) {
    if(!err)
    {
        console.log("server started at port 3000");
    }
});