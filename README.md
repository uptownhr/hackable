
[![Build Status](https://travis-ci.org/uptownhr/hackable.svg)](https://travis-ci.org/uptownhr/hackable)
[![Dependency Status](https://david-dm.org/uptownhr/hackable.svg)](https://david-dm.org/uptownhr/hackable)
[![devDependency Status](https://david-dm.org/uptownhr/hackable/dev-status.svg)](https://david-dm.org/uptownhr/hackable)
[![Gitter chat](https://badges.gitter.im/uptownhr/hackable.png)](https://gitter.im/uptownhr/hackable)
[![Coverage Status](https://coveralls.io/repos/github/uptownhr/hackable/badge.svg?branch=master)](https://coveralls.io/github/uptownhr/hackable?branch=master)

# hackable
Personal site starter for express developers.

Hackable comes pre-built with an admin that is easy to hack with your express chops. Hackable keeps things familiar and uses libraries common to express developers. No new API's to learn - no magic. 

The goal of the project is to provide you with a hackable prototype that you can mold to your liking.

If you've been thinking about creating a personal site or a site for your project, give Hackable a shot!.

## [Demo](http://hackable.penguin.ws)

Admin Login: admin@admin.com / asdfasdf

To access admin, use pull-down menu once logged in as admin or go to /admin

## Main Stack
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

## Guides and Examples
- [getting started without docker](docs/getting-started-without-docker.md)
- [creating admin crud pages](docs/crud.md)
- [adding passport oauth providers](docs/passport.md)
- [docker basics](docs/docker.md)

[all guides](docs)
