'use strict'
const User = require('../models/User'),
  Post = require('../models/Post'),
  Project = require('../models/Project'),
  Product = require('../models/Product'),
  async = require('async'),
  db = require('mongoose').connection

//this seeder automatically runs on application startup but ...
//seeder only runs if a user without admin role exists
var Seeder = function () {
  return clearDb()
    .then(() => User.findOne({ role: 'admin' }))
    .then(user => {
      if (user) throw new Error(user)

      return new User({
        email: 'admin@admin.com',
        password: 'asdfasdf',
        role: 'admin',
        askEmail: false,
        profile: {
          name: 'Admin'
        }
      }).save()
    })
    .then(user=> new Post({
        title: 'First Blog Post',
        content: '# Sample Post H1\r\n\r\nThis is a sample post written in markdown.' +
        ' __Markdown on Save Improved__ will ensure that when this post is saved, ' +
        'it will retain its syntax.\r\n\r\n## Markdown Items (H2)\r\n\r\nWriting Markdown is ' +
        'extremely simple, but incase you have problems you can read about the syntax of ' +
        'Markdown [here](http://daringfireball.net/projects/markdown/syntax "Markdon: Syntax"), ' +
        'or read a useful cheat sheet [here]' +
        '(http://support.mashery.com/docs/customizing\\_your\\_portal/Markdown\\_Cheat\\_Sheet ' +
        '"Markdown Cheat Sheet")\r\n\r\n### Lists\r\n\r\n#### Unordered\r\n\r\n- ' +
        'An unordered list is super simple.\r\n- Just use a dash, esterisk, or plus sign.\r\n* ' +
        'You can even mix and match.\r\n+ Not that you would want to.\r\n\r\n#### ' +
        'Ordered\r\n\r\n1.Numbers.\r\n2. Just numbers.\r\n3. As simple as that.\r\n\r\n#### ' +
        'Definition List\r\n\r\nListDefined\r\n: A number of connected items or names written ' +
        'or printed consecutively, typically one below the other.\r\nItem Defined\r\n: ' +
        'An individual article or unit, esp. one that is part of a list, collection, ' +
        'or set.\r\n\r\n### Emphasis\r\n\r\n#### Italic\r\n\r\n_Italicising text_ ' +
        'is easy and can be *done* a couple of different ways.\r\n\r\n#### ' +
        'Bold\r\n\r\n__Bolding text__ is also easy and can be **done** a couple of different ' +
        'ways as well.\r\n\r\n### Escaping\r\n\r\nEscaping some symbols is required to make ' +
        'sure that Markdown doesnt interpret them as one of its own. These characters  ' +
        'include \\\\`\\*\\_\\{\\}\\[\\]\\(\\)\\#\\+\\-\\.\\!\\:\\|\r\n\r\n<small>Note: ' +
        'The good thing about markdown is that it also supports standard HTML. Oh, and you ' +
        "don't have to escape periods all of the time. So you ended a sentence with, " +
        '"in 1984 PERIOD". Well, you would want to escape that period, like "in 1984\\." ' +
        "so that Markdown doesn't interpret this as a list item.</small>",
        status: 'launched',
        _author: user._id,
      }).save())
    .then(post => new Project({
        name: 'hackable',
        tag_line: 'create your personal project',
        description: 'jump start your project with an admin, blog, products',
        logo_url: '/site/img/hackable-logo.png',
        project_url: 'https://github.com/uptownhr/hackable'
      }).save().then(() => new Project({
          name: 'honeybadger',
          tag_line: 'A hackathon starter built for simplicity',
          description: 'Creating Honeybadger, an opensource Ruby/Sinatra based CMS ' +
          'that helps you kickstart projects. It provides a boiler-plate code with the' +
          ' goal of being an extremely simple CMS alternative to Wordpress, Drupa, ' +
          'and etc.',
          logo_url: '/site/img/logo.svg',
          project_url: 'https://github.com/jaequery/honeybadger'
        }).save()
      )
    )
    .then(() => new Product({
        name: 'Sample Product',
        description: 'This is a sample product',
        price: '99.99',
        image_url: 'http://www.anchorpackaging.com/wp-content/uploads/2014/06/SampleKit.jpg'
      }).save()
    )
    .catch(err => err)
}

//only clear db if test
function clearDb() {
  const test = process.env.TEST;

  return new Promise((resolve, reject) => {
    if (!test) return resolve()

    for (var i in db.collections) {
      db.collections[i].remove()
    }

    setTimeout(function () {
      resolve()
    }, 500)
  })
}

module.exports = new Seeder()
