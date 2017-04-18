const router = require('express').Router(),
  Promise = require('bluebird'),
  User = require('../models/User'),
  config = require('../config'),
  Project = require('../models/Project'),
  Contact = require('../models/Contact'),
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

// contact us route 
router.get('/contact', function (req, res) {
  res.render('contact.jade');
})

/**** Code Vick wrote over weekend, need to double check *****/
// Currently commented out because uncommenting breaks the app. 
// Keeping code for further analysis by James 
// POST Saving Individual Contact Info to Mongo
/*router.post('/admin/contact', function (req, res) {
  var id = req.body.id;
  var body = req.body;
  Contact.findOne({ _id: id }, function(err, contact)) {
    if (contact) {
        contact.name = body.name;
        contact.email = body.email;
        contact.message = body.message;
        contact.created = body.created;
        contact.save(function(err, saved) {
            res.redirect('/admin/contacts');
        }) //end of save method
    } //end of if clause
    else { // new contact instance
      var contact = new Contact({
        name: body.name;
        email: body.email;
        message: body.message;
        created: body.created;
      })
      contact.save(function(err, saved) {
        res.redirect('/admin/examples')
      }) 
    }
  }
})*/ //end of post request


/**** End of Vick's code *****/


module.exports = router
