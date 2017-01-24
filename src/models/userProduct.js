var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userProductSchema = new Schema({
  userid: String,
  refno: String
});


module.exports = mongoose.model('Products',userProductSchema);


