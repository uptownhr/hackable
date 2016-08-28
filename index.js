'use strict'
require('babel-register')

const app = require('./bootstrap'),
  controllers = require('./controllers'),
  models = require('./models'),
  passport = require('./config/passport')

app.use(controllers.Home.routes())
app.use(controllers.Auth.routes())
app.use(controllers.Post.routes())
app.use(controllers.User.routes())

app.use(controllers.Admin.routes())

module.exports = app
