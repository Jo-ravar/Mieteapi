//used for creating mongoose schema for users who login

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
   email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name:String,
  address:String,
  phone:String
  
});

module.exports = mongoose.model('User', UserSchema);//use for exporting user schema.