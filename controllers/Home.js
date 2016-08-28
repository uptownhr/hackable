const router = require('koa-router')({ prefix: '' })

const async = require('async'),
  Promise = require('bluebird'),
  config = require('../config'),
  { Project, Contact, Product } = require('../models')

const stripe = require('stripe')(config.payment.stripe.secret_key)

router.get('/', async ctx => {
  const [projects, products] = await Promise.all([Project.find(), Product.find()])

  ctx.render('index', {
    projects,
    products,
    stripe: config.payment.stripe.public_key
  }, true)
})

router.post('/charge', async ctx => {
  const stripeToken = ctx.request.body.stripeToken
  const product = await Product.findOne({ _id: ctx.request.body.id })

  try {
    let charge = await stripe.charges.create({
      amount: product.price * 100, //cents
      description: product.name,
      currency: 'usd',
      source: stripeToken
    })
  }catch (err) {
    if (err && err.type == 'StripeCardError') {
      ctx.flash.errors = [{ msg: 'Error: Card has been declined.' }]
    } else if (err) {
      ctx.flash.errors = [{ msg: 'Error: Payment did not go through.' }]
    }
  }

  ctx.flash.success = [{ msg: 'Success: Payment has been accepted.' }]
  ctx.redirect('/')
})

// contact us route
router.get('/contact', async ctx => {
  ctx.render('contact')
})

// post contact data to model
router.post('/contact', async ctx => {
  const body = ctx.request.body

  var contact = new Contact({
    name: body.name,
    email: body.email,
    message: body.message,
    created: body.created
  })

  try {
    await contact.save()
    ctx.flash('success', ['Your message was sent successfully, Thank You!'])
  } catch (e) {
    ctx.flash('errors', ['Contact Info Was Not Saved!']);
  }

  ctx.redirect('/contact');
}) //end of post request

module.exports = router
