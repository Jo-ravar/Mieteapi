var express = require('express'); //importing express modulue
var router = express.Router();  //creating router object
var User = require('../models/user');  
var passport = require('../utilities/passport');
var jwt = require('jsonwebtoken'); 
var config = require('../utilities/config');
var Passport = require('passport');

router.route('/register')
.post(function(req, res) {  
  if(!req.body.email || !req.body.password) {
    res.json({ success: false, message: 'Please enter email and password.' });
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      name:req.body.name,
      address:req.body.address,
      phone:req.body.phone
    });

    // Attempt to save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({ success: false, message: 'That email address already exists.'});
      }
      res.json({ success: true, message: 'Successfully created new user.' });
    });
  }
});

router.route('/login')
.post( function(req, res) {  

 User.findOne({  email: req.body.email }, function (err, user) {
      if (err) { throw err; }
      else{
        if (!user) {  res.send({ success: false, message: 'Authentication failed. User not found.' }); }
      else{
        if (user.password !== req.body.password) { 
          res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
      }else{
      var payload = {id: user._id};
       var token = jwt.sign(payload, config.secret,{
            expiresIn: 10080 // in seconds
          });
          res.json({ success: true, token: 'JWT ' + token });
      } }} });

});

router.route('/edit')
 .post(Passport.authenticate('jwt', { session: false }),function(req,res){


   var nameStr = req.body.name;
   var addresstr = req.body.address;
   var phoneStr= req.body.phone;
   var emailStr= req.body.email.toLowerCase();
   var passwordStr=req.body.password;
    var newData={
      email:emailStr,
      password:passwordStr,
      name:nameStr,
      phone:phoneStr,
      address:addresstr
    }
    var id =req.user._id;
    var query={_id:id};

    User.update(query,{$set:newData},{new:false},function(err,result){
      if(err)
      {
        console.log("Error in Editing"+JSON.stringify(err));
        res.send({ success: false, message: 'Unsuccessful' });
      }
      else
      {
         console.log("New Data"+JSON.stringify(result));
         res.send({ success: true, message: 'Profile Updated' });
      }
    });

 });
 router.route('/getuser')
 .post(Passport.authenticate('jwt', { session: false }),function(req,res){
    var id =req.user._id;
    var query={_id:id};
    User.find(query,function(err,data){
       if (err) {
                    console.error(JSON.stringify(err));
                }
                else {
                      console.log(" USer data send"+data);
                        res.send(data);
                }
    })
 
 });

module.exports = router;