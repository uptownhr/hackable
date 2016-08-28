const router = require('koa-router')({ prefix: '/auth' })

const config = require('../config'),
  User = require('../models/User'),
  queryString = require('querystring'),
  passport = require('koa-passport')

router.get('/login', async ctx => {
  ctx.render('login')
})

router.post('/login', async (ctx, next) => {
  ctx.checkBody('email', 'Email is not valid').isEmail()
  ctx.checkBody('password', 'Password must be at least 6 characters long').len(6)

  if (ctx.errors) {
    ctx.flash('errors', ctx.errors)
    return ctx.redirect('login')
  }

  await passport.authenticate('local', function (user, info, status) {
    if (!user) {
      ctx.flash('errors', [info.message])
      return ctx.redirect('/auth/login')
    }

    ctx.flash('success', ['Success! You are logged in.'])
    ctx.redirect('/')
    return ctx.logIn(user)
  })(ctx, next)
})

router.get('/register', async ctx => {
  ctx.render('register', {
    query: ctx.req.query || {}
  })
})

router.get('/logout', async ctx => {
  ctx.logout()
  ctx.redirect('/')
})

router.post('/register', async ctx => {
  ctx.checkBody('email', 'Email is not valid').isEmail()
  ctx.checkBody('password', 'Password must be at least 6 characters long').len(6)

  const body = ctx.request.body

  if (ctx.errors) {
    ctx.flash('errors', errors)
    delete body.password

    return res.redirect('/auth/register?' + queryString.stringify(body))
  }

  const user = new User({
    email: body.email,
    password: body.password,
    profile: {
      name: body.first_name + ' ' + body.last_name
    }
  })

  const existingUser = await User.findOne({ email: body.email })

  if (existingUser) {
    ctx.flash('errors', ['Account with that email address already exists.'])
    return ctx.redirect('/auth/register')
  }

  const saved = await user.save()
  await ctx.logIn(saved)
  ctx.flash('success', ['Successfully registered'])
  ctx.redirect('/')
})

router.get('/o/:provider', async (ctx, next) => {
  const provider = ctx.params.provider
  if (config.social.hasOwnProperty(provider)) {
    return passport.authenticate(provider)(ctx, next)
  } else {
    ctx.redirect('/')
  }
})

router.get('/o/:provider/callback', async (ctx, next) => {
  const provider = ctx.params.provider

  if (config.social.hasOwnProperty(provider)) {
    return passport.authenticate(provider, { failureRedirect: '/auth/login' })(ctx, next)
  } else {
    ctx.redirect('/')
  }
}, function (ctx, next) {

  ctx.redirect(ctx.session.returnTo || '/')
})

router.get('/askEmail', ctx => {
  ctx.render('askEmail')
})

router.post('/askEmail', async ctx => {
  ctx.checkBody('email', 'Email is not valid').isEmail()

  if (ctx.errors) {
    ctx.flash('errors', ctx.errors)
    return ctx.redirect('/auth/askEmail')
  }

  const body = ctx.request.body

  ctx.req.user.askEmail = false
  ctx.req.user.email = body.email

  await ctx.req.user.save()

  ctx.redirect('/')
})


module.exports = router
