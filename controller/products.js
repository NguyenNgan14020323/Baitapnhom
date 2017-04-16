var express = require('express');
var router = express.Router();
var app = express();
var Product = require('../models/products');
var mongoose = require('mongoose');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var url =  'mongodb://localhost:27017/baitapnhom';
//Lay tat ca san pham
router.route('/')
.get(function(req,res){
	Product.find()
	.exec(function(error,product){
		if(error){
			res.json({message:'error'});
		}else{
			Product.count({},function(err,counter){
				res.json({total:counter,data:product});
			})
		}
	})
})
//them san pham
var multer= require('multer');
var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './public/image')
	  },
	  filename: function (req, file, cb) {
	    cb(null, file.originalname);
	  }
	})
	var upload = multer({ storage: storage })
router.route('/insert')
.get(function(req,res){
	res.render('index');
});

router.post('/insert',upload.single("file"),function(req,res){

	var product = new Product({
		image: "/image/"+ req.file.originalname,
		title: req.body.title,
		description: req.body.description,
		price: req.body.price
	});
	product.save(function(error){
		if(error){
			console.log(error);
		}else{
			res.redirect('/');
		}
	})
})
//Lay thong tin sua
router.post('/edit',function(req,res){
	var id = req.body.pro_id;
	Product.findById({'_id':ObjectID(id)},function(error,product){
		if(error){
			res.json({message:'error'});
		}else{
			Product.count({},function(err,counter){
				res.send(JSON.stringify(product));
			})
		}
	}
)});
//Sua
router.post('/loadedit',upload.single("file"),function(req,res){
	var newProduct = {
		image: "/image/"+ req.file.originalname,
		title: req.body.title,
		description:  req.body.description,
		price: req.body.price
	};
	var id = req.body.pro_id;
	mongo.connect(url,function(err,db){
		assert.equal(null,err);
		db.collection('products').updateOne({"_id":ObjectID(id)},{$set:newProduct},function(error,result){
				if(error){
			console.log(error);
		}else{
			res.redirect('/');
		}
			db.close();
		})
	})
})
//Lay thong tin xoa
router.route('/delete')
.post(function(req,res){
	var id = req.body.pro_id;
	mongo.connect(url,function(err,db){
		assert.equal(null,err);
		db.collection('products').deleteOne({"_id":ObjectID(id)},function(error,result){
			assert.equal(null,err);
			res.send(JSON.stringify(result));
			db.close();
		})
	})
})


  module.exports = router;