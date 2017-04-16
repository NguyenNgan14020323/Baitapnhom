var express = require('express');
var app = express();
var router = express.Router();
var models = require('../models/user');
var session = require('express-session');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var logout = require('express-passport-logout');
var Product = require('../models/products');
var Transaction = require('../models/transaction');
var Cart = require('../models/cart');
var modelsadmin = require('../models/admin');

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     models.User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false);
//       }
//       if (user.password != password) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   models.User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

router.route('/')
.get(function(req,res){
  var option = {
      url: "http://localhost:3000/api",
      method: 'get'
  };
  request(option, function (error, response, list_user) {
      if(!error && response.statusCode == 200){
        res.render('home',{title: 'Shopping', products: JSON.parse(list_user).data})
      }
    });
});


router.route('/login')
.get(function(req,res){
  res.render('login');
})
.post(function(req,res){
  req.session.chklog = 3;
  models.User.findOne({'email':req.body.email,'password':req.body.password}).
  exec(function(err,value){
    if(err){
      alert('Loi dang nhap');
      res.redirect('/login');
    }else{
      if(value != null){
        req.session.chklog = 1;
        res.redirect('/');
      }else{
        modelsadmin.Admin.findOne({'email':req.body.email,'password':req.body.password}).
        exec(function(err,value1){
          if(err){
            redirect('/login');
          }else{
            if(value1 != null){
              req.session.chklog = 0;
              res.redirect('/');
            }else{
              res.redirect('/login');
            }
          }
        })
      }
    }

  })
})
// .post(passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/login',
//                                    failureFlash: true }));
router.get('/add-to-cart/:id',function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId,function(err,product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product,product.id);
    req.session.cart = cart;
    res.redirect('/');
  });
});
router.get('/shopping-cart',function(req,res,next){
  if(!req.session.cart){
    return res.render('shopping-cart',{products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shopping-cart',{products:cart.generateArray(),totalPrice:cart.totalPrice})
});

router.get('/checkout',function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('checkout',{total: cart.totalPrice})
});
router.post('/checkout',function(req,res,next){
  var transaction = new Transaction({
    user_name : req.body.name,
    address: req.body.address,
    user_email : req.body.email,
    user_phone : req.body.phone,
    amount : req.body.amount,
    stutus: 0
  });
  transaction.save(function(error){
    if(error){
      console.log(error);
    }else{
      req.session.cart = {};
      res.redirect('/');
    }
  })
})

router.route('/logout')
.get(function(req,res){
  logout();
  req.session.chklog = 3;
  res.redirect('/login');
})
module.exports = router;