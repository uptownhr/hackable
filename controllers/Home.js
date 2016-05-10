const router = require('express').Router(),
  Promise = require('bluebird'),
  User = require('../models/User'),
  config = require('../config'),
  Project = require('../models/Project'),
  Product = require('../models/Product');

const stripe = require('stripe')(config.payment.stripe.secret_key);
router.get('/', function (req, res) {

  const projects = Project.find({}).exec()
  const products = Product.find({}).exec()
  
  Promise.all([projects, products]).then(docs => {
    res.render('index', {
      projects: docs[0],
      products: docs[1],
      stripe: config.payment.stripe.public_key
    })
  })
})

router.post('/charge', function (req, res) {
  const stripeToken = req.body.stripeToken

  Product.findOne({ _id: req.body.id }).exec().then(product => {
    var charge = stripe.charges.create({
      amount: product.price * 100, //cents
      description: product.name,
      currency: 'usd',
      source: stripeToken
    }, function (err, charge) {
      if (err && err.type == 'StripeCardError') {
        req.flash('errors', { msg: 'Error: Card has been declined.' });
      } else if (err) {
        req.flash('errors', { msg: 'Error: Payment did not go through.' });
      } else {
        req.flash('success', { msg: 'Success: Payment has been accepted.' });
      }
      res.redirect('/');
    });
  }).catch(e => console.log(err))
})

module.exports = router
