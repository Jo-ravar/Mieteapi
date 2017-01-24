var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({

name: String,
uniqueId:{type:String,unique:true,required:true},
imgpath:String,
rentAmo:String,
rentDuo:String,
contactno:String,
gender:String,
advmoney:String,
category:String,
location:String
});



module.exports = mongoose.model('img',bookSchema);