var router = require('express').Router();
var bookSchema = require('../models/model');
var mongoose = require('mongoose');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({ storage: storage });

router.route('/')
 .get(function (req,res){
       bookSchema.find({},function(err,data){
             if (err) {
                    console.error(JSON.stringify(err));
                    res.redirect('/');
                }
                else {
                      console.log("Maje me ");
                        res.send(data);
                }
            });
       });

router.route('/sportsfragment')
 .get(function (req,res){
       bookSchema.find({category:"Sports Wear"},function(err,data){
             if (err) {
                    console.error(JSON.stringify(err));
                    res.redirect('/');
                }
                else {
                      console.log("Sports ka data ");
                        res.send(data);
                }
            });
       });

  router.route('/footfragment')
 .get(function (req,res){
       bookSchema.find({category:"Foot Wear"},function(err,data){
             if (err) {
                    console.error(JSON.stringify(err));
                    res.redirect('/');
                }
                else {
                      console.log("Foot ka data ");
                        res.send(data);
                }
            });
       });  


router.route('/ethnicfragment')
 .get(function (req,res){
       bookSchema.find({category:"Ethnic Wear"},function(err,data){
             if (err) {
                    console.error(JSON.stringify(err));
                    res.redirect('/');
                }
                else {
                      console.log("Ethnic ka data ");
                        res.send(data);
                }
            });
       });  

router.route('/westernfragment')
 .get(function (req,res){
       bookSchema.find({category:"Western Wear"},function(err,data){
             if (err) {
                    console.error(JSON.stringify(err));
                    res.redirect('/');
                }
                else {
                      console.log("western ka data ");
                        res.send(data);
                }
            });
       });  
       



router.route('/add')
    .get(function (req, res) {
        res.render('add_book');
    })
    .post(upload.single('image'),function (req, res) {
         
         console.log(req.file);
                var newBook = new bookSchema();
                 newBook.name = req.body.name;
                 newBook.imgpath = "images/uploads/"+req.file.filename;
                 newBook.save(function (err, result) {
                  if (err) {
                             console.log("Error in insert " + JSON.stringify(err));
                             res.redirect('/books/add');
                          } else {
                          console.log("Insert Successful " + JSON.stringify(result));
                            res.redirect('/books');
                              }
     });
            
});
       
 module.exports = router;      
 