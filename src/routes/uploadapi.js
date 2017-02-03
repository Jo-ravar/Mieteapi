var router = require('express').Router();
var bookSchema = require('../models/model');
var userProductSchema = require('../models/userProduct')
var randnum=require('../utilities/randomnum');
var mongoose = require('mongoose');
var fs = require("fs");
var shortid = require('shortid');
var passport = require('passport');
var AWS=require('aws-sdk');
var S3_BUCKET='mieteapp-123';
AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAISDNWLMQT4UKNLDA";
AWS.config.secretAccessKey = "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";

 

router.route('/')
     .post(passport.authenticate('jwt', { session: false }),function(req,res){
         
         var s3 = new AWS.S3();
         var bodystream =   new Buffer(req.body.photo,'base64');
            var uniqueRefno =  shortid.generate(); 
             console.log(uniqueRefno);
         var params = {
         ACL: 'public-read',    
        'Bucket': S3_BUCKET,
        'Key': uniqueRefno+'.jpg',
        'Body': bodystream,
        'ContentEncoding': 'base64', 
     };

 
      
  s3.upload( params, function(err,data) {
     if(err)
     {
        
          console.log("Error in creating file " + JSON.stringify(err));
          res.send("Operation Failed");
     }
      
     else
     {
        
                 console.log("File created "); 
                 var newBook = new bookSchema();
                 newBook.name = req.body.name;
                 newBook.uniqueId=uniqueRefno;
                 newBook.rentAmo=req.body.Rentamo;
                 newBook.rentDuo=req.body.Rentduo;
                 newBook.contactno=req.body.Contactno;
                 newBook.category=req.body.Category;
                 newBook.gender=req.body.Gender;
                 newBook.advmoney=req.body.Advmoney;
                 newBook.location=req.body.Location;
                 newBook.imgpath = "https://s3.amazonaws.com/mieteapp-123/"+uniqueRefno+".jpg";
                 newBook.save(function (err, result) {
                  if (err) {
                             console.log("Error in insert " + JSON.stringify(err));
                             res.send("Insertion Failed");
                          } else {
                          console.log("Insert Successful " + JSON.stringify(result));
                          console.log(" user "+req.user);
                          var newProduct = new userProductSchema();
                          newProduct.userid= req.user._id;
                          newProduct.refno=uniqueRefno;
                          newProduct.save(function(err,result){
                              if(err)
                              {
                                console.log("Error in second insert " + JSON.stringify(err));
                                res.send("User Insertion Failed");
                            }
                            else{
                                console.log("Second Insert Successful " + JSON.stringify(result));
                                res.send("Your Rental ad is successfully uploaded");  
                            }
                                    
                          });
                        
                              }
     });                                  
     }
      
 });
            
});

router.route('/edit')
 .post(passport.authenticate('jwt', { session: false }),function(req,res){
    var s3 = new AWS.S3();
    var bodystream =   new Buffer(req.body.photo,'base64'); 
    var uniqueRefno =  randnum.uniqueNumber();
    var params = {
         ACL: 'public-read',    
        'Bucket': S3_BUCKET,
        'Key': uniqueRefno+'.jpg',
        'Body': bodystream,
        'ContentEncoding': 'base64', 
     };

     s3.upload(params,function(err,done) {
     if(err)
     {
        
          console.log("Error in creating file " + JSON.stringify(err));
          res.send("Operation Failed");
     }
      
     else
     {
         var newData={
                 name : req.body.name,
                 uniqueId:uniqueRefno,
                 rentAmo:req.body.Rentamo,
                 rentDuo:req.body.Rentduo,
                 contactno:req.body.Contactno,
                 category:req.body.Category,
                 gender:req.body.Gender,
                 advmoney:req.body.Advmoney,
                 location:req.body.Location,
                 imgpath : "https://s3.amazonaws.com/mieteapp-123/"+uniqueRefno+".jpg"
         }
         var query ={uniqueId:req.body.uid}
         bookSchema.update(query,{$set:newData},{new:false},function(err,result){
            if(err)
            {
                console.log("Error in products first editing "+JSON.stringify(err));
                res.send({ success: false, message: 'Unsuccessful' });
            }
            else
            {
                var newdata={
                     userid:  req.user._id,
                     refno: uniqueRefno
                }
                var query2 ={refno:req.body.uid}
                userProductSchema.update(query2,{$set:newdata},{new:false},function(err,result){
                     if(err)
                 {
                console.log("Error in products Second editing "+JSON.stringify(err));
                res.send({ success: false, message: 'Unsuccessful' });
               }
               else
               {
                    console.log("New Data"+JSON.stringify(result));
                   res.send({ success: true, message: 'Rental Ad successfully Edited.' });
               }
                });
            }
         });
     }
    });

});
router.route('/myorders')
   .post(passport.authenticate('jwt', { session: false }),function(req,res){
    var data = orders( req.user._id);
    var rent = myproducts(data)
    
    res.send(rent);
 });

router.route('/delete')
 .post(passport.authenticate('jwt', { session: false }),function(req,res){

var query={uniqueId:req.body.uid};
bookSchema.remove(query,function(err,result){
    if(err)
    {
        console.log("Error in  first deleting " + JSON.stringify(err));
        return res.json({ success: false, message: 'Deletion failed'});
    }
    else
    {
      var qry ={refno:req.body.uid};
      userProductSchema.remove(qry,function(err,result){
          if(err)
       {
        console.log("Error in  Second deleting " + JSON.stringify(err));
        return res.json({ success: false, message: 'Deletion failed'});
       }
       else
        {
          console.log("Deletion Successful " + JSON.stringify(result));
          res.json({ success: true, message: 'Successfully Deleted.' });
        }
      });
    }
});

  });

function orders(UserId)
{
   var result=[];
 

   
  userProductSchema.find({userid:UserId},function(err,data){
             if (err) {
                       console.error(JSON.stringify(err));
                    
                     }
                else {
                     console.log("Data"+data.length)
                      if(data.length>0)
                    {
                        for(var i=0 ;i<data.length; i++)
                        {
                            console.log(" Elements "+data[i].refno)
                            result.push(data[i].refno);
                        }
                    }
                      }
            });
              require('deasync').sleep(100);

            return result;
}

function myproducts(data)
{
     var result =[]
    bookSchema.find({uniqueId:{$in:data}},function(err,data){
        if(err)
        {
              console.error(JSON.stringify(err));
        }
         else {
                      console.log("Maje me "+data.length);
                        result =data;
                }
    });
      require('deasync').sleep(100);

            return result;
}



 module.exports = router;   