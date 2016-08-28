<p align="center">
  <a href="http://gulpjs.com">
    <img src="https://raw.githubusercontent.com/uptownhr/hackable/master/public/site/img/hackable-logo.png">
  </a>
  <p align="center">Personal site starter for nodejs developers.</p>
</p>

[![Build Status](https://travis-ci.org/uptownhr/hackable.svg)](https://travis-ci.org/uptownhr/hackable)
[![Dependency Status](https://david-dm.org/uptownhr/hackable.svg)](https://david-dm.org/uptownhr/hackable)
[![devDependency Status](https://david-dm.org/uptownhr/hackable/dev-status.svg)](https://david-dm.org/uptownhr/hackable)
[![Gitter chat](https://badges.gitter.im/uptownhr/hackable.png)](https://gitter.im/uptownhr/hackable)
[![Coverage Status](https://coveralls.io/repos/github/uptownhr/hackable/badge.svg?branch=master)](https://coveralls.io/github/uptownhr/hackable?branch=master)

# hackable
Personal site starter for nodejs developers.

Hackable comes pre-built with an admin that is easy to hack with your nodejs chops. Hackable keeps things familiar and uses libraries common to expressjs or koajs. No new API's to learn - no magic. 

The goal of the project is to provide you with a hackable prototype that you can mold to your liking.

If you've been thinking about creating a personal site or a site for your project, give Hackable a shot!.

## [Demo](http://hackable.penguin.ws)

Admin Login: admin@admin.com / asdfasdf

To access admin, use pull-down menu once logged in as admin or go to /admin

## Main Stack
- Koa / Express (older release [1.4.0](https://github.com/uptownhr/hackable/releases/tag/v2.0.0)
- Mongoose
- Pug (previously known as Jade)
- Passport

## Features
- Login
  - Email / Password
  - Twitter, Github, Facebook, Gmail
- Admin
  - Users
  - Posts
  - Projects
  - Products
  - Files
- Website
  - Landing Page
    - Projects
    - Products
  - Blog

## Getting Started
The easiest way to get started and the workflow we recommend is using docker. Docker handles the service depencies for the application to run. For example, Mongodb and Redis will be started and connected to the application automaticlaly. You do not have to worry about installation steps or muddying your host machine with additional services. 

If you have docker available, you can get started in two steps.

### Steps
1. git clone git@github.com:uptownhr/hackable
2. cd hackable
3. docker-compose up
4. visit http://localhost:3000 on your browser *if running docker on osx/windows, you'll use the vbox IP instead of localhost

### Docker Installation
1. [install docker](https://docs.docker.com/engine/installation/)
2. [install docker-compose](https://docs.docker.com/compose/install/)

### NPM Helper commands
- Getting into the app container: `npm run docker-app`
- Getting into the mongo shell: `npm run docker-mongo`
- NPM inside the app container: `npm run docker-npm`

## Guides and Examples
- [getting started without docker](docs/getting-started-without-docker.md)
- [creating admin crud pages](docs/crud.md)
- [adding passport oauth providers](docs/passport.md)
- [docker basics](docs/docker.md)

[all guides](docs)

## List of Packages

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| babel-preset-stage-3            | To obtain latest approved JS features                                 |
| babel-register                  | To auto compile on runtime                                            |
| bcrypt-nodejs                   | Library for hashing and salting user passwords.                       |
| bluebird                        | Promise Utility                                                       |
| crypto                          | To create hash                                                        |
| koa                             | Node.js framework using async                                         |
| koa-bodyparser                  | koa middleware gives, ctx.request.body                                |
| koa-convert                     | koa middleware to convert to new 2.0 middleware style                 |
| koa-generic-session             | koa middleware handles cookies and session                            |
| koa-multer                      | koa middleware handles file uploads                                   |
| koa-passport                    | koa middleware single-sign on                                         |
| koa-pug                         | koa middleware view template (formly known as jade)                   |
| koa-redis                       | koa middleware redis sessionas                                        |
| koa-router                      | koa middleware creating controllers                                   |
| koa-static                      | koa middleware serve static files                                     |
| koa-validate                    | koa middleware request validation                                     |
| mongoose                        | MongoDB ODM.                                                          |
| passport-facebook               | Sign-in with Facebook plugin.                                         |
| passport-github                 | Sign-in with GitHub plugin.                                           |
| passport-google-oauth           | Sign-in with Google plugin.                                           |
| passport-twitter                | Sign-in with Twitter plugin.                                          |
| passport-instagram              | Sign-in with Instagram plugin.                                        |
| passport-local                  | Sign-in with Username and Password plugin.                            |
| passport-oauth                  | Allows you to set up your own OAuth 1.0a and OAuth 2.0 strategies.    |
| stripe                          | Offical Stripe API library.                                           |
| lodash                          | Handy JavaScript utlities library.                                    |
| mocha                           | Test framework.                                                       |
| chai                            | BDD/TDD assertion library.                                            |
| supertest                       | HTTP assertion library.                                               |
| qs                              | parse query string                                                    |
| remarkable                      | parse and convert markdown                                            |
