const router = require('express').Router(),
  User = require('../models/User');

router.get('/account', function(req,res){
  var user = req.user.profile;
 
  res.render('account', { query : {
    first_name: user.name.split(' ')[0],
    last_name: user.name.split(' ')[1],
    email: user.email
  }})
})

router.post('/account', function(req,res,next){
  const body = req.body;
  var name = body.first_name ? body.first_name + ' ' + body.last_name : req.user.name;
  var email = body.email ? body.email : req.user.email;

  if (body.email)
    req.assert('email', 'Email is not valid').isEmail();
  
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/user/account');
  }

  User.update({_id: req.user._id}, { profile : {name: name}, email : email}, function(err,doc){
    if (err){
      req.flash('errors', {msg: 'Error: Could not update.'});
      return res.redirect('/user/account');
    } else {
      req.flash('success', { msg: 'Success! Account updated!' });
      return res.redirect('/user/account')
    }
  })    
})

module.exports = router
