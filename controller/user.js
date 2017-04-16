var express = require('express');
var router = express.Router();
var models = require('../models/user');
var model = require('../models/admin');

router.route('/')
.get(function(req,res){
	res.render('signup');
})
.post(function(req,res){
	var newUser = new models.User({
		username: req.body.username,
		email: req.body.email,
		sex: req.body.sex,
		birthday : req.body.birthday,
		password: req.body.password

	});
	newUser.save(function(error){
		if(error){
			console.log(error);
		}else{
			res.redirect('/login');
		}
	})
});
router.route('/admin')
.get(function(req,res){
	res.render('admin');
})
.post(function(req,res){
	var newUser = new model.Admin({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password

	});
	newUser.save(function(error){
		if(error){
			console.log(error);
		}else{
			res.redirect('/login');
		}
	})
});


module.exports = router;

