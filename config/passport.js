const config = require('../config'),
  _ = require('lodash'),
  passport = require('koa-passport'),
  User = require('../models/User')

const LocalStrategy = require('passport-local').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const InstagramStrategy = require('passport-instagram').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GitHubStrategy = require('passport-github').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/**
 * Login Required middleware.
 */
exports.isAuthenticated = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await next()
  }

  if (!ctx.isAuthenticated()) {
    ctx.session.returnTo = ctx.request.originalUrl
    ctx.redirect('/auth/login')
  }
}

/**
 * Role is admin
 */
exports.isAdmin = async (ctx, next) => {
  if (ctx.req.user && ctx.req.user.role == 'admin') return await next()
  ctx.body = 'Only admins may access the admin page'
}

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
  User.findOne({ email: email.toLowerCase() }, function (err, user) {
    if (!user) {
      return done(null, false, { message: 'Email ' + email + ' not found.' });
    }

    user.comparePassword(password, function (err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid email or password.' });
      }
    });
  });
}));

/**
 * Find User for provider name and provider id
 * @param provider
 * @param id
 * @returns User.promise
 */
function findProviderUser(provider, id) {
  const elemMatch = { $elemMatch: { id, name: provider } }
  return User.findOne({ providers: elemMatch })
}

/**
 * Handls the oauth login callback
 * Aim is to be a general handler for all oauth providers
 * @param profileMapper
 * @returns {Function}
 */
function handleOauthLogin(profileMapper) {
  return async function (req, accessToken, secondaryToken, profile, done) {
    const providerName = profile.provider
    const mappedProfile = profileMapper(profile)
    const provider = { id: profile.id, accessToken, secondaryToken, name: providerName }

    if (req.user) {
      //check if this oauth login is already being used
      let user = await findProviderUser(providerName, profile.id)

      if (user) {
        req.flash('errors',
          { msg: `There is already a ${provider.name}
            account that belongs to you. Sign in with that account or
            delete it, then link it with your current account.` });
        return done()
      }

      req.user.providers.push(provider)
      let saved = await req.user.save()
      req.flash('success', { msg: providerName + ' account has been linked.' })
      return done(null, saved)
    }else {
      findProviderUser(providerName, profile.id)
        .then(user => {

          //if user found, update profile info and log user in
          if (user) {

            //use oauth profile values if site values is undefined or ''
            _.extendWith(user.profile, mappedProfile, function (obj, src) {
              return (_.isUndefined(obj) || obj == '') ? src : obj
            })

            return user.save(err => {
              done(err, user);
            })
          }

          //user not found, register user and login
          user = new User()
          user.profile = mappedProfile
          user.providers.push(provider)
          user.email = `${user.profile.name}@${provider}.com`

          user.save(err => done(err, user))
        })
    }
  }
}

/**
 * Maps Facebook profile info to User.profile
 * @param profile
 * @returns {{id: *, name: *, gender: *, location: '', website: '', picture; *}}
 */
function mapFacebookProfile(profile) {
  return {
    id: profile.id,
    name: profile.displayName,
    gender: profile.gender,
    location: '',
    website: '',
    picture: profile._json.picture.data.url
  }
}

/**
 * Instantiate FacebookStrategy
 * Using handleOauthLogin and mapFacebookProfile
 */
passport.use(new FacebookStrategy({
  clientID: config.social.facebook.client_id,
  clientSecret: config.social.facebook.client_secret,
  callbackURL: '/auth/o/facebook/callback',
  profileFields: ['id', 'displayName', 'gender', 'profileUrl', 'photos'],
  passReqToCallback: true
}, handleOauthLogin(mapFacebookProfile)))

/**
 * Maps Twitter profile info to User.profile
 * @param profile
 * @returns {{id: *, name: *, gender: '', location: (*|userSchema.profile.location|
 * {type, default}|Location|String|number|DOMLocator), website: '', picture: *}}
 */
function mapTwitterProfile(profile) {
  return {
    id: profile.id,
    name: profile.displayName,
    gender: '',
    location: profile._json.location,
    website: '',
    picture: profile._json.profile_image_url_https
  }
}

/**
 * Instantiate TwitterStrategy
 * Using handleOauthLogin and mapTwitterProfile
 */
passport.use(new TwitterStrategy({
  consumerKey: config.social.twitter.consumer_key,
  consumerSecret: config.social.twitter.consumer_secret,
  callbackURL: '/auth/o/twitter/callback',
  passReqToCallback: true
}, handleOauthLogin(mapTwitterProfile)))

/**
 * Maps Github profile into User.profile
 * @param profile
 * @returns {{id: *, name: *, gender: '', location: *, website: '', picture; ''}}
 */
function mapGithubProfile(profile) {
  return {
    id: profile.id,
    name: profile.displayName,
    gender: '',
    location: profile._json.location,
    website: '',
    picture: profile._json.avatar_url
  }
}

/**
 * Instantiate GitHubStrategy
 */
passport.use(new GitHubStrategy({
  clientID: config.social.github.client_id,
  clientSecret: config.social.github.client_secret,
  callbackURL: '/auth/o/github/callback',
  passReqToCallback: true
}, handleOauthLogin(mapGithubProfile)))

/**
 * Maps Instagram profile info to User.profile
 * @param profile
 * @returns {{id: *, name: *, gender: '', location: '', website: *, picture: *}}
 */
function mapInstagramProfile(profile) {
  return {
    id: profile._json.data.id,
    name: profile._json.data.full_name,
    gender: '',
    location: '',
    website: profile._json.data.website,
    picture: profile._json.data.profile_picture
  }
}

/**
 * Instantiate InstagramStrategy
 */
passport.use(new InstagramStrategy({
  clientID: config.social.instagram.client_id,
  clientSecret: config.social.instagram.client_secret,
  callbackURL: '/auth/o/instagram/callback',
  passReqToCallback: true
}, handleOauthLogin(mapInstagramProfile)))

/**
 * Maps Google profile info to User.profile
 * @param profile
 * @returns {{id: *, name: *, gender: *, location: '', website: '', picture: *}}
 */
function mapGoogleProfile(profile) {
  return {
    id: profile.id,
    name: profile.displayName,
    gender: profile._json.gender,
    location: '',
    website: '',
    picture: profile._json.image.url
  }
}

/**
 * Instantiate GoogleStrategy
 * Using handleOauthLogin and mapGoogleProfile
 */
passport.use(new GoogleStrategy({
  clientID: config.social.google.client_id,
  clientSecret: config.social.google.client_secret,
  callbackURL: '/auth/o/google/callback',
  passReqToCallback: true,
  scope: 'https://www.googleapis.com/auth/plus.login'
}, handleOauthLogin(mapGoogleProfile)))
