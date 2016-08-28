const router = require('koa-router')({ prefix: '/user' })
const User = require('../models/User'),
  _ = require('lodash'),
  passport = require('../config/passport')

router.use(passport.isAuthenticated)

router.get('/account', function (ctx, next) {
  var user = ctx.req.user

  var providers = {
    twitter: false,
    facebook: false,
    instagram: false,
    github: false,
    google: false
  }

  user.providers.forEach(function (p) {
    if (providers[p.name] !== 'undefined') {
      providers[p.name] = true
    }
  })

  ctx.render('account', { user, providers })
})

router.post('/account', async (ctx, next) => {
  const { name, email } = ctx.request.body

  ctx.checkBody('email', 'Email is not valid').isEmail()

  if (ctx.errors) {
    ctx.flash('errors', ctx.errors)
    return ctx.redirect('/user/account')
  }

  ctx.req.user.profile.name = name
  ctx.req.user.email = email

  try {
    let saved = await ctx.req.user.save()
    ctx.flash('success', { msg: 'Success! Account updated!' })
    return ctx.redirect('/user/account')
  } catch (e) {
    ctx.flash('errors', { msg: 'Error: Could not update.' })
    return ctx.redirect('/user/account')
  }
})

router.get('/account/unlink/:provider', async (ctx, next) => {
  const user = ctx.req.user
  const provider = ctx.params.provider
  const providers = _.filter(user.providers, function (p) {
    return p.name !== provider
  })

  user.providers = providers

  let saved = await user.save()

  ctx.flash('success', { msg: provider + ' account has been unlinked.' })
  ctx.redirect('/user/account')
})

module.exports = router
